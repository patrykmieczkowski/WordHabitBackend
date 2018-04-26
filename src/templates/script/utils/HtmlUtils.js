export default class HtmlUtils {

  collectionToArray(collection) {
    return Array.prototype.slice.call(collection || []);
  }

  replaceBreakLinesWith(htmlString, replaceString) {
    return htmlString.replace(/<br( ?\/)?>/g, replaceString);
  }
}
