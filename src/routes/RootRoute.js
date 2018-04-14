const Route = require('./abstract/Route');


class RootRoute extends Route {

  GET(req, res, next) {
    this.redirect('/panel/login');
  }
}

module.exports = RootRoute;
