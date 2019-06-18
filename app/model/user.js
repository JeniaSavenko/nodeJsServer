import mongoose from 'mongoose';

const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: String,
  password: String,
  token: String,
});

const User = mongoose.model('User', UsersSchema);

module.exports = User;
