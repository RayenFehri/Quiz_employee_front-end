import React from 'react';
import { useSelector } from 'react-redux';

export const Progress = () => {
    const { questionsRedux, index, points, answer } = useSelector(store => store.questions);
    const totalQuestions = questionsRedux.length;
    
    return (
        <header className='progress'>
            <progress max={totalQuestions} value={index + Number(answer !== null)} />
            <p>Question <strong>{index + 1}</strong> / {totalQuestions}</p>
            <p><strong>{points}</strong> / {totalQuestions * 20}</p>
        </header>
    );
};
