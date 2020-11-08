const Article = require('../models/article');
const NotFoundError = require('../utils/Errors');

// Запрос всех карточек
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.status(200).send(articles))
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
      Article.findById(article._id).populate(['owner'])
        .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
        .then((art) => {
          res.status(200).send(art);
        });
    }).catch(() => next(new NotFoundError(400, 'Невалидный Id')));
};

// Удаление новости
module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
    .then((art) => {
      if (art.owner.toString() === req.user._id.toString()) {
        Article.findOneAndDelete({ _id: art._id })
          .populate(['owner'])
          .orFail(new NotFoundError(404, 'Данный id отсутствует в базе данных'))
          .then((deletedArticle) => {
            res.status(200).send(deletedArticle);
          });
      } else {
        throw new NotFoundError(403, 'Вы пытаетесь удалить чужую новость');
      }
    }).catch(next);
};
