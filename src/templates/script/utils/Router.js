export default class Router {

  static get Page() {
    return {
      LOGIN: 'login',
      DASHBOARD: 'dashboard',
      WORD: 'word',
      TOPIC: 'topic'
    };
  }

  static get _PREFIX() {
    return 'panel';
  }

  getCurrentPage() {
    let currentPathnamePart;
    const pathname = window.location.pathname;
    const pathnamePartsReversed = pathname.split('/').reverse();

    pathnamePartsReversed.every(pathnamePart => {
      if (pathnamePart !== '') {
        currentPathnamePart = pathnamePart;
        return false;
      }
    });

    return Router.Page[Object.keys(Router.Page)
      .find(pageKey => Router.Page[pageKey] === currentPathnamePart)] || '';
  }

  reloadCurrentPage() {
    window.location.reload();
  }

  goToPage(page) {
    const origin = window.location.origin;
    window.location = [origin, Router._PREFIX, page].join('/');
  }
}
