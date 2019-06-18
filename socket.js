import io from 'socket.io';
import * as Request from './app/controllers/note.controller';

const ConnectSocket = (http) => {
  const socket = io(http, {
    pingInterval: 3000,
    pingTimeout: 6000,
  });

  socket.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });

    Request.get(socket);

    socket.on('send_post', (msg) => {
      Request.post(socket, msg);
    });
    socket.on('delete_post', (msg) => {
      Request.del(socket, msg);
    });
    socket.on('update_post', (msg) => {
      Request.update(socket, msg);
    });
  });
};

export default ConnectSocket;
