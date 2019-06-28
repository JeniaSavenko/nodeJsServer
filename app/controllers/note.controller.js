import connect from '../../config/db';
import Model from '../model/note';
import connect from '../../config/constants/connect';
import socketConst from '../../config/constants/connect';

export const post = (socket, msg) => {
  connect.then(() => {
    const posts = new Model({
      title: msg.title,
      text: msg.text,
      roomName: msg.roomName,
    });
    return posts.save();
  }).then(() => {
    connect.then(() => {
      Model.find({ roomName: msg.roomName })
        .populate('User')
        .then((message) => {
          socket.broadcast.in(msg.roomName).emit(socketConst.getPost, message);
          socket.in(msg.roomName).emit(socketConst.getPost, message);
        });
    });
  });
};

export const del = (socket, msg, roomName) => {
  connect.then(() => {
    Model.findByIdAndRemove(msg).then(message => message).then(() => {
      connect.then(() => {
        Model.find({ roomName }).then((message) => {
          socket.broadcast.in(roomName).emit(socketConst.getPost, message);
        });
      });
    });
  });
};

export const update = (socket, msg, roomName) => {
  connect.then(() => {
    Model.findByIdAndUpdate(msg.id, {
      title: msg.title,
      text: msg.text,
    }).populate('User')
      .then(message => message).then(() => {
        connect.then(() => {
          Model.find({ roomName }).then((message) => {
            socket.broadcast.in(roomName).emit(socketConst.getPost, message);
            socket.in(roomName).emit(socketConst.getPost, message);
          });
        });
      });
  });
};

export const startEdit = (socket, msg, roomName) => {
  connect.then(() => {
    Model.findByIdAndUpdate(msg.postId, {
      editMode: true,
      editing: msg.userId,
    }).then(message => message).then(() => {
      connect.then(() => {
        Model.find({ roomName }).then((message) => {
          socket.broadcast.in(roomName).emit(socketConst.getPost, message);
          socket.in(roomName).emit(socketConst.getPost, message);
        });
      });
    });
  });
};

export const finishEdit = (socket, msg, roomName) => {
  connect.then(() => {
    Model.findByIdAndUpdate(msg, {
      editMode: false,
      editing: undefined,
    }).then(message => message).then(() => {
      connect.then(() => {
        Model.find({ roomName }).then((message) => {
          socket.broadcast.in(roomName).emit(Constants.getPost, message);
          socket.in(roomName).emit(Constants.getPost, message);
        });
      });
    });
  });
};

export const get = (socket, roomName) => {
  connect.then(() => {
    Model.find({ roomName }).then((message) => {
      socket.in(roomName).emit(Constants.getPost, message);
      socket.broadcast.in(roomName).emit(Constants.getPost, message);
    });
  });
};
