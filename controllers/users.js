const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../Errors/NotFoundError');
const NotValidIdError = require('../Errors/NotValidIdError');
const ConflictRequestError = require('../Errors/ConflictRequestError');

const { JWT_SECRET, NODE_ENV } = process.env;

// Запрос пользователя
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(404, 'Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10).then((hashPass) => {
    User.create({ password: hashPass, email, name })
      .then((user) => res.send({ _id: user._id }))
      .catch((error) => {
        if (error.code === 11000) {
          next(new ConflictRequestError(409, 'Пользователь с данным email уже зарегистрирован'));
        } else {
          next(new NotValidIdError(400, error.message));
        }
      });
  });
};

// логирование
module.exports.login = (req, res, next) => {
  const { password, email } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
