const bodyParser = require('body-parser');
const Middleware = require('./abstract/Middleware');


class UrlencodedMiddleware extends Middleware {

  handle(req, res, next) {
    bodyParser.urlencoded({extended: false})(req, res, next);
  }
}

module.exports = UrlencodedMiddleware;
