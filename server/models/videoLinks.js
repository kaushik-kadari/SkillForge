const mongoose = require('mongoose');

const videoLinkSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    videoLink: { type: String, required: true },
});

module.exports = mongoose.model('videoLink', videoLinkSchema);