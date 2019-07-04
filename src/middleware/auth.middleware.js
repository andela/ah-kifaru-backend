const authMiddleware = (req, res, next) => {
  req.userInfo = req.headers.authorization;
  next();
};

export default authMiddleware;
