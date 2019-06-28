import mongoose from 'mongoose';

const RoomSchema = mongoose.Schema({
  roomName: { type: String, unique: true },
  type: String,
  whiteList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;
