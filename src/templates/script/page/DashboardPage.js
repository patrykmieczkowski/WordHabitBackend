import Loader from '../component/Loader';
import Popup from '../component/Popup';
import Page from './abstract/Page';


export default class DashboardPage extends Page {

  static get _WORD_LIST_TOPIC_LIST_SWITCH_ID() {
    return 'wordListTopicListSwitch';
  }

  static get _SWITCH_OPTION_CLASS_NAME() {
    return 'wh-switch-option';
  }

  static get _SWITCH_OPTION_ACTIVE_CLASS_NAME() {
    return 'wh-switch-option-active';
  }

  static get _SwitchOption() {
    return {
      WORD: 'WORD',
      TOPIC: 'TOPIC'
    };
  }

  static get _HIDDEN_CLASS_NAME() {
    return 'wh-hidden';
  }

  static get _WORD_LIST_ID() {
    return 'wordList';
  }

  static get _TOPIC_LIST_ID() {
    return 'topicList';
  }

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
    this.initWordListTopicListSwitch();
    this.initWordDetailsButtons();
    this.initDeleteWordButtons();
  }

  initWordListTopicListSwitch() {
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const wordList = document.getElementById(DashboardPage._WORD_LIST_ID);
    const topicList = document.getElementById(DashboardPage._TOPIC_LIST_ID);
    const wordListTopicListSwitch =
      document.getElementById(DashboardPage._WORD_LIST_TOPIC_LIST_SWITCH_ID);
    const switchOptions = htmlUtils.collectionToArray(
      wordListTopicListSwitch.getElementsByClassName(DashboardPage._SWITCH_OPTION_CLASS_NAME));

    switchOptions.forEach(switchOption =>
      switchOption.onclick = e => {
        e.target.blur();
        switchOptions.forEach(opt => htmlUtils.removeClassName(opt, DashboardPage._SWITCH_OPTION_ACTIVE_CLASS_NAME));
        htmlUtils.addClassName(e.currentTarget, DashboardPage._SWITCH_OPTION_ACTIVE_CLASS_NAME);
        const activateList = e.currentTarget.dataset.list;
        switch (activateList) {
          case DashboardPage._SwitchOption.WORD:
            htmlUtils.addClassName(topicList, DashboardPage._HIDDEN_CLASS_NAME);
            htmlUtils.removeClassName(wordList, DashboardPage._HIDDEN_CLASS_NAME);
            break;
          case DashboardPage._SwitchOption.TOPIC:
            htmlUtils.addClassName(wordList, DashboardPage._HIDDEN_CLASS_NAME);
            htmlUtils.removeClassName(topicList, DashboardPage._HIDDEN_CLASS_NAME);
            break;
          default:
            break;
        }
      });
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
            `<div class="label">Difficulty:</div>` +
            `<strong>${details.difficulty}</strong>` +
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
            `${details.imageUrl ? `<img src="${details.imageUrl}" />` : '<strong>No image</strong>'}`;

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
