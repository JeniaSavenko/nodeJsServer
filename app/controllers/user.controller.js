const UserModel = require('./../model/user.model');
const NoteModel = require('./../model/note.model');
const connect = require('../../config/db');

exports.post = (socket, msg, token) => {
  connect.then(() => {
    const user = new UserModel({
      name: msg.name, password: msg.password, token,
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

exports.get = (socket, msg, token) => {
  connect.then(() => {
    UserModel.find({ name: msg.name }).then((message) => {
      console.log('message', message);
      (message.token === token && message.password === msg.password)
        ? socket.emit('login_status', true) : socket.emit('login_status', false);
    });
  });
};
