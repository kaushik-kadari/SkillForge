const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    sessionId: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    chatHistory: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
