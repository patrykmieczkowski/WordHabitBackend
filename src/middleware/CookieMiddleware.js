const cookieParser = require('cookie-parser');
const Middleware = require('./abstract/Middleware');


class CookieMiddleware extends Middleware {

  handle(req, res, next) {
    cookieParser()(req, res, next);
  }
}

module.exports = CookieMiddleware;
