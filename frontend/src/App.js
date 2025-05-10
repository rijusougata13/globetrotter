import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Import components (to be created)
import Welcome from './components/Welcome';
import Game from './components/Game';
import Challenge from './components/Challenge';

const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 20px;
`;

function App() {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route 
            path="/" 
            element={<Welcome setUsername={setUsername} setScore={setScore} />} 
          />
          <Route 
            path="/play" 
            element={
              <Game 
                username={username} 
                score={score} 
                setScore={setScore} 
              />
            } 
          />
          <Route 
            path="/challenge/:inviteId" 
            element={
              <Challenge 
                username={username} 
                setUsername={setUsername} 
              />
            } 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
