const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    chatHistory: { type: Array, default: [] },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    feedback: { type: String, default: "" },
    conversationSummary: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
