import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connect from '../../config/constants/connect';
import status from '../../config/constants/status';
import { createToken } from '../controllers/user.controller';

const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: { type: String, unique: true },
  password: String,
  token: String,
}, {
  timestamp: true,
});

UsersSchema.pre(connect.save, function (next) {
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
          resolve.status(status.status500)
            .send({
              message: err.message || status.message500,
            });
        }
      });
  },
};

const User = mongoose.model('User', UsersSchema);

export default User;
