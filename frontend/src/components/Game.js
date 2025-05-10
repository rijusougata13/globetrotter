import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import { getRandomDestination, updateUserScore, createOrUpdateUser } from '../api';

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ScoreBoard = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const ClueContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
`;

const OptionButton = styled.button`
  background: ${props => props.selected ? '#4CAF50' : 'white'};
  color: ${props => props.selected ? 'white' : 'black'};
  padding: 15px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
`;

const NextButton = styled.button`
  background: #2196F3;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background: #1976D2;
  }
`;

const ChallengeButton = styled.button`
  background: #25D366;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  margin: 20px 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #128C7E;
  }
`;

function Game({ username, score, setScore }) {
  const [inviteCode, setInviteCode] = useState('');
  const [currentDestination, setCurrentDestination] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchNewDestination = async () => {
    try {
      const destination = await getRandomDestination();
      setCurrentDestination(destination);
    } catch (error) {
      console.error('Error fetching destination:', error);
      setFeedback({
        type: 'error',
        message: 'Error loading destination. Please try again.'
      });
    }
  };

  useEffect(() => {
    fetchNewDestination();
    const fetchUserData = async () => {
      try {
        const user = await createOrUpdateUser(username);
        setInviteCode(user.inviteCode);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [username]);

  const handleAnswer = async (answer) => {
    setSelectedAnswer(answer);
    let newScore;
    if (answer === currentDestination.correctAnswer) {
      setShowConfetti(true);
      newScore = {
        correct: (score.correct || 0) + 1,
        incorrect: score.incorrect || 0
      };
      setFeedback({ type: 'success', message: currentDestination.funFact });
    } else {
      newScore = {
        correct: score.correct || 0,
        incorrect: (score.incorrect || 0) + 1
      };
      setFeedback({
        type: 'error',
        message: `Incorrect 🥲😭😭😭😭😭! The answer was ${currentDestination.correctAnswer}`
      });
    }

    setScore(newScore);
    try {
      await updateUserScore(username, newScore);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowConfetti(false);
    setFeedback(null);
    fetchNewDestination();
  };

  if (!currentDestination) return <div>Loading...</div>;

  return (
    <GameContainer>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <h2>Welcome, {username}!</h2>

      <ScoreBoard>
        <div>Correct: {score.correct}</div>
        <div>Incorrect: {score.incorrect}</div>
      </ScoreBoard>

      <ClueContainer>
        <h3>🤔 Destination Clues:</h3>
        {currentDestination.clues.map((clue, index) => (
          <p key={index}>• {clue}</p>
        ))}
      </ClueContainer>

      <OptionsGrid>
        {currentDestination.options.map((option) => (
          <OptionButton
            key={option}
            selected={selectedAnswer === option}
            onClick={() => !selectedAnswer && handleAnswer(option)}
            disabled={selectedAnswer}
          >
            {option}
          </OptionButton>
        ))}
      </OptionsGrid>

      {feedback && (
        <div style={{ margin: '20px 0', color: feedback.type === 'success' ? '#4CAF50' : '#f44336' }}>
          {feedback.message}
        </div>
      )}

      {selectedAnswer && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <NextButton onClick={handleNext}>
            Next Destination
          </NextButton>
          <ChallengeButton
            onClick={() => {
              const text = `Hey! Can you beat my score on Globetrotter? I got ${score.correct} correct answers! Play here: `;
              const url = `${window.location.origin}/challenge/${inviteCode}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`);
            }}
          >
            🎮 Challenge Friends
          </ChallengeButton>
        </div>
      )}
    </GameContainer>
  );
}

export default Game;
