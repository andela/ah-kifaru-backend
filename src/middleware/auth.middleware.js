import jwt from 'jsonwebtoken';
import responseGenerator from '../helpers/responseGenerator';

const decodeToken = (req, res, next, token) => {
  jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
    if (!error) {
      req.token = decode;
      return next();
    }
    return responseGenerator.sendError(res, 400, 'Token is not valid');
  });
};

const authMiddleware = (req, res, next) => {
  let token =
    req.headers['x-access-token'] ||
    req.headers.Authorization ||
    req.headers.token ||
    req.params.token;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    return decodeToken(req, res, next, token);
  }

  return responseGenerator.sendError(
    res,
    400,
    'Please assign a access token as header'
  );
};

export default authMiddleware;
