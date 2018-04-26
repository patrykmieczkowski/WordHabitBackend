export default class Ajax {

  static get ContentType() {
    return {
      JSON: 'application/json',
      MULTIPART: 'multipart/form-data',
      URLENCODED: 'application/x-www-form-urlencoded'
    };
  }

  static get _Method() {
    return {
      POST: 'POST',
      GET: 'GET',
      PUT: 'PUT',
      DELETE: 'DELETE'
    };
  }

  static get _Header() {
    return {
      CONTENT_TYPE: 'Content-Type'
    };
  }

  POST(path, rawPayload, contentType) {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      this._addListeners(oReq, resolve, reject);

      oReq.open(Ajax._Method.POST, path);

      if (contentType !== Ajax.ContentType.MULTIPART)
        oReq.setRequestHeader(Ajax._Header.CONTENT_TYPE, contentType);

      let payload;

      switch (contentType) {
        case Ajax.ContentType.JSON:
          payload = JSON.stringify(rawPayload);
          break;
        case Ajax.ContentType.MULTIPART:
          payload = new FormData();
          Object.keys(rawPayload).forEach(key => {
            if (rawPayload[key] != null && rawPayload[key] !== '')
              payload.append(key, rawPayload[key])
          });
          break;
        case Ajax.ContentType.URLENCODED:
          payload = rawPayload;
          break;
        default:
          payload = rawPayload;
          break;
      }

      oReq.send(payload);
    });
  }

  GET() {
  }

  PUT() {
  }

  DELETE(path) {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      this._addListeners(oReq, resolve, reject);

      oReq.open(Ajax._Method.DELETE, path);
      oReq.send();
    });
  }

  _addListeners(oReq, resolve, reject) {
    oReq.addEventListener('load', e => {
      const contentType = oReq
        .getResponseHeader(Ajax._Header.CONTENT_TYPE)
        .match(/^[a-zA-Z0-9-_.+/]+/g)
        .shift();

      let body;

      switch (contentType) {
        case Ajax.ContentType.JSON:
          body = JSON.parse(oReq.responseText);
          break;
        default:
          body = oReq.responseText;
          break;
      }

      return oReq.status === 200
        ? resolve(body)
        : reject(body)
    });
    oReq.addEventListener('error', reject);
    oReq.addEventListener('abort', reject);
  }
}
