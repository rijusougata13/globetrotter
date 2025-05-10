import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createOrUpdateUser } from '../api';

const WelcomeContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 30px;
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
`;

const Button = styled.button`
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #45a049;
  }
`;

function Welcome({ setUsername, setScore }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async () => {
    if (name.trim()) {
      try {
        const user = await createOrUpdateUser(name.trim());
        setUsername(user.username);
        // Initialize score from user data
        setScore(user.score || { correct: 0, incorrect: 0 });
        navigate('/play');
      } catch (err) {
        setError('Error creating user. Please try again.');
        console.error('Error:', err);
      }
    }
  };

  return (
    <WelcomeContainer>
      <Title>🌎 Welcome to Globetrotter!</Title>
      <p>Test your knowledge of world destinations</p>
      <Input
        type="text"
        placeholder="Enter your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleStart}>Start Playing</Button>
      {error && <div style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</div>}
    </WelcomeContainer>
  );
}

export default Welcome;
