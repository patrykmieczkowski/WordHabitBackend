const AppContext = require('../../utils/AppContext');
const Router = require('../../utils/Router');
const AdminSessionModel = require('../../model/AdminSessionModel');


class Route {

  static get STATUS() {
    return {
      OK: 200,
      FOUND: 302,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404
    };
  }

  static get TYPE() {
    return {
      HTML: 'html',
      JSON: 'json'
    };
  }

  constructor() {
      this.handle = this.handle.bind(this);
  }

  handle(req, res, next) {
    this._req = req;
    this._res = res;
    this._next = next;

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

  authenticate() {
    const SID = this._req.cookies.SID;

    if (!SID)
      return Promise.resolve(false);

    const SIDParts = decodeURIComponent(SID).split(':');
    const adminUsername = SIDParts[0];
    const adminSessionId = SIDParts[1];

    return AdminSessionModel.selectOne(adminUsername)
      .then(adminSession => adminSession && adminSession.getId().toString() === adminSessionId);
  }

  render(templateName, data) {
    this._res.locals.status = Route.STATUS.OK;
    this._res.locals.type = Route.TYPE.HTML;
    this._res.locals.body = AppContext.instance().getTemplate().populate(templateName, data);
    this._next();
  }

  redirect(path, params) {
    let encodedParams;

    if (params)
      encodedParams = Object.keys(params)
        .map(paramKey => `${encodeURIComponent(paramKey)}=${encodeURIComponent(params[paramKey])}`)
        .join('&');

    path = `${path}${encodedParams ? `?${encodedParams}` : ''}`;

    this._res.redirect(Route.STATUS.FOUND, path);
    this._next();
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
