const Model = require('./abstract/Model');
const AppContext = require('../utils/AppContext');


class AdminSessionModel extends Model {

  get _fields() {
    return [
      'id',
      'adminUsername',
      'deleted',
      'createdAt',
      'modifiedAt'
    ];
  }

  insert() {
    const query =
      'INSERT INTO admin_session (' +
      '  id,' +
      '  admin_username,' +
      '  deleted,' +
      '  created_at,' +
      '  modified_at' +
      ') VALUES (' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  toTimestamp(now()),' +
      '  toTimestamp(now())' +
      ');';

    const args = [
      this.getId(),
      this.getAdminUsername(),
      false
    ];

    return AppContext.instance().getCassandra().execute(query, args);
  }

  static selectOne(adminUsername) {
    const query =
      'SELECT * FROM admin_session' +
      '  WHERE admin_username = ?' +
      '  LIMIT 1;';

    const args = [
      adminUsername
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result, true));
  }
}

module.exports = AdminSessionModel;
