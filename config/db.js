import mongoose from 'mongoose';
import connectConst from './constants/connect';

mongoose.Promise = require('bluebird');

const connect = mongoose.connect(connectConst.url, { useNewUrlParser: true, useFindAndModify: true });

export default connect;
