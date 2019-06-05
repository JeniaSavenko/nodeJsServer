const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http').Server(app);
const io = require('socket.io');
const port = 3000;
const Model = require('./app/model/note.model');
const connect = require('./config/db');

app.use(bodyParser.json());

socket = io(http);

socket.on('connection', socket => {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    connect.then(db => {
        Model.find({}).then(message => {
            socket.emit('get_post', message);
        });
    });

    socket.on('send_post', function (msg) {
        connect.then(db => {
            const posts = new Model({
                title: msg.title,
                text: msg.text,
            });
            return posts.save();
        }).then(() => {
            connect.then(db => {
                Model.find({}).then(message => {
                    socket.emit('get_post', message);
                    socket.broadcast.emit('get_post', message);
                });
            });
        });
    });
    socket.on('delete_post', function (msg) {
        connect.then(db => {
            Model.findByIdAndRemove(msg).then(message => {
                return message
            }).then(() => {
                connect.then(db => {
                    Model.find({}).then(message => {
                        socket.emit('get_post', message);
                        socket.broadcast.emit('get_post', message);
                    });
                });
            });
        })
    });
    socket.on('update_post', function (msg) {
        connect.then(db => {
            Model.findByIdAndUpdate(msg.id, {
                title: msg.title,
                text: msg.text,
            }).then(message => {
                return message
            }).then(() => {
                connect.then(db => {
                    Model.find({}).then(message => {
                        socket.emit('get_post', message);
                        socket.broadcast.emit('get_post', message);
                    });
                });
            });
        })
    });
});

http.listen(port, () => {
    console.log('Running on Port: ' + port);
});
