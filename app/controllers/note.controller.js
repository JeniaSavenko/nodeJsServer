import connect from '../../config/db';
import Model from '../model/note';
import Constants from '../../config/constants';

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
          socket.broadcast.emit(Constants.getPost, message);
          socket.emit(Constants.getPost, message);
        });
    });
  });
};

export const del = (socket, msg) => {
  connect.then(() => {
    Model.findByIdAndRemove(msg).then(message => message).then(() => {
      connect.then(() => {
        Model.find({}).then((message) => {
          socket.broadcast.emit(Constants.getPost, message);
          socket.broadcast.emit(Constants.getPost, message);
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
            socket.broadcast.emit(Constants.getPost, message);
            socket.emit(Constants.getPost, message);
          });
        });
      });
  });
};

export const startEdit = (socket, msg) => {
  connect.then(() => {
    Model.findByIdAndUpdate(msg.postId, {
      editMode: true,
      editing: msg.userId,
    }).then(message => message).then(() => {
      connect.then(() => {
        Model.find({}).then((message) => {
          socket.broadcast.emit(Constants.getPost, message);
          socket.emit(Constants.getPost, message);
        });
      });
    });
  });
};

export const finishEdit = (socket, msg) => {
  connect.then(() => {
    Model.findByIdAndUpdate(msg, {
      editMode: false,
      editing: undefined,
    }).then(message => message).then(() => {
      connect.then(() => {
        Model.find({}).then((message) => {
          socket.broadcast.emit(Constants.getPost, message);
          socket.emit(Constants.getPost, message);
        });
      });
    });
  });
};

export const get = (socket) => {
  connect.then(() => {
    Model.find({}).then((message) => {
      socket.emit(Constants.getPost, message);
    });
  });
};
