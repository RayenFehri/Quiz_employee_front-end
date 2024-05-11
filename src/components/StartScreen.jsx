import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions, selectQuizId } from '../features/questions/questionsSlice'; // Importez le sélecteur

export const StartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quizId = useSelector(selectQuizId); // Utilisez le sélecteur pour obtenir l'ID du quiz
  const { quiz, status } = useSelector(state => state.questions);

  useEffect(() => {
    dispatch(getQuestions()); // Vous pouvez laisser cette ligne telle quelle
  }, [dispatch]);

  const handleClick = () => {
    console.log("iiiiiiiiiiiiiiidddddd:",quizId)
    navigate(`/quiz/${quizId}`); // Utilisez l'ID du quiz obtenu à partir du sélecteur
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const { quiztitle, noofquestions, duration, noofinvitations, difficultylevel, creator, deadline } = quiz;

  return (
    <div className='card'>
      <div className='card-content'>
        <h2 className='card-title'>Welcome to {quiztitle || ' Quiz'}!</h2>
        <p className='card-subtitle'>{noofquestions || 15} questions to test your general knowledge</p>
        <p className='card-subtitle'>Duration: <span className={duration ? 'card-subtitle' : 'card-subtitle no-data'}>{duration || 'Unknown'}</span></p>
        <p className='card-subtitle'>Number of invitations: <span className={noofinvitations ? 'card-subtitle' : 'card-subtitle no-data'}>{noofinvitations || 0}</span></p>
        <p className='card-subtitle'>Difficulty level: <span className={difficultylevel ? 'card-subtitle' : 'card-subtitle no-data'}>{difficultylevel || 'Unknown'}</span></p>
        <p className='card-subtitle'>Creator: <span className={creator ? 'card-subtitle' : 'card-subtitle no-data'}>{creator || 'Anonymous'}</span></p>
        <p className='card-subtitle'>Deadline: <span className={deadline ? 'card-subtitle' : 'card-subtitle no-data'}>{deadline || 'No deadline set'}</span></p>
        <div className="game-mode">
          <button className='card-button' value='easy' onClick={handleClick}>Start</button>
        </div>
      </div>
    </div>
  );
};
