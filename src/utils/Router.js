const express = require('express');
const CookieMiddleware = require('../middleware/CookieMiddleware');
const LogIncomingMiddleware = require('../middleware/LogIncomingMiddleware');
const LogOutgoingMiddleware = require('../middleware/LogOutgoingMiddleware');
const SendResponseMiddleware = require('../middleware/SendResponseMiddleware');


class Router {

  static get Method() {
    return {
      POST: 'post',
      GET: 'get',
      PUT: 'put',
      DELETE: 'delete'
    };
  }

  constructor() {
    this._router = express.Router();

    this._cookieMiddleware = new CookieMiddleware();
    this._logIncomingMiddleware = new LogIncomingMiddleware();
    this._logOutgoingMiddleware = new LogOutgoingMiddleware();
    this._sendResponseMiddleware = new SendResponseMiddleware();
  }

  addEndpoint(method, path, route, middleware) {
    this.getExpressRouter()[method](
      path,
      this._cookieMiddleware.handle,
      middleware.handle,
      this._logIncomingMiddleware.handle,
      route.handle,
      this._logOutgoingMiddleware.handle,
      this._sendResponseMiddleware.handle
    );
  }

  getExpressRouter() {
    return this._router;
  }
}

module.exports = Router;
