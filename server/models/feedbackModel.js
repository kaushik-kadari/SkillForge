const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    feedbacks: [
        {
            question: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5, required: true }
        }
    ],
});

module.exports = mongoose.model('feedback', feedbackSchema);