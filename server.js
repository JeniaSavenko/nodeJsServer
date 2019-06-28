import express from 'express';
import bodyParser from 'body-parser';
import https from 'http';
import { checkToken } from './app/check-token';
import connect from './config/constants/connect';
import { Controller } from './app/controllers/user.controller';
import Socket from './socket';

const app = express();
const http = https.Server(app);
const router = express.Router();

app.use(bodyParser.json());

router.use(checkToken);

Controller(app);

http.listen(connect.port, () => {
  console.log(`Running on Port: ${connect.port}`);
});

Socket(http);
