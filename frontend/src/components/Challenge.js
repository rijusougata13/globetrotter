import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserByInviteCode, createOrUpdateUser } from '../api';

const ChallengeContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
`;

const ShareButton = styled.button`
  background: #25D366;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #128C7E;
  }
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

function Challenge({ username, setUsername }) {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [inviterScore, setInviterScore] = useState(null);
  const [inviterName, setInviterName] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchInviterData = async () => {
      try {
        const userData = await getUserByInviteCode(inviteId);
        setInviterScore(userData.score);
        setInviterName(userData.username)
      } catch (error) {
        console.error('Error fetching inviter data:', error);
      }
    };
    if (inviteId) {
      fetchInviterData();
    }
  }, [inviteId]);

  const handleStart = async () => {
    if (name.trim()) {
      try {
        const user = await createOrUpdateUser(name.trim());
        setUsername(user.username);
        navigate('/play');
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Hey! Can you beat my score on Globetrotter? I got ${inviterScore.correct} correct answers! Play here: `;
    const url = `${window.location.origin}/challenge/${inviteId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`);
  };

  return (
    <ChallengeContainer>


      <>
        <h2>Ready to beat {inviterName}'s score?</h2>
        <p>They got {inviterScore?.correct} destinations correct!</p>
        <p>Enter your name to start the challenge</p>
        <Input
          type="text"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleStart}>Accept Challenge</Button>
      </>
    </ChallengeContainer>
  );
}

export default Challenge;
