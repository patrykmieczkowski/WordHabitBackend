const Middleware = require('./abstract/Middleware');


class EmptyMiddleware extends Middleware {

  handle(req, res, next) {
    next();
  }
}

module.exports = EmptyMiddleware;
