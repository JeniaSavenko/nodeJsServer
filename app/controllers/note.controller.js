const connect = require('../../config/db');
const Model = require('../model/note.model');

exports.post = (socket, msg) => {
  connect.then((db) => {
    const posts = new Model({
      title: msg.title,
      text: msg.text,
    });
    return posts.save();
  }).then(() => {
    connect.then((db) => {
      Model.find({}).then((message) => {
        socket.emit('get_post', message);
        socket.broadcast.emit('get_post', message);
      });
    });
  });
};
exports.delete = (socket, msg) => {
  connect.then((db) => {
    Model.findByIdAndRemove(msg).then(message => message).then(() => {
      connect.then((db) => {
        Model.find({}).then((message) => {
          socket.emit('get_post', message);
          socket.broadcast.emit('get_post', message);
        });
      });
    });
  });
};
exports.update = (socket, msg) => {
  connect.then((db) => {
    Model.findByIdAndUpdate(msg.id, {
      title: msg.title,
      text: msg.text,
    }).then(message => message).then(() => {
      connect.then((db) => {
        Model.find({}).then((message) => {
          socket.emit('get_post', message);
          socket.broadcast.emit('get_post', message);
        });
      });
    });
  });
};
exports.get = (socket) => {
  connect.then((db) => {
    Model.find({}).then((message) => {
      socket.emit('get_post', message);
    });
  });
};
