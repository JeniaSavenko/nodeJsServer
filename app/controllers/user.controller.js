const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./../model/user.model');
const NoteModel = require('./../model/note.model');
const connect = require('../../config/db');

exports.post = (socket, msg) => {
  connect.then(() => {
    console.log('test', msg);
    const user = new UserModel({
      name: msg.name, password: msg.password,
    });
    return user.save();
  }).then(() => {
    connect.then(() => {
      NoteModel.find({}).then((message) => {
        socket.emit('get_post', message);
      });
    });
  });
};
