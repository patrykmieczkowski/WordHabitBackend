const AppContext = require('../utils/AppContext');
const Middleware = require('./abstract/Middleware');


class LogOutgoingMiddleware extends Middleware {

  handle(req, res, next) {
    const body = res.locals.type === 'html'
      ? res.locals.body.data || res.locals.body
      : res.locals.body;

    AppContext.instance().getLogger().info(
      `Outgoing response from: "${req.originalUrl}" ` +
      `to: "${req.headers['x-forwarded-for']}" ` +
      `with body: "${JSON.stringify(body)}" ` +
      `and status: "${JSON.stringify(res.locals.status)}"`
    );

    next();
  }
}

module.exports = LogOutgoingMiddleware;
