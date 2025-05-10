import axios from 'axios';

const API_BASE_URL = 'https://globetrotter-4579.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRandomDestination = async () => {
  const response = await api.get('/destinations/random');
  return response.data;
};

export const createOrUpdateUser = async (username) => {
  const response = await api.post('/users', { username });
  return response.data;
};

export const updateUserScore = async (username, score) => {
  const response = await api.put(`/users/${username}/score`, { score });
  return response.data;
};

export const getUserByInviteCode = async (code) => {
  const response = await api.get(`/users/invite/${code}`);
  return response.data;
};
