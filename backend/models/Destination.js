const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  clues: [{
    type: String,
    required: true
  }],
  funFacts: [{
    type: String,
    required: true
  }],
  trivia: [{
    type: String,
    required: true
  }],
  options: [{
    type: String,
    required: true
  }]
});

module.exports = mongoose.model('Destination', destinationSchema);
