import mongoose from 'mongoose';

const NoteSchema = mongoose.Schema({
  title: String,
  text: String,
  editMode: Boolean,
  editing: String || undefined,
  roomName: String || Number,
  history: Array,
  postedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
