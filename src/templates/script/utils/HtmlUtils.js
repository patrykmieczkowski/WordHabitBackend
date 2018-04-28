export default class HtmlUtils {

  collectionToArray(collection) {
    return Array.prototype.slice.call(collection || []);
  }
}
