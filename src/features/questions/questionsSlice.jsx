import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setTotalSeconds } from '../../features/timer/timerSlice';
import { jwtDecode } from "jwt-decode";


// Fonction pour récupérer et décoder le token JWT de l'URL

const decodeTokenFromURL = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const tokenFromURL = hashParams.get('access_token');
    //console.log("tokken:",tokenFromURL);

    if (tokenFromURL) {
      try {
        const decodedToken = jwtDecode(tokenFromURL);
        localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
        console.log("DataUser:",decodedToken);
        return decodedToken;
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    } else {
      console.error('Aucun token trouvé dans l\'URL');
      return null;
    }
  };
  
const decodedToken = decodeTokenFromURL();


function shuffleArray(array) {
    const newArray = [...array]; 
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}


function convertDurationToSeconds(duration) {
    if (typeof duration !== 'string') {
        throw new Error('Invalid duration format');
    }
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}


const initialState = {
    questionsRedux: [],
    quiz: {}, 
    status: 'ready',
    index: 0,
    currentQuestion: {},
    answer: null,
    points: 0,
    highscore: 0 
}

export const selectQuizId = (state) => {
    const quizId = new URLSearchParams(window.location.search).get('quizId');
    console.log("quizId:",quizId)

    if (quizId) {
        localStorage.setItem('quizId', quizId);
    }
    return quizId;
};

  export const getQuestions = createAsyncThunk('questions/getQuestions', async (quizId, { dispatch, getState }) => {
    try {
      const quizId = localStorage.getItem('quizId');
    if (!quizId) {
        throw new Error('Quiz ID not found in localStorage');
    }
  
      const resp = await fetch(`http://localhost:3000/quiz/findoneQuiz/${quizId}`);
      if (!resp.ok) {
        throw new Error('Failed to fetch questions');
      }
  
      const data = await resp.json();
      const { duration } = data.quiz;
      const initialSeconds = convertDurationToSeconds(duration);
      console.log("time:", initialSeconds);
      dispatch(setTotalSeconds(initialSeconds));
      console.log("time2:", dispatch(setTotalSeconds(initialSeconds)));
  
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers:{
        newAnswer: (state, {payload}) =>{
            state.answer = payload;
            state.points = payload === state.currentQuestion.correctAnswers[0] ? 
                state.points + 20 : state.points;
        },
        
        // newAnswer: (state, {payload}) =>{
        //     if (state.currentQuestion.correctAnswers.includes(payload)) {
        //         state.answer = payload;
        //         state.points += 20;
        //     } else {
        //         state.answer = null; // Set the answer even if incorrect
        //     }
        // },
        nextQuestion: (state)=>{
            let temp = state.questionsRedux[state.index + 1];
            let correctAnswers = temp.answers.filter(answer => answer.iscorrect === true).map(answer => answer.content);
            let newArray = {
                id: temp.id, 
                correctAnswers: correctAnswers, 
                question_content: temp.question_content, // Ajout du contenu de la question
                answers: temp.answers.map(answer => ({ content: answer.content, iscorrect: answer.iscorrect })),
                options: shuffleArray([...temp.answers.map(answer => answer.content), ...correctAnswers])
            };
            state.index += 1;
            state.currentQuestion= newArray;
            state.answer= null;
        },
        
        gameEnded: (state) =>{
            state.highscore= state.points > state.highscore ? state.points : state.highscore;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getQuestions.fulfilled,(state, {payload})=>{
            let temp = payload.questions[0];
            let correctAnswers = temp.answers.filter(answer => answer.iscorrect === true).map(answer => answer.content);
            let newArray = {
                id: temp.id, 
                correctAnswers: correctAnswers, 
                question_content: temp.question_content,
                answers: temp.answers,
                options: shuffleArray([...temp.answers.map(answer => answer.content), ...correctAnswers])
            };
            state.status = 'ready';
            state.questionsRedux = payload.questions;
            state.quiz = payload.quiz; 
            state.currentQuestion= newArray;
            state.index = 0;
            state.points = 0;
            state.answer = null;
        })
        .addCase(getQuestions.rejected, (state)=>{
            state.status = 'error';
        });
    }
});

export const {newAnswer, nextQuestion, gameEnded} = questionsSlice.actions;
export default questionsSlice.reducer;




