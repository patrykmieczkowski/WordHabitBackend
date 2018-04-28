import Loader from '../component/Loader';
import Popup from '../component/Popup';
import Page from './abstract/Page';


export default class DashboardPage extends Page {

  static get _WORD_DETAILS_BUTTON_CLASS() {
    return 'wordDetailsButton';
  }

  static get _DELETE_WORD_BUTTON_CLASS() {
    return 'deleteWordButton';
  }

  static get _ALERT_CLASS() {
    return 'wh-alert';
  }

  init() {
    super.init();
    this.initWordDetailsButtons();
    this.initDeleteWordButtons();
  }

  initWordDetailsButtons() {
    const dateUtils = this.getContext()[Page.Context.DATE_UTILS];
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const wordDetailsButtons = htmlUtils.collectionToArray(
      document.getElementsByClassName(DashboardPage._WORD_DETAILS_BUTTON_CLASS));

    wordDetailsButtons
      .forEach(wordDetailsButton => {
        wordDetailsButton.onclick = e => {
          const details = JSON.parse(
            e.currentTarget.parentElement.parentElement.dataset.details);

          const popupType = Popup.Type.INFORMATION;
          const popupTitle = 'Word details';
          const popupContent =
            `<div class="label">Environment:</div>` +
            `<strong>${details.environment}</strong>` +
            `<div class="divided">` +
              `<strong>${details.primaryLang}</strong>` +
              `<strong>${details.secondaryLang}</strong>` +
              `<strong>${details.primaryLangWord}</strong>` +
              `<strong>${details.secondaryLangWord}</strong>` +
              `<strong>${details.primaryLangDescription}</strong>` +
              `<strong>${details.secondaryLangDescription}</strong>` +
            `</div>` +
            `<div class="label">Executed:</div>` +
            `<strong>${details.executed}</strong>` +
            `<div class="label">Execute at:</div>` +
            `<strong>${dateUtils.formatDate(details.executeAt)}<br />(${dateUtils.getRangeBetween(details.executeAt, Date.now()).formattedRange})</strong>` +
            `<div class="label">Image:</div>` +
            `<img src="${details.imageUrl}" />`;

          new Popup(popupType, popupTitle, popupContent, undefined, undefined, 'wh-popup-word-details');
          e.target.blur();
        };
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
          const details = JSON.parse(
            e.currentTarget.parentElement.parentElement.dataset.details);
          const words =
            `${details.primaryLangWord} / ${details.secondaryLangWord}`;

          const popupType = Popup.Type.CONFIRMATION;
          const popupTitle = 'Remove word';
          const popupContent = `Are you sure you want to remove the word <strong>${words}</strong>?`;
          const popupYesHandler = () => {
            const loader = new Loader(document.body);
            const wordId = details.id;

            ajax.DELETE(`/panel/word/${wordId}`)
              .then(() => location.reload())
              .catch(response => {
                const errorMessage = response && response.error;
                alertMessage.innerHTML = errorMessage;
                loader.finish();
                new Popup(Popup.Type.ERROR, 'An error occurred', errorMessage);
              });
          };

          new Popup(popupType, popupTitle, popupContent, popupYesHandler);
          e.target.blur();
        };
      });
  }
}
