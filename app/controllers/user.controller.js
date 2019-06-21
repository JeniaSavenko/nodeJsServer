import jwt from 'jsonwebtoken';
import UserModel from '../model/user';
import Constants, { messageExist, status401 } from '../../config/constants';

const expiresIn = '1h';

export const createToken = payload => jwt.sign(payload, Constants.secretKey, { expiresIn });

export const Controller = (app) => {
  app.post(`${Constants.mainUrl}${Constants.login}`, (req, resolve) => {
    const { name, password } = req.body;
    UserModel.findOne({ name })
      .then((user) => {
        user.comparePassword(name, password, user, resolve);
      })
      .catch((err) => {
        resolve.status(Constants.status500)
          .send({
            message: err.message || Constants.message500,
          });
      });
  });

  app.post(`${Constants.mainUrl}${Constants.reg}`, (req, res) => {
    const { name, password } = req.body;
    UserModel.find()
      .then(() => {
        const accessToken = createToken({
          name,
          password,
        });
        const user = new UserModel({
          name: name || Constants.messageUntitled,
          password,
          token: accessToken,
        });
        user.save()
          .then((data) => {
            res.send(data);
          });
      })
      .catch((err) => {
        res.status(Constants.status500)
          .send({
            message: err.message || Constants.message500,
          });
      });
  });
};
