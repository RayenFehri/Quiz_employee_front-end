import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestions, selectQuizId } from '../features/questions/questionsSlice'; // Importez le sélecteur

export const StartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quizId = useSelector(selectQuizId); // Utilisez le sélecteur pour obtenir l'ID du quiz
  const { quiz, status } = useSelector(state => state.questions);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    dispatch(getQuestions()); // Vous pouvez laisser cette ligne telle quelle
  }, [dispatch]);

  const handleClick = () => {
    console.log("id:", quizId);
    navigate(`/quiz/${quizId}`); // Utilisez l'ID du quiz obtenu à partir du sélecteur
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const { quiztitle, noofquestions, duration, noofinvitations, difficultylevel, creator, deadline, material } = quiz;

  return (
    <>
      {!showInfo ? (
        <div className='card'>
          <div className='card-content'>
            <h2 className='card-title'>Welcome to {quiztitle || ' Quiz'}!</h2>
            
          <p className='card-subtitle'>
            Watch this material
            <iframe
              width="560"
              height="315"
              src={material}
              frameBorder="0"
              allowFullScreen
              style={{ border: '2px solid #ccc', borderRadius: '5px' }}
            ></iframe>
          </p>
      
            <div className="game-mode">
              <button className='card-button' value='easy' onClick={() => setShowInfo(true)}>Continue</button>
            </div>
          </div>
        </div>
      ) : (
        <div className='card'>
          <div className='card-content'>
            <h2 className='card-title' style={{ fontWeight:"lighter",fontFamily:"Anek Malayalam", fontSize:"30px" }}>QUIZ INFORMATIONS</h2>
            <p className='card-subtitle' style={{ fontWeight:"lighter",fontFamily:"Anek Malayalam", fontSize:"20px" }}>{noofquestions || 15} questions to test your general knowledge</p>
            <p className='card-subtitle'> <span style={{ fontWeight:"bold",fontFamily:"Anek Malayalam", fontSize:"25px" }}>Duration:</span> <span className={duration ? 'card-subtitle' : 'card-subtitle no-data'} style={{ fontWeight:"lighter",fontFamily:"Anek Malayalam", fontSize:"25px" }}>{duration || 'Unknown'}</span></p>
            <p className='card-subtitle' style={{ fontWeight:"bold",fontFamily:"Anek Malayalam", fontSize:"25px" }}>Difficulty level: <span className={difficultylevel ? 'card-subtitle' : 'card-subtitle no-data'} style={{ fontWeight:"lighter",fontFamily:"Anek Malayalam", fontSize:"25px" }}>{difficultylevel || 'Unknown'}</span></p>
            <p className='card-subtitle'style={{ fontWeight:"bold",fontFamily:"Anek Malayalam", fontSize:"25px" }}>Creator: <span className={creator ? 'card-subtitle' : 'card-subtitle no-data'} style={{ fontWeight:"lighter",fontFamily:"Anek Malayalam", fontSize:"25px" }}>{creator || 'Anonymous'}</span></p>
            <p className='card-subtitle'style={{ fontWeight:"bold",fontFamily:"Anek Malayalam", fontSize:"25px" }}>Deadline: <span className={deadline ? 'card-subtitle' : 'card-subtitle no-data'} style={{ fontWeight:"lighter",fontFamily:"Anek Malayalam", fontSize:"25px" }}>{deadline || 'No deadline set'}</span></p>
            <div className="game-mode">
              <button className='card-button' value='easy' onClick={handleClick}>Start</button>
            </div>
          </div>
        </div>
      )}
      <br />
      
    </>
  );
};
