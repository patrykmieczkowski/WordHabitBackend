const Route = require('../abstract/Route');
const AppContext = require('../../utils/AppContext');
const Template = require('../../utils/Template');
const WordModel = require('../../model/WordModel');


class PanelDashboardRoute extends Route {

  GET(req, res, next) {
    this.authenticate()
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new Error('NOT_AUTHENTICATED');
      })
      .then(() => {
        return WordModel.selectAll();
      })
      .then(words => {
        words = (words || []).map(word => word.serialize());
        return this.render(Template.Name.DASHBOARD, {words: words});
      })
      .catch(err => {
        const message = err && err.message;
        AppContext.instance().getLogger().error(
          `\`PanelDashboardRoute\` failure: "${message}"`);
        this.redirect('/panel/login', {error: message});
      });
  }
}

module.exports = PanelDashboardRoute;