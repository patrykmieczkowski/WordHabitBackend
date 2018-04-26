const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const Route = require('../abstract/Route');
const HttpError = require('../../utils/HttpError');
const AppContext = require('../../utils/AppContext');
const Template = require('../../utils/Template');
const AdminModel = require('../../model/AdminModel');
const AdminSessionModel = require('../../model/AdminSessionModel');


class PanelLoginRoute extends Route {

  GET(req, res, next) {
    let data = {};

    if (req.query.error)
      data.error = req.query.error;

    this.render(req, res, next, Template.Name.LOGIN, data);
  }

  POST(req, res, next) {
    let context = {};

    AdminModel.selectOne(req.body.username)
      .then(admin => {
        if (!admin)
          throw new HttpError(HttpError.Code.UNAUTHORIZED);
        context.admin = admin;
        return bcrypt.compare(req.body.password, admin.getPassword());
      })
      .then(result => {
        if (!result)
          throw new HttpError(HttpError.Code.UNAUTHORIZED);
        return AdminSessionModel.selectOne(context.admin.getUsername())
      })
      .then(adminSession => {
        if (!adminSession) {
          adminSession = new AdminSessionModel();
          adminSession.setId(uuidv4());
          adminSession.setAdminUsername(context.admin.getUsername());
          context.adminSession = adminSession;
          return adminSession.insert();
        }
        context.adminSession = adminSession;
      })
      .then(() => {
        const adminUsername = context.adminSession.getAdminUsername();
        const adminSessionId = context.adminSession.getId().toString();
        res.cookie('SID', `${adminUsername}:${adminSessionId}`, {
          expire: new Date(2147483647000).toUTCString(),
          httpOnly: true
        });
        this.ok(req, res, next);
      })
      .catch(err => {
        const message = err && err.message;
        AppContext.instance().getLogger().error(
          `\`PanelLoginRoute\` failure: "${message}"`);
        switch (err && err.code) {
          case HttpError.Code.UNAUTHORIZED:
            this.unauthorized(req, res, next, {error: message});
            break;
          case HttpError.Code.INTERNAL_SERVER_ERROR:
          default:
            this.internalServerError(req, res, next, {error: message});
            break;
        }
      });
  }
}

module.exports = PanelLoginRoute;
