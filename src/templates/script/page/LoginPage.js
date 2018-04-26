import Router from '../utils/Router';
import Ajax from '../utils/Ajax';
import Loader from '../component/Loader';
import Page from './abstract/Page';


export default class LoginPage extends Page {

  static get _LOGIN_FORM_CLASS() {
    return 'wh-form';
  }

  static get _LOGIN_FORM_ALERT_CLASS() {
    return 'wh-alert';
  }

  init() {
    super.init();
    this.initLoginForm();
  }

  initLoginForm() {
    const router = this.getContext()[Page.Context.ROUTER];
    const ajax = this.getContext()[Page.Context.AJAX];
    const htmlUtils = this.getContext()[Page.Context.HTML_UTILS];
    const loginForm = htmlUtils
      .collectionToArray(document.getElementsByClassName(LoginPage._LOGIN_FORM_CLASS))
      .shift();
    const loginFormFields = htmlUtils
      .collectionToArray(loginForm.getElementsByTagName('input'))
      .filter(input => input.type !== 'submit');
    const loginFormAlert = htmlUtils
      .collectionToArray(loginForm.getElementsByClassName(LoginPage._LOGIN_FORM_ALERT_CLASS))
      .shift();

    loginForm.onsubmit = e => {
      e.preventDefault();

      let payload = {};
      loginFormFields.forEach(field => payload[field.name] = field.value);

      if (!Object.keys(payload).every(key => payload[key] !== '')) {
        return;
      }

      const loader = new Loader(document.body);
      ajax.POST('/panel/login', payload, Ajax.ContentType.JSON)
        .then(() => {
          loginFormAlert.innerHTML = '';
          router.goToPage(Router.Page.DASHBOARD);
        })
        .catch(response => {
          loginFormAlert.innerHTML = response && response.error;
          loader.finish();
        });
    };
  }
}
