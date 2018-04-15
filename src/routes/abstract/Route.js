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
      NOT_FOUND: 404
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
    res.locals.body = AppContext.instance().getTemplate().populate(templateName, data);
    next();
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
