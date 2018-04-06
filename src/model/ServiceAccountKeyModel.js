const Model = require('./abstract/Model');
const AppContext = require('../utils/AppContext');


class ServiceAccountKeyModel extends Model {

  get _fields() {
    return [
      'id',
      'value',
      'databaseUrl',
      'deleted',
      'createdAt',
      'modifiedAt'
    ];
  }

  static select() {
    const query =
      'SELECT * FROM service_account_key' +
      '  LIMIT 1' +
      '  ALLOW FILTERING;';

    const args = [
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result, true));
  }
}

module.exports = ServiceAccountKeyModel;
