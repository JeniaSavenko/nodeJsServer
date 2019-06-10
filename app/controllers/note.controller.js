const connect = require('../../config/db');
const Model = require('../model/note.model');

exports.post = (socket, msg) => {
  connect.then(() => {
    const posts = new Model({
      title: msg.title,
      text: msg.text,
    });
    return posts.save();
  }).then(() => {
    connect.then(() => {
      Model.find({}).then((message) => {
        socket.emit('get_post', message);
        socket.broadcast.emit('get_post', message);
      });
    });
  });
};
exports.delete = (socket, msg) => {
  connect.then(() => {
    Model.findByIdAndRemove(msg).then(message => message).then(() => {
      connect.then(() => {
        Model.find({}).then((message) => {
          socket.emit('get_post', message);
          socket.broadcast.emit('get_post', message);
        });
      });
    });
  });
};
exports.update = (socket, msg) => {
  connect.then(() => {
    Model.findByIdAndUpdate(msg.id, {
      title: msg.title,
      text: msg.text,
    }).then(message => message).then(() => {
      connect.then(() => {
        Model.find({}).then((message) => {
          socket.emit('get_post', message);
          socket.broadcast.emit('get_post', message);
        });
      });
    });
  });
};
exports.get = (socket) => {
  connect.then(() => {
    Model.find({}).then((message) => {
      socket.emit('get_post', message);
    });
  });
};
