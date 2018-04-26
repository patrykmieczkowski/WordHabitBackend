import Router from './utils/Router';
import Ajax from './utils/Ajax';
import HtmlUtils from './utils/HtmlUtils';
import DateUtils from './utils/DateUtils';
import Page from './page/abstract/Page';
import LoginPage from './page/LoginPage';
import DashboardPage from './page/DashboardPage';
import WordPage from './page/WordPage';
import TopicPage from './page/TopicPage';


export default class App {

  init() {
    let page;
    const router = new Router();
    const ajax = new Ajax();
    const htmlUtils = new HtmlUtils();
    const dateUtils = new DateUtils();

    switch (router.getCurrentPage()) {
      case Router.Page.LOGIN:
        page = new LoginPage();
        break;
      case Router.Page.DASHBOARD:
        page = new DashboardPage();
        break;
      case Router.Page.WORD:
        page = new WordPage();
        break;
      case Router.Page.TOPIC:
        page = new TopicPage();
        break;
      default:
        break;
    }

    if (page)
      page.setContext({
        [Page.Context.ROUTER]: router,
        [Page.Context.AJAX]: ajax,
        [Page.Context.HTML_UTILS]: htmlUtils,
        [Page.Context.DATE_UTILS]: dateUtils
      }).init();
  }
}
