const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: String,
  password: String || Number,
});

const User = mongoose.model('User', UsersSchema);

module.exports = User;
