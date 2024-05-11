import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { gameEnded } from '../features/questions/questionsSlice';

export const FinishedScreen = () => {
    const { questionsRedux, points, highscore } = useSelector(store => store.questions);
    const { gameMode } = useSelector(store => store.difficulty);
    const totalQuestions = questionsRedux.length;
    const maxPoints = totalQuestions * 20; // Calcul du nombre maximum de points possibles
    const percentage = Math.ceil((points * 100) / maxPoints); // Calcul du pourcentage
    let congrats;
    if (percentage === 100) congrats = "Perfect!";
    if (percentage >= 80 && percentage < 100) congrats = "Excellent!";
    if (percentage >= 50 && percentage < 80) congrats = "Good!";
    if (percentage > 0 && percentage < 50) congrats = "Bad luck!";
    if (percentage === 0) congrats = "Oh no!";

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Envoyer le score et l'e-mail de l'utilisateur à la base de données
        const sendScoreAndEmail = async () => {
            try {
                const currentUser = JSON.parse(localStorage.getItem('decodedToken'));
                const quizId = localStorage.getItem('quizId');
                console.log("qqqq",quizId);
                const email = currentUser?.email;
                const userId = currentUser?.sub;
                const scoreData = {
                    userid:userId,
                    quizid:quizId,
                    totalscore: maxPoints,
                    note: points,
                    startingdate: "2024-05-09",
                    endingdate: new Date().toISOString(),
                    email: email,
                    statut:congrats
                };
                await axios.post('http://localhost:3000/group_report/createGroupReport', scoreData);
                await axios.post('http://localhost:3000/auth/logout');
                localStorage.removeItem('decodedToken');
            } catch (error) {
                console.error('Erreur lors de l\'envoi du score et de l\'e-mail à la base de données :', error);
            }
        };
 
        if (questionsRedux.length > 0 && points !== 0) {
            sendScoreAndEmail();
        }
        // Dispatchez l'action pour marquer la fin du jeu
        dispatch(gameEnded());
    }, [questionsRedux, points, dispatch]);

    const handleExit = () => {
        // Fermer la fenêtre actuelle lorsque l'utilisateur clique sur "Exit"
        window.close();
    };

    return (
        <>
            <p className='result'>
                {congrats} You scored <strong>{points}</strong> out of {maxPoints} ({percentage}%)
            </p>
            <div className='reset-btns'>
                <button className='btn' onClick={handleExit}>Exit</button>
            </div>
        </>
    );
};
