const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const app = express();
const port = 8000;
const cors = require('cors');
const socketPort = 3000
const mongoose = require('mongoose');
const socket = require('socket.io');

var server = app.listen(5000,()=>{
    console.log("Howdy, I am running at PORT 5000")
})


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cors());

require('./app/routes/index.js')(app);



/*MongoClient.connect(db.url, (err) => {
    if (err) return console.log(err);
    require('./app/routes/index.js')(app);
    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
})*/

mongoose.connect(db.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

mongoose.connection.on('error',()=>{
    console.log("Error in database connection")
})
mongoose.connection.once('open',function(){
    console.log("DB connection established")
})


let io =  socket(server);




io.on("connection", function(socket){
    console.log("Socket Connection Established with ID :"+ socket.id)
    socket.on("createPost", async function(postCreated){
        let response = await postCreated
        console.log(response);
        socket.emit("postCreated",postCreated)
    })
})


