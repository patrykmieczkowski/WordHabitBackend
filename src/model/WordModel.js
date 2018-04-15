const Model = require('./abstract/Model');
const AppContext = require('../utils/AppContext');


class WordModel extends Model {

  get _fields() {
    return [
      'id',
      'primaryLang',
      'secondaryLang',
      'environment',
      'primaryLangWord',
      'primaryLangDescription',
      'secondaryLangWord',
      'secondaryLangDescription',
      'imageUrl',
      'executed',
      'executeAt',
      'deleted',
      'createdAt',
      'modifiedAt'
    ];
  }

  static selectAll() {
    const query =
      'SELECT * FROM word' +
      '  ALLOW FILTERING;';

    const args = [
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result));
  }

  static selectAllForExecution() {
    const query =
      'SELECT * FROM word' +
      '  WHERE execute_at < toTimestamp(now())' +
      '    AND executed = ?' +
      '  ALLOW FILTERING;';

    const args = [
      false
    ];

    return AppContext.instance().getCassandra().execute(query, args)
      .then(result => this.parseResult(result));
  }

  static deleteOne(id) {
    const query =
      'UPDATE word' +
      '  SET deleted = ?,' +
      '      modified_at = toTimestamp(now())' +
      '  WHERE id = ?;';

    const args = [
      true,
      id.toString()
    ];

    return AppContext.instance().getCassandra().execute(query, args);
  }

  serialize() {
    let serializedObj = Model.prototype.serialize.call(this);
    serializedObj.executeAt = serializedObj.executeAt && serializedObj.executeAt.getTime();
    return serializedObj;
  }

  insert() {
    const query =
      'INSERT INTO word (' +
      '  id,' +
      '  primary_lang,' +
      '  secondary_lang,' +
      '  environment,' +
      '  primary_lang_word,' +
      '  primary_lang_description,' +
      '  secondary_lang_word,' +
      '  secondary_lang_description,' +
      '  image_url,' +
      '  executed,' +
      '  execute_at,' +
      '  deleted,' +
      '  created_at,' +
      '  modified_at' +
      ') VALUES (' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  ?,' +
      '  toTimestamp(now()),' +
      '  toTimestamp(now())' +
      ');';

    const args = [
      this.getId(),
      this.getPrimaryLang(),
      this.getSecondaryLang(),
      this.getEnvironment(),
      this.getPrimaryLangWord(),
      this.getPrimaryLangDescription(),
      this.getSecondaryLangWord(),
      this.getSecondaryLangDescription(),
      this.getImageUrl(),
      this.getExecuted(),
      this.getExecuteAt(),
      false
    ];

    return AppContext.instance().getCassandra().execute(query, args);
  }

  markAsExecuted() {
    const query =
      'UPDATE word' +
      '  SET executed = ?,' +
      '      modified_at = toTimestamp(now())' +
      '  WHERE id = ?;';

    const args = [
      true,
      this.getId().toString()
    ];

    return AppContext.instance().getCassandra().execute(query, args);
  }

  getFullImageUrl() {
    const imageUrl = this.getImageUrl();

    if (!imageUrl)
      return null;

    else if (/^https?:\/\//.test(imageUrl))
      return imageUrl;

    else
      return `${AppContext.instance().getAddress().getMediaUrl()}/${imageUrl}`;
  }
}

module.exports = WordModel;
