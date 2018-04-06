const AppContext = require('../utils/AppContext');
const Middleware = require('./abstract/Middleware');


class LogOutgoingMiddleware extends Middleware {

  handle(req, res, next) {
    AppContext.instance().getLogger().info(
      `Outgoing response from: "${req.originalUrl}" ` +
      `to: "${req.headers['x-forwarded-for']}" ` +
      `with body: "${JSON.stringify(res.locals.body)}" ` +
      `and status: "${JSON.stringify(res.locals.status)}"`
    );

    next();
  }
}

module.exports = LogOutgoingMiddleware;
