const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');


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

  constructor() {
    this._templates = {};
    Object.values(Template.Name).forEach(templateName => {
      const templateFile = `${templateName}.${Template._FILE_EXT}`;
      const templatePath = path.join(__dirname, '..', 'templates', templateFile);
      const rawTemplate = fs.readFileSync(templatePath, 'utf-8');
      this._templates[templateName] = handlebars.compile(rawTemplate);
    });
  }

  populate(name, data) {
    return this._templates[name](data);
  }
}

module.exports = Template;
