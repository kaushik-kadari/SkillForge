const mongoose = require('mongoose');

// Define MongoDB Schema for Sessions
const sessionSchema = new mongoose.Schema({
    sessionId: String,
    topic: String,
    questions: [
      {
        question: String,
        userAnswer: String,
        followUp: String,
      },
    ],
  });
  
  module.exports = mongoose.model("Session", sessionSchema);