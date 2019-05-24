const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    text: String
}, {
    timestamps: false
});

module.exports = mongoose.model('Note', NoteSchema);