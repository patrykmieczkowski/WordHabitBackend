class Model {

  get _fields() {
    return [];
  }

  constructor(obj = null) {
    this._fields.forEach(field => {
      this[`_${field}`] = obj && (obj[field] || obj[this._camelToSnake(field)]);
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
      obj[field] = this[`get${this._capitalize(field)}`]());
    return obj;
  }

  _defineGetter(field) {
    this[`get${this._capitalize(field)}`] = function () {
      return this[`_${field}`];
    };
  }

  _defineSetter(field) {
    this[`set${this._capitalize(field)}`] = function (value) {
      this[`_${field}`] = value;
    };
  }

  _capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }

  _uncapitalize(str) {
    return `${str.charAt(0).toLowerCase()}${str.slice(1)}`;
  }

  _camelToSnake(str) {
    return str.match(/(([A-Z]|^)[a-z]*|[0-9]+)/g)
      .map(part => this._uncapitalize(part))
      .join('_');
  }

  _snakeToCamel(str) {
    return str.split('_')
      .map((part, idx) => idx === 0 ? part : this._capitalize(part))
      .join('');
  }
}

module.exports = Model;
