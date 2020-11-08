const jwt = require('jsonwebtoken');
const NotFoundError = require('../utils/Errors');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new NotFoundError({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
