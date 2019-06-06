const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http').Server(app);
const io = require('socket.io');

const port = 3000;
const Request = require('./app/controllers/note.controller');

app.use(bodyParser.json());

const socket = io(http, {
  pingInterval: 30000,
  pingTimeout: 60000,
});

socket.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  Request.get(socket);

  socket.on('send_post', (msg) => {
    Request.post(socket, msg);
  });
  socket.on('delete_post', (msg) => {
    Request.delete(socket, msg);
  });
  socket.on('update_post', (msg) => {
    Request.update(socket, msg);
  });
});

http.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
