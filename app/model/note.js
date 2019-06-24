import mongoose from 'mongoose';
import moment from 'moment';


const now = moment().format('X');

const NoteSchema = mongoose.Schema({
  title: String,
  text: String,
  editMode: Boolean,
  editing: String || undefined,
  postedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
