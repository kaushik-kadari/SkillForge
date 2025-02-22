const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    email : { type : String, required: true },
    tasks : { type : [String], required: true, default: [] }
});

module.exports = mongoose.model('task', taskSchema);