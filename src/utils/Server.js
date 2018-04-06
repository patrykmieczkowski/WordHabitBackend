const express = require('express');
const AppContext = require('./AppContext');


class Server {

  constructor() {
    this._app = express();
  }

  setName(name) {
    this._name = name;
  }

  getName() {
    return this._name;
  }

  setVersion(version) {
    this._version = version;
  }

  getVersion() {
    return this._version;
  }

  setPort(port) {
    this._port = port;
  }

  getPort() {
    return this._port;
  }

  setRouter(baseUrl, router) {
    this._app.use(baseUrl, router.getExpressRouter());
    this._router = router;
  }

  getRouter() {
    return this._router;
  }

  listen() {
    this._app.listen(this.getPort(), () => AppContext.instance().getLogger().info(
      `${this.getName()} v${this.getVersion()} server listening on port ${this.getPort()}...`));
  }
}

module.exports = Server;
