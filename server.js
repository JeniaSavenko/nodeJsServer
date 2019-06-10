const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http').Server(app);
const io = require('socket.io');
const socketioJwt = require('socketio-jwt');
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

const isAuthenticated = ({ id }) => connect.then(() => {
  Model.findById({ id }).then((message) => {
    socket.emit('get_post', message);
  });
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

  socket.on('registaration', (msg) => {
    console.log('msg', msg);
    const { name, password } = msg;
    UserRequsets.post(socket, msg);
    const accessToken = createToken({ name, password });
    socket.emit('get_token', accessToken);
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


app.post('/auth/login', (req, res) => {
  const { id, email, password } = req.body;
  if (isAuthenticated({ id, email, password }) === false) {
    const status = 401;
    const message = 'Incorrect email or password';
    res.status(status).json({ status, message });
    return;
  }

  res.status(200).json({ access_token });
});
