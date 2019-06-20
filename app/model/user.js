import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Constants from '../../config/constants';
import { createToken } from '../controllers/user.controller';

const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: String,
  password: String,
  token: String,
});

UsersSchema.pre(Constants.save, function (next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UsersSchema.methods = {
  comparePassword(name, password, user, resolve) {
    bcrypt
      .compare(password, user.password, (err, res) => {
        if (res) {
          const accessToken = createToken({
            name,
            password,
          });
          resolve.status(200)
            .json({ accessToken });
        } else {
          resolve.status(Constants.status500)
            .send({
              message: err.message || Constants.message500,
            });
        }
      });
  },
};

const User = mongoose.model('User', UsersSchema);

export default User;
