import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SocialMedia } from '../components/SocialMedia'
import { useSelector } from 'react-redux'

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

  return (
      <>
          <p className='result'>
             {congrats} You scored <strong>{points}</strong> out of {maxPoints} ({percentage}%)
          </p>
          <p className='highscore'>(Highscore: {highscore} points)</p>
          <div className='reset-btns'>
              <button className='btn' onClick={() => navigate(`/`)}>Main Menu</button>
              <button className='btn' onClick={() => navigate(`/quiz/${gameMode}`)}>Reset</button>
          </div>
          <SocialMedia/>
      </>
  );
};
