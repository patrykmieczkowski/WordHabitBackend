export default class HtmlUtils {

  collectionToArray(collection) {
    return Array.prototype.slice.call(collection || []);
  }

  hasClassName(element, className) {
    return !!~element.className.indexOf(className);
  }

  addClassName(element, className) {
    if (!this.hasClassName(element, className))
      element.className += ` ${className}`;
    return element;
  }

  removeClassName(element, className) {
    element.className =
      element.className.replace(new RegExp(`(^| )${className}( |$)`, 'g'), '');
    return element;
  }
}
