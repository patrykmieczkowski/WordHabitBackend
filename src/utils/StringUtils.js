class StringUtils {

  static capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }

  static uncapitalize(str) {
    return `${str.charAt(0).toLowerCase()}${str.slice(1)}`;
  }

  static camelToSnake(str) {
    return str.match(/(([A-Z]|^)[a-z]*|[0-9]+)/g)
      .map(part => this.uncapitalize(part))
      .join('_');
  }

  static snakeToCamel(str) {
    return str.split('_')
      .map((part, idx) => idx === 0 ? part : this.capitalize(part))
      .join('');
  }
}

module.exports = StringUtils;
