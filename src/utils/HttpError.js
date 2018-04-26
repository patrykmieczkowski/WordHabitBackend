class HttpError extends Error {

  static get Code() {
    return {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500
    };
  }

  static get _DefaultMessage() {
    return {
      BAD_REQUEST: 'An error occurred',
      UNAUTHORIZED: 'Invalid username or password',
      FORBIDDEN: 'Authentication failed',
      NOT_FOUND: 'Not found',
      INTERNAL_SERVER_ERROR: 'An error occurred',
      DEFAULT: 'An error occurred'
    };
  }

  constructor(code, message) {
    if (message == null || message === '') {
      switch (code) {
        case HttpError.Code.BAD_REQUEST:
          message = HttpError._DefaultMessage.BAD_REQUEST;
          break;
        case HttpError.Code.UNAUTHORIZED:
          message = HttpError._DefaultMessage.UNAUTHORIZED;
          break;
        case HttpError.Code.FORBIDDEN:
          message = HttpError._DefaultMessage.FORBIDDEN;
          break;
        case HttpError.Code.NOT_FOUND:
          message = HttpError._DefaultMessage.NOT_FOUND;
          break;
        case HttpError.Code.INTERNAL_SERVER_ERROR:
          message = HttpError._DefaultMessage.INTERNAL_SERVER_ERROR;
          break;
        default:
          message = HttpError._DefaultMessage.DEFAULT;
          break;
      }
    }

    super(message);
    this.name = 'HttpError';
    this.code = code;
  }
}

module.exports = HttpError;
