import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gameEnded, nextQuestion } from '../features/questions/questionsSlice';

export const Next = () => {
    const { index, questionsRedux } = useSelector(store => store.questions);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFinish = () => {
        dispatch(gameEnded());
        navigate('/results');
    };

    const totalQuestions = questionsRedux.length;

    if (index < totalQuestions - 1) { // Modifier la condition pour vérifier si l'index est inférieur au nombre total de questions - 1
        return (
            <button className='btn btn-ui' onClick={() => dispatch(nextQuestion())}>Next</button>
        );
    } else {
        return (
            <button className='btn btn-ui' onClick={handleFinish}>Finish</button>
        );
    }
};
