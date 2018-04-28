import Ajax from '../utils/Ajax';
import Router from '../utils/Router';
import Loader from '../component/Loader';
import Popup from '../component/Popup';
import Page from './abstract/Page';


export default class WordPage extends Page {

  static get _WORD_FORM_CLASS() {
    return 'wh-form';
  }

  static get _WORD_FORM_ALERT_CLASS() {
    return 'wh-alert';
  }

  static get _TIMEZONE_OFFSET_FIELD_NAME() {
    return 'timezoneOffset';
  }

  static get _IMAGE_OPTION_RADIO_BUTTON_NAME() {
    return 'imageOption';
  }

  static get _IMAGE_URL_FIELD_ID() {
    return 'imageUrl';
  }

  static get _IMAGE_FILE_FIELD_ID() {
    return 'imageFile';
  }

  static get _ImageOption() {
    return {
      URL: 'URL',
      FILE: 'FILE',
      NONE: 'NONE'
    };
  }

  init() {
    super.init();
    this.initForm();
    this.initTimezoneOffsetField();
    this.initImageOptionRadioButtons();
  }

  initForm() {
    const router = this.getContext()[Page.Context.ROUTER];
    const ajax = this.getContext()[Page.Context.AJAX];
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const wordForm = htmlUtils
      .collectionToArray(document.getElementsByClassName(WordPage._WORD_FORM_CLASS))
      .shift();
    const wordFormFields = htmlUtils
      .collectionToArray(wordForm.getElementsByTagName('input'))
      .concat(htmlUtils
        .collectionToArray(wordForm.getElementsByTagName('textarea')))
      .concat(htmlUtils
        .collectionToArray(wordForm.getElementsByTagName('select')))
      .filter(input => input.type !== 'submit');
    const wordFormAlert = htmlUtils
      .collectionToArray(wordForm.getElementsByClassName(WordPage._WORD_FORM_ALERT_CLASS))
      .shift();

    wordForm.onsubmit = e => {
      e.preventDefault();

      let payload = {};
      wordFormFields.forEach(field => {
        let value;

        switch (field.type) {
          case 'radio':
            value = field.checked ? field.value : payload[field.name];
            break;
          case 'file':
            value = field.files[0];
            break;
          default:
            value = field.value;
            break;
        }

        payload[field.name] = value;
      });

      const loader = new Loader(document.body);
      ajax.POST('/panel/word', payload, Ajax.ContentType.MULTIPART)
        .then(() => {
          wordFormAlert.innerHTML = '';
          router.goToPage(Router.Page.DASHBOARD);
        })
        .catch(response => {
          const errorMessage = response && response.error;
          wordFormAlert.innerHTML = errorMessage;
          loader.finish();
          new Popup(Popup.Type.ERROR, 'An error occurred', errorMessage);
        });
    };
  }

  initTimezoneOffsetField() {
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const timezoneOffset = htmlUtils
      .collectionToArray(document.getElementsByName(WordPage._TIMEZONE_OFFSET_FIELD_NAME))
      .shift();

    timezoneOffset.value = (new Date()).getTimezoneOffset();
  }

  initImageOptionRadioButtons() {
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const imageOptionRadioButtons = htmlUtils.collectionToArray(
      document.getElementsByName(WordPage._IMAGE_OPTION_RADIO_BUTTON_NAME));

    imageOptionRadioButtons.forEach(imageOptionRadioButton => {
      imageOptionRadioButton.onclick = e => {
        const isUrlImageOption = e.target.value === WordPage._ImageOption.URL;
        const isFileImageOption = e.target.value === WordPage._ImageOption.FILE;
        const imageUrl = document.getElementById(WordPage._IMAGE_URL_FIELD_ID);
        const imageFile = document.getElementById(WordPage._IMAGE_FILE_FIELD_ID);
        imageUrl.disabled = !isUrlImageOption;
        imageFile.disabled = !isFileImageOption;
        imageUrl.value = '';
        imageFile.value = '';
      };
    });
  }
}
