const mongoose = require('mongoose');
const moment = require('moment');
const now = moment();

const NoteSchema = mongoose.Schema({
    title: String,
    text: String
}, {
    timestamps: {type: String, default: now.format("dddd, MMMM Do YYYY, h:mm:ss a")}
});

module.exports = mongoose.model('Note', NoteSchema);
