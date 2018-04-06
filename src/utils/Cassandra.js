const cassandraDriver = require('cassandra-driver');


class Cassandra {

  static get _KEYSPACE() {
    return 'word_habit';
  }

  constructor(host, user, password) {
    const PlainTextAuthProvider = cassandraDriver.auth.PlainTextAuthProvider;
    this._client = new cassandraDriver.Client({
      contactPoints: [host],
      authProvider: new PlainTextAuthProvider(user, password),
      keyspace: Cassandra._KEYSPACE
    });
  }

  execute(query, args) {
    return this._client.execute(query, args);
  }
}

module.exports = Cassandra;
