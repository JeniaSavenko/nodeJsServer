const mongoose = require('mongoose');
const moment = require('moment');

const now = moment();

const NoteSchema = mongoose.Schema({
  title: String,
  text: String,
  postedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: { type: String, default: now.format('dddd, MMMM Do YYYY, h:mm:ss a') },
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
