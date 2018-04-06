const Model = require('./abstract/Model');
const AppContext = require('../utils/AppContext');


class TopicModel extends Model {

  get _fields() {
    return [
      'name',
      'primaryLang',
      'secondaryLang',
      'environment',
      'deleted',
      'createdAt',
      'modifiedAt'
    ];
  }

  static selectOne(primaryLang, secondaryLang, environment) {
    const query =
      'SELECT * FROM topic' +
      '  WHERE primary_lang = ? ' +
      '    AND secondary_lang = ?' +
      '    AND environment = ?;';

    const args = [
      primaryLang,
      secondaryLang,
      environment
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result, true));
  }
}

module.exports = TopicModel;
