import io from 'socket.io';
import * as Request from './app/controllers/note.controller';
import { addUser, create } from './app/controllers/room.controller';
import socketConst from './config/constants/socket';

const ConnectSocket = (http) => {
  let room;
  const WebSocket = io(http, {
    pingInterval: 3000,
    pingTimeout: 6000,
  });
  WebSocket.on(socketConst.connection, (socket) => {
    socket.on(socketConst.joinRoom, ({ name, userName }) => {
      room = name;
      create(name, userName, socket);
      Request.get(socket, room);
    });

    socket.on(socketConst.addUser, ({ roomName, userName }) => {
      room = roomName;
      addUser(roomName, userName);
    });

    socket.on(socketConst.disconnect, () => {
    });

    Request.get(socket, room);

    socket.on(socketConst.sendPost, (msg) => {
      Request.post(socket, msg);
    });
    socket.on(socketConst.deletePost, (msg) => {
      Request.del(socket, msg, room);
    });
    socket.on(socketConst.updatePost, (msg) => {
      Request.update(socket, msg, room);
    });
    socket.on(socketConst.editModeStart, (msg) => {
      Request.startEdit(socket, msg, room);
    });
    socket.on(socketConst.editModeFinish, (msg) => {
      Request.finishEdit(socket, msg, room);
    });
  });
};

export default ConnectSocket;
