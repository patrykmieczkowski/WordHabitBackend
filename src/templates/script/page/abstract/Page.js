import Router from '../../utils/Router';


export default class Page {

  static get Context() {
    return {
      ROUTER: 'router',
      AJAX: 'ajax',
      HTML_UTILS: 'htmlUtils',
      DATE_UTILS: 'dateUtils'
    };
  }

  static get _DROPDOWN_ICON() {
    return (
      '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0 0h24v24H0z" fill="none"/>' +
        '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>' +
      '</svg>'
    );
  }

  static get _HEADER_CLASS_NAME() {
    return 'wh-header';
  }

  static get _LOGO_CLASS_NAME() {
    return 'wh-logo';
  }

  static get _NAVLINK_CLASS_NAME() {
    return 'wh-navlink';
  }

  constructor() {
    this._context = {};
  }

  setContext(context) {
    this._context = context;
    return this;
  }

  getContext() {
    return this._context;
  }

  init() {
    this.initLogo();
    this.initHeaderNavlinks();
  }

  initLogo() {
    const router = this.getContext()[Page.Context.ROUTER];
    const header = document.getElementsByClassName(Page._HEADER_CLASS_NAME)[0];
    const logo = header.getElementsByClassName(Page._LOGO_CLASS_NAME)[0];

    logo.onclick = e => {
      switch (router.getCurrentPage()) {
        case Router.Page.LOGIN:
          router.goToPage(Router.Page.LOGIN);
          break;
        case Router.Page.DASHBOARD:
        case Router.Page.WORD:
        case Router.Page.TOPIC:
          router.goToPage(Router.Page.DASHBOARD);
          break;
        default:
          break;
      }
    };
  }

  initHeaderNavlinks() {
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const header = document.getElementsByClassName(Page._HEADER_CLASS_NAME)[0];
    const navlinks = htmlUtils.collectionToArray(
      header.getElementsByClassName(Page._NAVLINK_CLASS_NAME));

    if (!navlinks.length)
      return;

    if (window.innerWidth > 768)
      return;

    const parent = navlinks[0].parentElement;

    const dropdown = document.createElement('span');
    dropdown.className = 'wh-dropdown';
    dropdown.innerHTML = Page._DROPDOWN_ICON;

    const dropdownNavlinks = document.createElement('div');
    dropdownNavlinks.className = 'wh-dropdown-navlinks';
    dropdown.appendChild(dropdownNavlinks);

    let clonedNavlinks = navlinks.map(navlink => navlink.cloneNode(true));
    clonedNavlinks.forEach((navlink, idx) => {
      dropdownNavlinks.appendChild(navlink);
      parent.removeChild(navlinks[idx]);
    });

    document.body.onclick = e => /(^| )active( |$)/.test(dropdown.className)
      ? dropdown.className = dropdown.className.replace(/(^| )active( |$)/, '')
      : null;

    dropdown.onclick = e => {
      e.stopPropagation();
      /(^| )active( |$)/.test(dropdown.className)
        ? dropdown.className = dropdown.className.replace(/(^| )active( |$)/, '')
        : dropdown.className += ' active';
    };

    parent.appendChild(dropdown);
  }
}
