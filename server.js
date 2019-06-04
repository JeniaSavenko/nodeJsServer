const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const app = express();
const io = require('socket.io');
const http = require('http').Server(app);
const port = 3000;
const mongoose = require('mongoose');
const Note = require('./app/model/note.model.js');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(db.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const socket = io(http);

socket.on('connection', (socket) => {
    console.log('user connected');
    socket.on("disconnect", () => {
        console.log("Disconnected")
    });
    socket.on('example_message', function (msg) {
        const note = new Note({
            title: msg.title || "Untitled Note",
            text: msg.text
        });
        MongoClient.connect(db.url, (err) => {
            note.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                });
            });

            Note.find()
                .then(notes => {
                    console.log(notes);
                    socket.emit('testing', notes)
                }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving notes."
                });
            });
        });
    });
});

MongoClient.connect(db.url, (err) => {
    if (err) return console.log(err);
    app.get('/', (req, res) => {
        Note.find()
            .then(notes => {
                res.send(notes);
                socket.emit("chat", notes)
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
    });
    app.get('/:noteId', (req, res) => {
        Note.findById(req.params.noteId)
            .then(note => {
                if (!note) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.noteId
                    });
                }
                res.send(note);
                socket.emit("chat", note)
            }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.noteId
            });
        });
    });
    app.put('/:noteId', (req, res) => {
        // Validate Request
        if (!req.body.text) {
            return res.status(400).send({
                message: "Note content can not be empty"
            });
        }
        // Find note and update it with the request body
        Note.findByIdAndUpdate(req.params.noteId, {
            title: req.body.title || "Untitled Note",
            text: req.body.text
        }, {new: true})
            .then(note => {
                if (!note) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.noteId
                    });
                }
                res.send(note);
                socket.emit("chat", note)
            }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
    });
    app.delete('/:noteId', (req, res) => {
        Note.findByIdAndRemove(req.params.noteId)
            .then(note => {
                if (!note) {
                    return res.status(404).send({
                        message: "Note not found with id " + req.params.noteId
                    });
                }
                res.send({message: "Note deleted successfully!"});
                socket.emit("chat", note)
            }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        });
    });
    http.listen(port, () => {
        console.log('We are live on ' + port);
    });
});



