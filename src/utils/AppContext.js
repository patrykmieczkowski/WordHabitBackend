const Singleton = require('./abstract/Singleton');


class AppContext extends Singleton {

  setAddress(address) {
    this._address = address;
  }

  getAddress() {
    return this._address;
  }

  setLogger(logger) {
    this._logger = logger;
  }

  getLogger() {
    return this._logger;
  }

  setCassandra(cassandra) {
    this._cassandra = cassandra;
  }

  getCassandra() {
    return this._cassandra;
  }

  setTemplate(template) {
    this._template = template;
  }

  getTemplate() {
    return this._template;
  }
}

module.exports = AppContext;
