import Component from './abstract/Component';


export default class Loader extends Component {

  static get _CLASS_NAME() {
    return 'wh-loader';
  }

  static get _TEMPLATE() {
    return (
      '<div class="{{className}}"></div>'
    );
  }

  constructor(target) {
    super();
    this._target = target;
    this._wrapper = null;
    this._show();
  }

  finish() {
    this._unmount();
  }

  _show() {
    const template = Loader._TEMPLATE;
    const interpolatedTemplate = this._interpolateTemplate(template, {
      className: Loader._CLASS_NAME
    });

    this._mount(interpolatedTemplate);
  }

  _mount(interpolatedTemplate) {
    this._wrapper = document.createElement('div');
    this._wrapper.className = `${Loader._CLASS_NAME}-wrapper`;
    this._wrapper.innerHTML = '<div class="wh-loader-aligner"></div>' + interpolatedTemplate;

    this._target.appendChild(this._wrapper);
    this._waitForStyle(this._wrapper, 'opacity');
    setTimeout(() => this._wrapper.className += ' fade-in', 0);
  }

  _unmount() {
    this._wrapper.className.replace(/(^| )fade-in( |$)/, '');
    this._wrapper.className += ' fade-out';
    setTimeout(() => this._target.removeChild(this._wrapper), 250);
  }
}
