class Middleware {

  constructor() {
    this.handle = this.handle.bind(this);
  }

  handle(req, res, next) {
  }
}

module.exports = Middleware;
