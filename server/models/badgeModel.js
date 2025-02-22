const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    badges :[{ id: Number, count: Number }]
});

module.exports = mongoose.model('badge', badgeSchema);