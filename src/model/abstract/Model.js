const StringUtils = require('../../utils/StringUtils');


class Model {

  get _fields() {
    return [];
  }

  constructor(obj = null) {
    this._fields.forEach(field => {
      this[`_${field}`] = obj && (obj[field] || obj[StringUtils.camelToSnake(field)]);
      this._defineGetter(field);
      this._defineSetter(field);
    });
  }

  static parseResult(result, single) {
    let res;

    if (result.rows && result.rows.length)
      res = result.rows
        .map(row => new this(row))
        .filter(model => !model.getDeleted());

    return (res && res.length) ? (single ? res[0] : res) : null;
  }

  serialize() {
    let obj = {};
    this._fields.forEach(field =>
      obj[field] = this[`get${StringUtils.capitalize(field)}`]());
    return obj;
  }

  _defineGetter(field) {
    this[`get${StringUtils.capitalize(field)}`] = function () {
      return this[`_${field}`];
    };
  }

  _defineSetter(field) {
    this[`set${StringUtils.capitalize(field)}`] = function (value) {
      this[`_${field}`] = value;
    };
  }
}

module.exports = Model;
