const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const logger = require('../utils/logger');

router.get('/random', async (req, res) => {
  logger.info('Fetching random destination');
  try {
    const count = await Destination.countDocuments();
    const random = Math.floor(Math.random() * count);
    logger.info('Random destination fetched successfully', { count, random });
    const destination = await Destination.findOne().skip(random);

    // Only send necessary information
    const response = {
      id: destination._id,
      clues: destination.clues.slice(0, 2), // Send only 2 clues
      options: destination.options,
      correctAnswer: destination.name,
      funFact: destination.funFacts[Math.floor(Math.random() * destination.funFacts.length)]
    };

    logger.info('Random destination fetched successfully', { destinationId: destination._id });
    res.json(response);
  } catch (error) {
    logger.error('Error fetching random destination', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a new destination (protected route - to be implemented)
router.post('/', async (req, res) => {
  logger.info('Creating new destination', { destination: req.body.name });
  const destination = new Destination({
    name: req.body.name,
    clues: req.body.clues,
    funFacts: req.body.funFacts,
    trivia: req.body.trivia,
    options: req.body.options
  });

  try {
    const newDestination = await destination.save();
    logger.info('New destination created successfully', { destinationId: newDestination._id });
    res.status(201).json(newDestination);
  } catch (error) {
    logger.error('Error creating new destination', error, { destination: req.body.name });
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
