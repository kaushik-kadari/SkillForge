const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    email: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    chatHistory: [
      {
        role: { type: String, enum: ["AI", "User"], required: true },
        content: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    feedback: { type: String, default: "" },
    conversationSummary: { type: String, default: "" },
    summaryTurnCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
