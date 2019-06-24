import jwt from 'jsonwebtoken';
import Constants from '../config/constants';

export const checkToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, Constants.secretKey, (err, decoded) => {
      if (err) {
        return res.json({
          err,
          success: false,
          message: 'Token is not valid',
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied',
    });
  }
};
