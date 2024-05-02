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
    <div className='start-screen'>
      <h2>Welcome to {quiztitle || 'The Trivia Quiz'}!</h2>
      <h3>{noofquestions || 15} questions to test your general knowledge</h3>
      <h3>Duration: {duration || 'Unknown'}</h3>
      <h3>Number of invitations: {noofinvitations || 0}</h3>
      <h3>Difficulty level: {difficultylevel || 'Unknown'}</h3>
      <h3>Creator: {creator || 'Anonymous'}</h3>
      <h3>Deadline: {deadline || 'No deadline set'}</h3>
      <div className="game-mode">
        <button className='btn2' value='easy' onClick={(e) => handleClick(e)} style={{ backgroundColor: "#0ee32a" }}>Start</button>
      </div>
    </div>
  );
};
