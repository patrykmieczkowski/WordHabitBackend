const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const htmlMinifier = require('html-minifier');


class Template {

  static get Name() {
    return {
      DASHBOARD: 'dashboard',
      LOGIN: 'login',
      WORD: 'word'
    };
  }

  static get _STYLE() {
    return '_style';
  }

  static get _SCRIPT() {
    return '_script';
  }

  static get _FILE_EXT() {
    return 'handlebars';
  }

  constructor() {
    this._registerHelpers();

    this._templates = {};
    [].concat(Object.values(Template.Name), Template._STYLE, Template._SCRIPT)
      .forEach(templateName => {
        const templateFile = `${templateName}.${Template._FILE_EXT}`;
        const templatePath = path.join(__dirname, '..', 'templates', templateFile);
        const rawTemplate = fs.readFileSync(templatePath, 'utf-8');
        const minifiedRawTemplate = htmlMinifier.minify(rawTemplate, {
          minifyCSS: true,
          minifyJS: true,
          collapseWhitespace: true,
          removeComments: true
        });
        this._templates[templateName] = handlebars.compile(minifiedRawTemplate);
      });
  }

  populate(name, data) {
    return this._templates[name](Object.assign({}, data, this._getStaticTemplates()));
  }

  _getStaticTemplates() {
    return {
      [Template._STYLE]: this._templates[Template._STYLE],
      [Template._SCRIPT]: this._templates[Template._SCRIPT]
    };
  }

  _registerHelpers() {
    handlebars.registerHelper(
      'ternary',(condition, onTrue, onFalse) => condition ? onTrue : onFalse);
  }
}

module.exports = Template;
