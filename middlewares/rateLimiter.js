const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowsMs: 60 * 60 * 1000,
  max: 500,
});

module.exports = { limiter };
