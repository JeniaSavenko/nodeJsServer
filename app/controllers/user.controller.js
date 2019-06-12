const jwt = require('jsonwebtoken');
const UserModel = require('./../model/user.model');
const NoteModel = require('./../model/note.model');
const connect = require('../../config/db');
const { ObjectID } = require('mongodb');
const secretKey = '123456789';
const expiresIn = '1h';

const createToken = payload => jwt.sign(payload, secretKey, { expiresIn });

function isAuthenticated({ name, password, notes }) {
  return notes.findIndex(user => user.name === name && user.password === password) !== -1;
}

module.exports = (app) => {
  app.post('/auth/login', (req, res) => {
    const { name, password } = req.body;
    UserModel.find()
      .then((notes) => {
        if (isAuthenticated({
          name,
          password,
          notes,
        }) === false) {
          const status = 401;
          const message = 'Incorrect email or password';
          res.status(status)
            .json({
              status,
              message,
            });
          return;
        }

        const accessToken = createToken({
          name,
          password,
        });
        res.status(200)
          .json({ accessToken });
      })
      .catch((err) => {
        res.status(500)
          .send({
            message: err.message || 'Some error occurred while retrieving notes.',
          });
      });
  });

  app.post('/auth/reg', (req, res) => {
    const { name, password } = req.body;
    UserModel.find()
      .then((notes) => {
        if (isAuthenticated({
          name,
          password,
          notes,
        }) === true) {
          const status = 401;
          const message = 'This name already exist';
          res.status(status)
            .json({
              status,
              message,
            });
          return;
        }
        const accessToken = createToken({
          name,
          password,
        });
        const user = new UserModel({
          name: name || 'Untitled Note',
          password,
          token: accessToken,
        });
        // Save Note in the database
        user.save()
          .then((data) => {
            res.send(data);
          });
      })
      .catch((err) => {
        res.status(500)
          .send({
            message: err.message || 'Some error occurred while retrieving notes.',
          });
      });
  });
};
