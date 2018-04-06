const Middleware = require('./abstract/Middleware');


class SendResponseMiddleware extends Middleware {

  handle(req, res, next) {
    if (res.headersSent)
      return;

    res.status(res.locals.status);
    res.type(res.locals.type);
    res.send(res.locals.body);
  }
}

module.exports = SendResponseMiddleware;
