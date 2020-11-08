const mongoose = require('mongoose');

const validateUrl = /^(https?:\/\/(www\.)?)[\w-]+\.[\w./():,-]+#?$/;

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validateUrl.test(v);
      },
      message: 'Введите корректную ссылку на статью',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validateUrl.test(v);
      },
      message: 'Введите корректную ссылку на иллюстрация',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('article', articleSchema);
