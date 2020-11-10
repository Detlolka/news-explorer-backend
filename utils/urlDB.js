module.exports = {
  URL_DB: (process.env.NODE_ENV !== 'production') ? 'mongodb://localhost:27017/newsdb' : process.env.URL_DB,
};
