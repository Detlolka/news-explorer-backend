const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

const validatorLink = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Ссылка не валидна');
  }
  return value;
};

// Запрос всех сохраненных статей
router.get('/', getArticles);

// Создание статьи
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(validatorLink).required(),
    image: Joi.string().custom(validatorLink).required(),
  }),
}), createArticle);

// Удаление новости
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), deleteArticle);

module.exports = router;
