const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    score: {
        correct: {
            type: Number,
            default: 0
        },
        incorrect: {
            type: Number,
            default: 0
        }
    },
    noOfQuestions: {
        type: Number,
        default: 0,

    }
});

module.exports = mongoose.model('Session', sessionSchema);
