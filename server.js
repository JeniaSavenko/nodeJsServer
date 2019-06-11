const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http').Server(app);
const io = require('socket.io');
const connect = require('./config/db');
const Model = require('./app/model/user.model');

const secretKey = '123456789';
const expiresIn = '1h';
const port = 3000;
const Request = require('./app/controllers/note.controller');
const UserRequsets = require('./app/controllers/user.controller');

app.use(bodyParser.json());

const createToken = payload => jwt.sign(payload, secretKey, { expiresIn });

const verifyToken = token => jwt.verify(token, secretKey, (err, decode) => (decode !== undefined ? decode : err));

const socket = io(http, {
  pingInterval: 30000,
  pingTimeout: 60000,
});

socket.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('registaration', (msg) => {
    const { name, password } = msg;
    const accessToken = createToken({ name, password });
    UserRequsets.post(socket, msg, accessToken);
    socket.emit('get_token', accessToken);
  });

  socket.on('login', (msg) => {
    const { token } = msg;
    UserRequsets.get(socket, msg, token);
  });

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
