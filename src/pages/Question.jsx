import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Progress } from '../components/Progress';
import { Next } from '../components/Next';
import { Timer } from '../components/Timer';
import { useDispatch, useSelector } from 'react-redux';
import { restartTimer } from '../features/timer/timerSlice';
import { getQuestions, newAnswer } from '../features/questions/questionsSlice';

export const Question = () => {
    const { difficulty } = useParams();
    const { status, index, currentQuestion, answer } = useSelector(store => store.questions);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(restartTimer());
      dispatch(getQuestions(difficulty));
    }, [difficulty]);

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [index]);

    const statement = currentQuestion?.question_content;
    const options = currentQuestion?.answers ? currentQuestion.answers.map(answer => answer.content) : [];
    const correctAnswers = currentQuestion?.correctAnswers ? currentQuestion.correctAnswers : [];
    const hasAnswered = answer !== null;
    const styleCat = {
      backgroundColor: difficulty === 'Intermidiate' ? '#e3ce0e' : '#fc2121'
    };

    return (
      <main className='main'>
        {status === 'loading' && <Loader/>}
        {status === 'error' && <ErrorMessage/>}
        {status === 'ready' && 
        <>
        <Progress/>
        <div className='question-cont'>
          <div className='category' style={difficulty !== 'easy' ? styleCat : {}}>Test Quiz</div>
          <h4>{statement}</h4>
          <div className="options">
            {options?.map(option=>{
              return <button key={option} className={`btn btn-option ${answer === option ? 
              "answer" : ""} 
              ${hasAnswered ? correctAnswers.includes(option)
              ? "correct" : "" : ""}`} 
              disabled={hasAnswered}
              onClick={()=>dispatch(newAnswer(option))}>{option}</button>
            })}
          </div>
        </div> 
        <footer>
          <Timer />
          {answer && <Next/>}
        </footer>
        </>}
      </main>
    );
};
