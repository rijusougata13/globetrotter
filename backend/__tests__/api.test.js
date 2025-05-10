const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Destination = require('../models/Destination');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Endpoints', () => {
  describe('GET /api/destinations/random', () => {
    it('should return a random destination', async () => {
      const res = await request(app).get('/api/destinations/random');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('correctAnswer');
      expect(res.body).toHaveProperty('clues');
      expect(Array.isArray(res.body.clues)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const username = `test_user_${Date.now()}`;
      const res = await request(app)
        .post('/api/users')
        .send({ username });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('username', username);
      expect(res.body).toHaveProperty('inviteCode');
      expect(res.body).toHaveProperty('score');
      expect(res.body.score).toHaveProperty('correct', 0);

      await User.findOneAndDelete({ username });
    });
  });

  describe('PUT /api/users/:username/score', () => {
    it('should update user score', async () => {
      const username = `test_user_${Date.now()}`;
      const user = await User.create({ 
        username,
        inviteCode: `test_${Date.now()}`,
        score: { correct: 0 }
      });

      const res = await request(app)
        .put(`/api/users/${username}/score`)
        .send({ score: { correct: 1, total: 1 } });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('score.correct', 1);

      await User.findOneAndDelete({ username });
    });
  });
});
