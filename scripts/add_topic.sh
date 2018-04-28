NAME="$1"
PRIMARY_LANG="$2"
SECONDARY_LANG="$3"
DIFFICULTY="$4"
ENVIRONMENT="$5"
node -e "
  const cassandraDriver = require('cassandra-driver');
  const config = require('../config.json');


  console.info('Adding topic...');

  const name = \`$NAME\`.trim();
  const primaryLang = \`$PRIMARY_LANG\`.trim();
  const secondaryLang = \`$SECONDARY_LANG\`.trim();
  const difficulty = \`$DIFFICULTY\`.trim();
  const environment = \`$ENVIRONMENT\`.trim();

  const cassandraConfig = config.database.cassandra;
  const PlainTextAuthProvider = cassandraDriver.auth.PlainTextAuthProvider;
  const client = new cassandraDriver.Client({
    contactPoints: [cassandraConfig.host],
    authProvider: new PlainTextAuthProvider(cassandraConfig.user, cassandraConfig.password),
    keyspace: 'word_habit'
  });

  const query = \`
    INSERT INTO topic (name, primary_lang, secondary_lang, difficulty, environment, deleted, created_at, modified_at)
      VALUES (?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()));
  \`;

  client.execute(query, [name, primaryLang, secondaryLang, difficulty, environment, false])
    .then(result => {
      console.info('Topic successfully added');
      process.exit();
    })
    .catch(err => {
      console.error(\`An error occurred during topic addition: \${err}\`);
      process.exit(1);
    });
"
