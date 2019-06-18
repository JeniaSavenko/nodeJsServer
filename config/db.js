import mongoose from 'mongoose';
import Constants from './constants';

mongoose.Promise = require('bluebird');

const connect = mongoose.connect(Constants.url, { useNewUrlParser: true, useFindAndModify: true });

export default connect;
