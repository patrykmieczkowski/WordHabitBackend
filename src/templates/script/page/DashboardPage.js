import Loader from '../component/Loader';
import Popup from '../component/Popup';
import Page from './abstract/Page';


export default class DashboardPage extends Page {

  static get _WORD_LIST_ID() {
    return 'wordList';
  }

  static get _DELETE_WORD_BUTTON_CLASS() {
    return 'deleteWordButton';
  }

  static get _REPLACE_BREAK_LINES_WITH_STRING() {
    return ' / ';
  }

  static get _ALERT_CLASS() {
    return 'wh-alert';
  }

  init() {
    super.init();
    this.initExecuteAtCells();
    this.initDeleteWordButtons();
  }

  initExecuteAtCells() {
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const dateUtils = this.getContext()[Page.Context.DATE_UTILS];
    const wordList = document.getElementById(DashboardPage._WORD_LIST_ID);
    const wordListCells = htmlUtils.collectionToArray(
      wordList.getElementsByTagName('td'));

    wordListCells
      .filter((elem, idx) => idx % 5 === 3)
      .forEach(elem => {
        const date = new Date(parseInt(elem.innerHTML));
        elem.innerHTML =
          `${dateUtils.getDayOfTheWeek(date.getDay())} ${dateUtils.getMonth(date.getMonth())} ` +
          `${dateUtils.padZeros(date.getDate(), 2)} ${dateUtils.padZeros(date.getFullYear(), 4)} ` +
          `${dateUtils.padZeros(date.getHours(), 2)}:${dateUtils.padZeros(date.getMinutes(), 2)}:${dateUtils.padZeros(date.getSeconds(), 2)}`;
      });
  }

  initDeleteWordButtons() {
    const ajax = this.getContext()[Page.Context.AJAX];
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const deleteWordButtons = htmlUtils.collectionToArray(
      document.getElementsByClassName(DashboardPage._DELETE_WORD_BUTTON_CLASS));
    const alertMessage = htmlUtils
      .collectionToArray(document.body.getElementsByClassName(DashboardPage._ALERT_CLASS))
      .shift();

    deleteWordButtons
      .forEach(deleteWordButton => {
        deleteWordButton.onclick = e => {
          const wordsRaw = e.target
            .parentElement
            .previousElementSibling
            .previousElementSibling
            .previousElementSibling
            .innerHTML;
          const words = htmlUtils.replaceBreakLinesWith(
            wordsRaw, DashboardPage._REPLACE_BREAK_LINES_WITH_STRING);

          const popupType = Popup.Type.CONFIRMATION;
          const popupTitle = 'Remove word';
          const popupContent = `Are you sure you want to remove the word <strong>${words}</strong>?`;
          const popupYesHandler = () => {
            const loader = new Loader(document.body);
            const wordId = e.target.previousElementSibling.value;
            ajax.DELETE(`/panel/word/${wordId}`)
              .then(() => location.reload())
              .catch(response => {
                alertMessage.innerHTML = response && response.error;
                loader.finish();
              });
          };

          new Popup(popupType, popupTitle, popupContent, popupYesHandler);
          e.target.blur();
        };
      });
  }
}
