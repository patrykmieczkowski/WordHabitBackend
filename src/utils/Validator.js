const url = require('url');
const http = require('http');
const https = require('https');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const StringUtils = require('./StringUtils');


class Validator {

  static get DATE_STRING_REGEXP() {
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
  }

  static get TIME_STRING_REGEXP() {
    return /^[0-9]{2}:[0-9]{2}$/;
  }

  static dateString(value) {
    return this.DATE_STRING_REGEXP.test(value);
  }

  static imagePath(value) {
    return readChunk(value, 0, 4100)
      .then(chunk => {
        const type = fileType(chunk);
        return this._isImageMime(type && type.mime);
      })
      .catch(err => false);
  }

  static imageUrl(value) {
    return new Promise((resolve, reject) => {
      if (!Validator.url(value))
        return resolve(false);
      return (/^http:\/\//.test(value) ? http : https).get(value, res =>
        res.once('data', chunk => {
          res.destroy();
          const type = fileType(chunk);
          return resolve(this._isImageMime(type && type.mime));
        }));
    });
  }

  static integer(value) {
    return Number.isInteger(value);
  }

  static notEmptyString(value) {
    return typeof value === 'string' && value !== '';
  }

  static timeString(value) {
    return this.TIME_STRING_REGEXP.test(value);
  }

  static url(value) {
    return typeof value === 'string' && !!url.parse(value).hostname;
  }

  static _isImageMime(mime) {
    return !!(~[
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/png'
    ].indexOf(mime));
  }

  validate(expected, actual) {
    const expectedFieldNames = Object.keys(expected);
    return Promise
      .all(expectedFieldNames.map(fieldName => {
        const fieldValue = actual[fieldName];
        const validateFunc = expected[fieldName].validateFunc || expected[fieldName];
        const optional = !!expected[fieldName].optional;
        return this._validateField(fieldName, fieldValue, validateFunc, optional);
      }))
      .then(results => {
        let fields = {};
        results.forEach((result, idx) => !result
          ? fields[expectedFieldNames[idx]] = `INVALID_${StringUtils.camelToSnake(expectedFieldNames[idx]).toUpperCase()}`
          : null);
        return {
          isValid: results.every(result => result === true),
          fields: fields
        };
      });
  }

  _validateField(fieldName, fieldValue, validateFunc, optional) {
    if (optional && fieldValue == null)
      return true;
    return validateFunc.call(Validator, fieldValue);
  }
}

module.exports = Validator;
