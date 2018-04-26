const querystring = require('querystring');
const AppContext = require('../../utils/AppContext');
const Router = require('../../utils/Router');
const AdminSessionModel = require('../../model/AdminSessionModel');


class Route {

  static get Status() {
    return {
      OK: 200,
      MOVED_PERMANENTLY: 301,
      FOUND: 302,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500
    };
  }

  static get Type() {
    return {
      HTML: 'html',
      JSON: 'json'
    };
  }

  constructor() {
      this.handle = this.handle.bind(this);
  }

  handle(req, res, next) {
    switch (req.method) {
      case Router.Method.POST.toUpperCase():
        this.POST(req, res, next);
        break;
      case Router.Method.GET.toUpperCase():
        this.GET(req, res, next);
        break;
      case Router.Method.PUT.toUpperCase():
        this.PUT(req, res, next);
        break;
      case Router.Method.DELETE.toUpperCase():
        this.DELETE(req, res, next);
        break;
    }
  }

  authenticate(req, res, next) {
    const SID = req.cookies.SID;

    if (!SID)
      return Promise.resolve(false);

    const SIDParts = decodeURIComponent(SID).split(':');
    const adminUsername = SIDParts[0];
    const adminSessionId = SIDParts[1];

    return AdminSessionModel.selectOne(adminUsername)
      .then(adminSession => adminSession && adminSession.getId().toString() === adminSessionId);
  }

  render(req, res, next, templateName, data) {
    res.locals.status = Route.Status.OK;
    res.locals.type = Route.Type.HTML;
    AppContext.instance().getTemplate().populate(templateName, data)
      .then(template => {
        res.locals.body = {data: data, template: template};
        next();
      });
  }

  goTo(req, res, next, path, params) {
    const encodedParams = querystring.stringify(params);
    const fullPath = `${path}${encodedParams ? `?${encodedParams}` : ''}`;
    res.location(fullPath);
    res.locals.status = Route.Status.FOUND;
    res.locals.type = Route.Type.HTML;
    res.locals.body = '';
    next();
  }

  redirect(req, res, next, path, params) {
    const encodedParams = querystring.stringify(params);
    const fullPath = `${path}${encodedParams ? `?${encodedParams}` : ''}`;
    res.redirect(Route.Status.MOVED_PERMANENTLY, fullPath);
    next();
  }

  ok(req, res, next, body, type) {
    this._sendResponseWithData(req, res, next, Route.Status.OK, type, body);
  }

  badRequest(req, res, next, body, type) {
    this._sendResponseWithData(req, res, next, Route.Status.BAD_REQUEST, type, body);
  }

  unauthorized(req, res, next, body, type) {
    this._sendResponseWithData(req, res, next, Route.Status.UNAUTHORIZED, type, body);
  }

  forbidden(req, res, next, body, type) {
    this._sendResponseWithData(req, res, next, Route.Status.FORBIDDEN, type, body);
  }

  internalServerError(req, res, next, body, type) {
    this._sendResponseWithData(req, res, next, Route.Status.INTERNAL_SERVER_ERROR, type, body);
  }

  _sendResponseWithData(req, res, next, status, type = Route.Type.JSON, body = {}) {
    res.locals.status = status;
    res.locals.type = type;
    res.locals.body = body;
    next();
  }

  POST(req, res, next) {
  }

  GET(req, res, next) {
  }

  PUT(req, res, next) {
  }

  DELETE(req, res, next) {
  }
}

module.exports = Route;
