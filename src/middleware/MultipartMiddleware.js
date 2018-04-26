const path = require('path');
const multiparty = require('multiparty');
const Middleware = require('./abstract/Middleware');
const Path = require('../utils/Path');


class MultipartMiddleware extends Middleware {

  constructor(mediaDir) {
    super();
    this._uploadDir = path.join(Path.getProjectRoot(), mediaDir);
  }

  handle(req, res, next) {
    const form = new multiparty.Form({uploadDir: this._uploadDir});

    form.parse(req, (err, fields, files) => {
      res.locals.multipartForm = {err: err, fields: fields, files: files};
      next();
    });
  }
}

module.exports = MultipartMiddleware;
