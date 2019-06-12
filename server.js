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

const port = 3000;
const secretKey = '123456789';
const Request = require('./app/controllers/note.controller');


const verifyToken = token => jwt.verify(token, secretKey, (err, decode) => (decode !== undefined ? decode : err));

app.use(bodyParser.json());

require('./app/controllers/user.controller')(app);

app.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401;
    const message = 'Bad authorization header';
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(req.headers.authorization.split(' ')[1]);
    next();
  } catch (err) {
    const status = 401;
    const message = 'Error: access_token is not valid';
    res.status(status).json({ status, message });
  }
});

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
