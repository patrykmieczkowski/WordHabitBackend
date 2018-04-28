const Model = require('./abstract/Model');
const AppContext = require('../utils/AppContext');


class TopicModel extends Model {

  get _fields() {
    return [
      'name',
      'primaryLang',
      'secondaryLang',
      'difficulty',
      'environment',
      'deleted',
      'createdAt',
      'modifiedAt'
    ];
  }

  static selectOne(primaryLang, secondaryLang, difficulty, environment) {
    const query =
      'SELECT * FROM topic' +
      '  WHERE primary_lang = ? ' +
      '    AND secondary_lang = ?' +
      '    AND difficulty = ?' +
      '    AND environment = ?;';

    const args = [
      primaryLang,
      secondaryLang,
      difficulty,
      environment
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result, true));
  }

  static selectAll() {
    const query =
      'SELECT * FROM topic;';

    const args = [
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result));
  }
}

module.exports = TopicModel;
