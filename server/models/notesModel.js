const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    email: { type: String, required: true },
    subject: { type: String, required: true },
    notes: { type: String, required: true }
});

const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes;
