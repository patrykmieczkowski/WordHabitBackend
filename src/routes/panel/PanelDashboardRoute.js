const Route = require('../abstract/Route');
const AppContext = require('../../utils/AppContext');
const Template = require('../../utils/Template');
const WordModel = require('../../model/WordModel');


class PanelDashboardRoute extends Route {

  GET(req, res, next) {
    this.authenticate(req, res, next)
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new Error('NOT_AUTHENTICATED');
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
        this.goTo(req, res, next, '/panel/login', {error: message});
      });
  }
}

module.exports = PanelDashboardRoute;
