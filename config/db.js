const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const url = 'mongodb+srv://admin:2mn12d61409@cluster0-qsuzq.mongodb.net/testDataBase?retryWrites=true';

const connect = mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: true });

module.exports = connect;
