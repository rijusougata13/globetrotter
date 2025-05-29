const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const logger = require('../utils/logger');

router.post('/', async (req, res) => {
  logger.info('Creating or updating user', { username: req.body.username });
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user) {
      logger.info('Existing user found', { userId: user._id });
      res.json(user);
    } else {
      const inviteCode = crypto.randomBytes(4).toString('hex');
      user = new User({
        username: req.body.username,
        inviteCode
      });
      await user.save();
      logger.info('New user created', { userId: user._id, inviteCode: inviteCode });
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:username/score', async (req, res) => {
  logger.info('Updating user score', { username: req.params.username, score: req.body.score });
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.score = req.body.score;
    await user.save();
    logger.info('User score updated successfully', { userId: user._id, newScore: req.body.score });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/invite/:code', async (req, res) => {
  logger.info('Fetching user by invite code', { inviteCode: req.params.code });
  try {
    const user = await User.findOne({ inviteCode: req.params.code });
    if (!user) {
      logger.info('User not found with invite code', { inviteCode: req.params.code });
      return res.status(404).json({ message: 'User not found' });
    }
    logger.info('User found by invite code', { userId: user._id });
    res.json(user);
  } catch (error) {
    logger.error('Error fetching user by invite code', error, { inviteCode: req.params.code });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
