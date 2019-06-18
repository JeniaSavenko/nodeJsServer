import connect from '../../config/db';
import Model from '../model/note';

export const post = (socket, msg) => {
  connect.then(() => {
    const posts = new Model({
      title: msg.title,
      text: msg.text,
    });
    return posts.save();
  }).then(() => {
    connect.then(() => {
      Model.find({})
        .populate('User')
        .then((message) => {
          socket.emit('get_post', message);
          socket.broadcast.emit('get_post', message);
        });
    });
  });
};

export const del = (socket, msg) => {
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

export const update = (socket, msg) => {
  connect.then(() => {
    Model.findByIdAndUpdate(msg.id, {
      title: msg.title,
      text: msg.text,
    }).populate('User')
      .then(message => message).then(() => {
        connect.then(() => {
          Model.find({}).then((message) => {
            socket.emit('get_post', message);
            socket.broadcast.emit('get_post', message);
          });
        });
      });
  });
};
export const get = (socket) => {
  connect.then(() => {
    Model.find({}).then((message) => {
      socket.emit('get_post', message);
    });
  });
};
