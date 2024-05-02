import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function shuffleArray(array) {
    const newArray = [...array]; 
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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

export const getQuestions = createAsyncThunk('questions/getQuestions', async (difficulty) => {
    try {
        const resp = await fetch(`http://localhost:3000/quiz/findoneQuiz/c6e2d0ab-67d2-408e-8562-1d18d1220730`);
        if (!resp.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await resp.json();
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
