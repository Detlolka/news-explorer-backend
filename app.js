const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const users = require('./routes/users');
const articles = require('./routes/articles');
const auth = require('./middlewares/auth');
require('dotenv').config();
const NotFoundError = require('./utils/Errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowsMs: 60 * 60 * 1000,
  max: 500,
});

app.use(limiter);

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(3),
    email: Joi.string().required().min(3),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3),
    password: Joi.string().required().min(3),
    name: Joi.string().required().min(3),
  }),
}), createUser);

app.use('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, articles);

app.use('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, users);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(PORT);
});
