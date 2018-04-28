import Component from './abstract/Component';


export default class Popup extends Component {

  static get Type() {
    return {
      CONFIRMATION: 'confirmation',
      ERROR: 'error',
      INFORMATION: 'information'
    }
  }

  static get _CLASS_NAME() {
    return 'wh-popup';
  }

  static get _CONFIRMATION_TEMPLATE() {
    return (
      '<div class="{{className}} {{className}}-confirmation">' +
        '<div class="{{className}}-title">' +
          '<h2 class="{{className}}-title-text">{{title}}</h2>' +
        '</div>' +
        '<div class="{{className}}-content">' +
          '<p class="{{className}}-content-text">{{content}}</p>' +
        '</div>' +
        '<div class="{{className}}-buttons">' +
          '<button class="{{className}}-buttons-yes wh-button">Yes</button>' +
          '<button class="{{className}}-buttons-no wh-button wh-button-secondary">No</button>' +
        '</div>' +
      '</div>'
    );
  }

  static get _ERROR_TEMPLATE() {
    return (
      '<div class="{{className}} {{className}}-error">' +
        '<div class="{{className}}-title">' +
          '<h2 class="{{className}}-title-text">{{title}}</h2>' +
        '</div>' +
        '<div class="{{className}}-content">' +
          '<p class="{{className}}-content-text">{{content}}</p>' +
        '</div>' +
        '<div class="{{className}}-buttons">' +
          '<button class="{{className}}-buttons-ok wh-button wh-button-secondary">OK</button>' +
        '</div>' +
      '</div>'
    );
  }

  static get _INFORMATION_TEMPLATE() {
    return (
      '<div class="{{className}} {{className}}-information">' +
        '<div class="{{className}}-title">' +
          '<h2 class="{{className}}-title-text">{{title}}</h2>' +
        '</div>' +
        '<div class="{{className}}-content">{{content}}</div>' +
        '<div class="{{className}}-buttons">' +
          '<button class="{{className}}-buttons-ok wh-button">OK</button>' +
        '</div>' +
      '</div>'
    );
  }

  constructor(type, title, content, yesHandler, noHandler, additionalClassName) {
    super();
    this._title = title;
    this._content = content;
    this._yesHandler = yesHandler || Function.prototype;
    this._noHandler = noHandler || Function.prototype;
    this._additionalClassName = additionalClassName || '';

    this._wrapper = null;

    switch (type) {
      case Popup.Type.CONFIRMATION:
        this._showConfirmation();
        break;
      case Popup.Type.ERROR:
        this._showError();
        break;
      case Popup.Type.INFORMATION:
        this._showInformation();
        break;
      default:
        break;
    }
  }

  _showConfirmation() {
    const template = Popup._CONFIRMATION_TEMPLATE;
    const interpolatedTemplate = this._interpolateTemplate(template, {
      className: Popup._CLASS_NAME,
      title: this._title,
      content: this._content
    });

    this._mount(interpolatedTemplate);
    this._addButtonHandler('yes', this._yesHandler);
    this._addButtonHandler('no', this._noHandler);
  }

  _showError() {
    const template = Popup._ERROR_TEMPLATE;
    const interpolatedTemplate = this._interpolateTemplate(template, {
      className: Popup._CLASS_NAME,
      title: this._title,
      content: this._content
    });

    this._mount(interpolatedTemplate);
    this._addButtonHandler('ok', this._yesHandler);
  }

  _showInformation() {
    const template = Popup._INFORMATION_TEMPLATE;
    const interpolatedTemplate = this._interpolateTemplate(template, {
      className: Popup._CLASS_NAME,
      title: this._title,
      content: this._content
    });

    this._mount(interpolatedTemplate);
    this._addButtonHandler('ok', this._yesHandler);
  }

  _mount(interpolatedTemplate) {
    this._wrapper = document.createElement('div');
    this._wrapper.className = `${Popup._CLASS_NAME}-wrapper`;
    this._wrapper.className += this._additionalClassName ? ` ${this._additionalClassName}` : '';
    this._wrapper.innerHTML = '<div class="wh-popup-aligner"></div>' + interpolatedTemplate;
    this._wrapper.onclick = e => e.target === this._wrapper
      ? this._unmount()
      : null;

    document.body.appendChild(this._wrapper);
    this._waitForStyle(this._wrapper, 'opacity');
    setTimeout(() => this._wrapper.className += ' fade-in', 0);
  }

  _unmount() {
    this._wrapper.className.replace(/(^| )fade-in( |$)/, '');
    this._wrapper.className += ' fade-out';
    setTimeout(() => document.body.removeChild(this._wrapper), 250);
  }

  _addButtonHandler(buttonType, handler) {
    const button = this._wrapper
      .getElementsByClassName(`${Popup._CLASS_NAME}-buttons-${buttonType}`)[0];

    button.onclick = e => {
      this._unmount();
      handler();
    };
  }
}
