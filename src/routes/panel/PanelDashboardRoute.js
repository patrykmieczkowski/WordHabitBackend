const Route = require('../abstract/Route');
const HttpError = require('../../utils/HttpError');
const AppContext = require('../../utils/AppContext');
const Template = require('../../utils/Template');
const WordModel = require('../../model/WordModel');


class PanelDashboardRoute extends Route {

  GET(req, res, next) {
    this.authenticate(req, res, next)
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new HttpError(HttpError.Code.FORBIDDEN);
      })
      .then(() => {
        return WordModel.selectAll();
      })
      .then(words => {
        (words || []).sort((a, b) => a.getExecuteAt() > b.getExecuteAt() ? -1 : 1);
        words = (words || []).map(word => word.serialize());
        return this.render(req, res, next, Template.Name.DASHBOARD, {words: words});
      })
      .catch(err => {
        const message = err && err.message;
        AppContext.instance().getLogger().error(
          `\`PanelDashboardRoute\` failure: "${message}"`);
        switch (err && err.code) {
          case HttpError.Code.FORBIDDEN:
            this.goTo(req, res, next, '/panel/login', {error: message});
            break;
          case HttpError.Code.INTERNAL_SERVER_ERROR:
          default:
            this.render(req, res, next, Template.Name.DASHBOARD, {error: message});
            break;
        }
      });
  }
}

module.exports = PanelDashboardRoute;
