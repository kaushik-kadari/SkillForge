const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    subtopic: { type: String, required: true },
    content: { type: String, required: true },
});

module.exports = mongoose.model('content', subtopicSchema);
