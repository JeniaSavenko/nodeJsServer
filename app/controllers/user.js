import jwt from 'jsonwebtoken';
import UserModel from '../model/user';
import connect from '../../config/constants/connect';
import status from '../../config/constants/status';

const expiresIn = '1h';

export const createToken = payload => jwt.sign(payload, connect.secretKey, { expiresIn });

export const Controller = (app) => {
  app.post(`${connect.mainUrl}${connect.login}`, (req, resolve) => {
    const { name, password } = req.body;
    UserModel.findOne({ name })
      .then((user) => {
        user.comparePassword(name, password, user, resolve);
      })
      .catch((err) => {
        resolve.status(status.status500)
          .send({
            message: err.message || status.message500,
          });
      });
  });

  app.post(`${connect.mainUrl}${connect.reg}`, (req, res) => {
    const { name, password } = req.body;
    UserModel.find()
      .then(() => {
        const accessToken = createToken({
          name,
          password,
        });
        const user = new UserModel({
          name: name || status.messageUntitled,
          password,
          token: accessToken,
        });
        user.save()
          .then((data) => {
            res.send(data);
          });
      })
      .catch((err) => {
        res.status(status.status500)
          .send({
            message: err.message || status.message500,
          });
      });
  });
};
