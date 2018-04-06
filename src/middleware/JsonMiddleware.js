const bodyParser = require('body-parser');
const Middleware = require('./abstract/Middleware');


class JsonMiddleware extends Middleware {

  handle(req, res, next) {
    bodyParser.json()(req, res, next);
  }
}

module.exports = JsonMiddleware;
