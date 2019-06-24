import io from 'socket.io';
import * as Request from './app/controllers/note.controller';
import Constants from './config/constants';

const ConnectSocket = (http) => {
  const socket = io(http, {
    pingInterval: 3000,
    pingTimeout: 6000,
  });

  socket.on(Constants.connection, (socket) => {
    socket.on(Constants.disconnect, () => {
    });

    Request.get(socket);

    socket.on(Constants.sendPost, (msg) => {
      Request.post(socket, msg);
    });
    socket.on(Constants.deletePost, (msg) => {
      Request.del(socket, msg);
    });
    socket.on(Constants.updatePost, (msg) => {
      Request.update(socket, msg);
    });
    socket.on(Constants.editModeStart, (msg) => {
      Request.startEdit(socket, msg);
    });
    socket.on(Constants.editModeFinish, (msg) => {
      Request.finishEdit(socket, msg);
    });
  });
};

export default ConnectSocket;
