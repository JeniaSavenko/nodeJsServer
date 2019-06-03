const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const Message = mongoose.model('Message', {
    title: String,
    text: String,
});

const dbUrl = 'mongodb+srv://admin:2mn12d61409@cluster0-qsuzq.mongodb.net/testDataBase?retryWrites=true'

app.get('/', (req, res) => {
    Message.find({}, (err, messages) => {
        io.emit('message', messages);
        res.send(messages);
    })
});

app.get('/:noteId', (req, res) => {
    var title = req.params.title;
    Message.find({title: title}, (err, messages) => {
        res.send(messages);
    })
});

app.post('/', async (req, res) => {
    try {
        var message = new Message(req.body);
        var savedMessage = await message.save();
        console.log('saved');
        io.emit('message', req.body);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        return console.log('error', error);
    } finally {
        console.log('Message Posted')
    }

});

io.on('connection', () => {
    console.log('a user is connected')
});

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
});

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});
