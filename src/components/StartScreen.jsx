import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialMedia } from './SocialMedia';
import { selectGameMode } from '../features/difficulty/difficultySlice';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions } from '../features/questions/questionsSlice';

export const StartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quiz, status } = useSelector(state => state.questions);

  useEffect(() => {
    dispatch(getQuestions());
  }, [dispatch]);

  const handleClick = (e) => {
    dispatch(selectGameMode(e.target.value));
    navigate(`/quiz/${e.target.value}`);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const { quiztitle, noofquestions, duration, noofinvitations, material, difficultylevel, creator, deadline, id_category } = quiz;

  return (
    <div className='card'>
      <div className='card-content'>
        <h2 className='card-title'>Welcome to {quiztitle || 'The Trivia Quiz'}!</h2>
        <p className='card-subtitle'>{noofquestions || 15} questions to test your general knowledge</p>
        <p className='card-subtitle'>Duration: <span className={duration ? 'card-subtitle' : 'card-subtitle no-data'}>{duration || 'Unknown'}</span></p>
        <p className='card-subtitle'>Number of invitations: <span className={noofinvitations ? 'card-subtitle' : 'card-subtitle no-data'}>{noofinvitations || 0}</span></p>
        <p className='card-subtitle'>Difficulty level: <span className={difficultylevel ? 'card-subtitle' : 'card-subtitle no-data'}>{difficultylevel || 'Unknown'}</span></p>
        <p className='card-subtitle'>Creator: <span className={creator ? 'card-subtitle' : 'card-subtitle no-data'}>{creator || 'Anonymous'}</span></p>
        <p className='card-subtitle'>Deadline: <span className={deadline ? 'card-subtitle' : 'card-subtitle no-data'}>{deadline || 'No deadline set'}</span></p>
        <div className="game-mode">
          <button className='card-button' value='easy' onClick={(e) => handleClick(e)}>Start</button>
        </div>
      </div>
    </div>
  );
};
