const Article = require('../models/article');
const NotFoundError = require('../Errors/NotFoundError');
const NotValidIdError = require('../Errors/NotValidIdError');
const ForbiddenError = require('../Errors/ForbiddenError');

// Запрос всех карточек
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send(articles))
    .catch(next);
};

// Создание новости
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      Article.findById(article._id)
        .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
        .then((art) => {
          res.send(art);
        });
    }).catch(() => next(new NotValidIdError(400, 'Невалидный Id')));
};

// Удаление новости
module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .populate(['owner'])
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .then((art) => {
      if (art.owner._id.toString() === req.user._id.toString()) {
        Article.deleteOne(art)
          .then((deletedArticle) => {
            res.send(deletedArticle);
          });
      } else {
        throw new ForbiddenError(403, 'Вы пытаетесь удалить чужую новость');
      }
    })
    .catch(next);
};
