const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

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
    link: Joi.string().required().pattern(/^(https?:\/\/(www\.)?)[\w-]+\.[\w./():,-]+#?$/),
    image: Joi.string().required().pattern(/^(https?:\/\/(www\.)?)[\w-]+\.[\w./():,-]+#?$/),
  }),
}), createArticle);

// Удаление новости
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), deleteArticle);

module.exports = router;
