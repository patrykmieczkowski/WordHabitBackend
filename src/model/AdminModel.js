const Model = require('./abstract/Model');
const AppContext = require('../utils/AppContext');


class AdminModel extends Model {

  get _fields() {
    return [
      'username',
      'password',
      'deleted',
      'createdAt',
      'modifiedAt'
    ];
  }

  static selectOne(username) {
    const query =
      'SELECT * FROM admin' +
      '  WHERE username = ?;';

    const args = [
      username
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result, true));
  }
}

module.exports = AdminModel;
