const path = require('path');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const Route = require('../abstract/Route');
const AppContext = require('../../utils/AppContext');
const Template = require('../../utils/Template');
const WordModel = require('../../model/WordModel');


class PanelWordRoute extends Route {

  GET(req, res, next) {
    this.authenticate()
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new Error('NOT_AUTHENTICATED');
      })
      .then(() => {
        this.render(Template.Name.WORD, {});
      })
      .catch(err => {
        const message = err && (err.message || err);
        AppContext.instance().getLogger().error(
          `\`PanelWordRoute\` failure: "${message}"`);
        this.redirect('/panel/login', {error: message});
      });
  }

  POST(req, res, next) {
    const form = res.locals.multipartForm;

    let fields = {};
    let files = {};
    Object.keys(form.fields).forEach(field => fields[field] = form.fields[field][0]);
    Object.keys(form.files).forEach(file => files[file] = form.files[file][0]);

    this.authenticate()
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new Error('NOT_AUTHENTICATED');
      })
      .then(() => {
        const word = new WordModel();
        word.setId(uuidv4());
        word.setPrimaryLang(fields.primaryLang);
        word.setSecondaryLang(fields.secondaryLang);
        word.setEnvironment(fields.environment);
        word.setPrimaryLangWord(fields.primaryLangWord);
        word.setPrimaryLangDescription(fields.primaryLangDescription);
        word.setSecondaryLangWord(fields.secondaryLangWord);
        word.setSecondaryLangDescription(fields.secondaryLangDescription);
        word.setImageUrl(fields.imageOption === 'URL'
          ? fields.imageUrl.trim()
          : path.basename(files.imageFile.path));
        word.setExecuted(false);
        word.setExecuteAt(moment(`${fields.executeAtDate} ${fields.executeAtTime}`)
          .add(fields.timezoneOffset, 'minutes')
          .toDate());
        return word.insert();
      })
      .then(() => {
        this.redirect('/panel/dashboard');
      })
      .catch(err => {
        const message = err && err.message;
        AppContext.instance().getLogger().error(
          `\`PanelWordRoute\` failure: "${message}"`);
        this.redirect('/panel/login', {error: message});
      });
  }
}

module.exports = PanelWordRoute;
