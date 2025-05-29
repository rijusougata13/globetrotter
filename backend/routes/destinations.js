const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const logger = require('../utils/logger');
const User = require('../models/User');
const Session = require('../models/Session');

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
      // correctAnswer: destination.name, // removing from response
      funFact: destination.funFacts[Math.floor(Math.random() * destination.funFacts.length)]
    };

    logger.info('Random destination fetched successfully', { destinationId: destination._id });
    res.json(response);
  } catch (error) {
    logger.error('Error fetching random destination', error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/:sessionId/submit", async (req, res) => {
  try {
    const { userAnswer, questionId, username } = req.body;
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    let noOfQuestions = session?.noOfQuestions || 0;
    if (!session) throw Error("session not found");






    const destination = await Destination.findById(questionId);
    if (!destination) {
      throw Error("destination not found");
    }
    let ansStatus = false;

    // calculate updated score
    let correctScore = 0;
    let incorrectScore = 0;
    const user = await User.findOne({
      username: username
    });
    if (!user) {
      throw Error("user not found");
    }
    correctScore = session.score?.correct;
    incorrectScore = session.score?.incorrect;

    if ((correctScore + incorrectScore) > 10) throw Error("session expired");

    if (userAnswer == destination?.name) {
      ansStatus = true;
      logger.info("user guessed succesfully");
      correctScore += 1;

    }
    else {
      incorrectScore += 1;
      logger.info("user gussed wrong");
    }
    noOfQuestions += 1;
    session.score = {
      correct: correctScore,
      incorrect: incorrectScore,

    }
    session.noOfQuestions = noOfQuestions;

    logger.info("session score", session);

    await session.save();


    res.status(200).json({
      message: " user's score",
      ansStatus: ansStatus,
      correctAns: destination?.name,
      correctScore: correctScore,
      incorrectScore: incorrectScore
    })
  } catch (error) {
    logger.error("something went wrong", error);
    res.status(400).json({
      message: "something went wrong",
      error: error.message
    })
  }

})

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
