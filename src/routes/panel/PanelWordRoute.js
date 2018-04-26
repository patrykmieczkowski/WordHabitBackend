const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const Route = require('../abstract/Route');
const HttpError = require('../../utils/HttpError');
const AppContext = require('../../utils/AppContext');
const Validator = require('../../utils/Validator');
const Template = require('../../utils/Template');
const WordModel = require('../../model/WordModel');


class PanelWordRoute extends Route {

  GET(req, res, next) {
    this.authenticate(req, res, next)
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new HttpError(HttpError.Code.FORBIDDEN);
      })
      .then(() => {
        this.render(req, res, next, Template.Name.WORD, {});
      })
      .catch(err => {
        const message = err && (err.message || err);
        AppContext.instance().getLogger().error(
          `\`PanelWordRoute\` failure: "${message}"`);
        switch (err && err.code) {
          case HttpError.Code.FORBIDDEN:
            this.goTo(req, res, next, '/panel/login', {error: message});
            break;
          case HttpError.Code.INTERNAL_SERVER_ERROR:
          default:
            this.render(req, res, next, Template.Name.WORD, {error: message});
            break;
        }
      });
  }

  POST(req, res, next) {
    const form = res.locals.multipartForm;

    let fields = {};
    let files = {};
    Object.keys(form.fields).forEach(field => fields[field] = form.fields[field][0]);
    Object.keys(form.files).forEach(file => files[file] = form.files[file][0]);

    if (fields.timezoneOffset)
      fields.timezoneOffset = parseInt(fields.timezoneOffset);

    this.authenticate(req, res, next)
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new HttpError(HttpError.Code.FORBIDDEN);
      })
      .then(() => {
        return AppContext.instance().getValidator().validate({
          primaryLang: Validator.notEmptyString,
          secondaryLang: Validator.notEmptyString,
          environment: Validator.notEmptyString,
          primaryLangWord: Validator.notEmptyString,
          primaryLangDescription: Validator.notEmptyString,
          secondaryLangWord: Validator.notEmptyString,
          secondaryLangDescription: Validator.notEmptyString,
          imageOption: Validator.notEmptyString,
          imageUrl: {
            validateFunc: Validator.imageUrl,
            optional: fields.imageOption !== 'URL'
          },
          imageFile: {
            validateFunc: Validator.imagePath,
            optional: fields.imageOption !== 'FILE'
          },
          executeAtDate: Validator.dateString,
          executeAtTime: Validator.timeString,
          timezoneOffset: Validator.integer
        }, Object.assign({}, fields, {imageFile: files && files.imageFile && files.imageFile.path}));
      })
      .then(result => {
        if (!result.isValid)
          throw new HttpError(HttpError.Code.BAD_REQUEST, 'Form contains invalid fields');
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
        this.ok(req, res, next);
      })
      .catch(err => {
        const message = err && err.message;
        AppContext.instance().getLogger().error(
          `\`PanelWordRoute\` failure: "${message}"`);
        if (files && files.imageFile && files.imageFile.path)
          fs.unlink(files.imageFile.path, Function.prototype);
        switch (err && err.code) {
          case HttpError.Code.BAD_REQUEST:
            this.badRequest(req, res, next, {error: message});
            break;
          case HttpError.Code.FORBIDDEN:
            this.goTo(req, res, next, '/panel/login', {error: message});
            break;
          case HttpError.Code.INTERNAL_SERVER_ERROR:
          default:
            this.internalServerError(req, res, next, {error: message});
            break;
        }
      });
  }

  DELETE(req, res, next) {
    this.authenticate(req, res, next)
      .then(isUserAuthenticated => {
        if (!isUserAuthenticated)
          throw new HttpError(HttpError.Code.FORBIDDEN);
      })
      .then(() => {
        return WordModel.deleteOne(req.params.id);
      })
      .then(() => {
        this.ok(req, res, next);
      })
      .catch(err => {
        const message = err && (err.message || err);
        AppContext.instance().getLogger().error(
          `\`PanelWordRoute\` failure: "${message}"`);
        switch (err && err.code) {
          case HttpError.Code.FORBIDDEN:
            this.goTo(req, res, next, '/panel/login', {error: message});
            break;
          case HttpError.Code.INTERNAL_SERVER_ERROR:
          default:
            this.internalServerError(req, res, next, {error: message});
            break;
        }
      });
  }
}

module.exports = PanelWordRoute;
