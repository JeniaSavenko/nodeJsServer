import moment from 'moment';
import connect from '../../config/db';
import Model from '../model/note';
import socketConst from '../../config/constants/socket';

export const post = (socket, msg) => {
  let room;
  connect.then(() => {
    !msg.roomName ? room = 'default' : room = msg.roomName;
    const posts = new Model({
      title: msg.title,
      text: msg.text,
      roomName: room,
    });
    return posts.save();
  }).then(() => {
    connect.then(() => {
      Model.find({ roomName: room })
        .populate('User')
        .then((message) => {
          socket.broadcast.in(room).emit(socketConst.getPost, message);
          socket.in(room).emit(socketConst.getPost, message);
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
    Model.findByIdAndUpdate({ _id: msg.id },
      {
        title: msg.title,
        text: msg.text,
        $push: { history: moment.now() },
      },
      { safe: true, upsert: true },
      (err) => {
        console.error(err);
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
          socket.broadcast.in(roomName).emit(socketConst.getPost, message);
          socket.in(roomName).emit(socketConst.getPost, message);
        });
      });
    });
  });
};

export const get = (socket, roomName) => {
  let room;
  connect.then(() => {
    !roomName ? room = 'default' : room = roomName;
    Model.find({ roomName: room }).then((message) => {
      socket.in(room).emit(socketConst.getPost, message);
      socket.broadcast.in(room).emit(socketConst.getPost, message);
    });
  });
};
