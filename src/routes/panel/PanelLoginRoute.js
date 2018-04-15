const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const Route = require('../abstract/Route');
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
          throw new Error('INVALID_USERNAME_OR_PASSWORD');
        context.admin = admin;
        return bcrypt.compare(req.body.password, admin.getPassword());
      })
      .then(result => {
        if (!result)
          throw new Error('INVALID_USERNAME_OR_PASSWORD');
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
        this.goTo(req, res, next, '/panel/dashboard');
      })
      .catch(err => {
        const message = err && err.message;
        AppContext.instance().getLogger().error(
          `\`PanelLoginRoute\` failure: "${message}"`);
        this.render(req, res, next, Template.Name.LOGIN, {error: message});
      });
  }
}

module.exports = PanelLoginRoute;
