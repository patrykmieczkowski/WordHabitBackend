const path = require('path');


class Path {

  static getProjectRoot() {
    return process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '..')
      : path.resolve(__dirname, '..', '..');
  }

  static getApplicationRoot() {
    return process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname)
      : path.resolve(__dirname, '..');
  }
}

module.exports = Path;
