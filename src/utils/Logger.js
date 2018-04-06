const moment = require('moment');


class Logger {

  info(text) {
    this._print('info', text);
  }

  warn(text) {
    this._print('warn', text);
  }

  error(text) {
    this._print('error', text);
  }

  _print(type, text) {
    let dateTime = this._getDateTime();
    let log = `${dateTime}: ${type.toUpperCase()}: ${text}`;
    console[type.toLowerCase()](log);
  }

  _getDateTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  }
}

module.exports = Logger;
