const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const nodeSass = require('node-sass');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const Path = require('./Path');


class Template {

  static get Name() {
    return {
      DASHBOARD: 'dashboard',
      LOGIN: 'login',
      WORD: 'word'
    };
  }

  static get _FILE_EXT() {
    return 'handlebars';
  }

  static get _TEMPLATES_DIR() {
    return path.join(Path.getApplicationRoot(), 'templates');
  }

  constructor() {
    this._registerHelpers();

    this._templates = {};
    Object.values(Template.Name)
      .forEach(templateName => {
        const templateFile = `${templateName}.${Template._FILE_EXT}`;
        const templatePath = path.join(Template._TEMPLATES_DIR, templateFile);
        const rawTemplate = fs.readFileSync(templatePath, 'utf-8');
        this._templates[templateName] = handlebars.compile(rawTemplate);
      });
  }

  populate(name, data) {
    if (process.env.NODE_ENV !== 'production')
      return Promise
        .all([this._getDevStyle(), this._getDevScript()])
        .then(devContent => Object.assign({
          devStyle: devContent[0],
          devScript: devContent[1]
        }, data))
        .then(devData => this._templates[name](devData));

    return Promise.resolve(this._templates[name](data));
  }

  _registerHelpers() {
    handlebars.registerHelper(
      'ternary', (condition, onTrue, onFalse) => condition ? onTrue : onFalse);
  }

  _getDevStyle() {
    const styleDir = path.join(Template._TEMPLATES_DIR, 'style');

    return Promise.resolve()
      .then(() => new Promise((resolve, reject) =>
        fs.readFile(path.join(styleDir, 'style.scss'), 'utf-8', (err, data) =>
          err ? reject(err) : resolve(data))))
      .then(data => new Promise((resolve, reject) =>
        nodeSass.render({data: data, includePaths: [styleDir]}, (err, result) =>
          err ? reject(err) : resolve(`<style type="text/css">${result.css.toString()}</style>`))));
  }

  _getDevScript() {
    const scriptDir = path.join(Template._TEMPLATES_DIR, 'script');

    return new Promise((resolve, reject) => {
      const memoryFs = new MemoryFS();
      const compiler = webpack({
        target: 'web',
        mode: 'development',
        entry: path.join(scriptDir, 'script.js'),
        output: {
          path: '/',
          filename: 'script.js'
        },
        externals: {
          '../style/style.scss': 'window'
        }
      });

      compiler.outputFileSystem = memoryFs;

      compiler.run((err, stats) => {
        if (err)
          return reject(err);

        if (stats.hasErrors() || stats.hasWarnings())
          return reject(new Error(stats.toString({
            errorDetails: true,
            warnings: true
          })));

        const result = compiler.outputFileSystem.data['script.js'].toString();
        return resolve(`<script type="text/javascript">${result}</script>`);
      });
    });
  }
}

module.exports = Template;
