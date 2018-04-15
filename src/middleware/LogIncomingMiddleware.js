const AppContext = require('../utils/AppContext');
const Middleware = require('./abstract/Middleware');


class LogIncomingMiddleware extends Middleware {

  handle(req, res, next) {
    let raw;

    if (req.is('json'))
      raw = req.body || {};
    else if (req.is('multipart'))
      raw = res.locals.multipartForm || {};
    else if (req.is('urlencoded'))
      raw = req.body || {};
    else
      raw = {};

    const body = JSON.parse(JSON.stringify(raw));
    if (body.password)
      body.password = '*';

    AppContext.instance().getLogger().info(
      `Incoming: "${req.method}" request from: "${req.headers['x-forwarded-for']}" ` +
      `to: "${req.originalUrl}" ` +
      `with body: "${JSON.stringify(body)}" ` +
      `and headers: "${JSON.stringify(req.headers)}"`
    );

    next();
  }
}

module.exports = LogIncomingMiddleware;
