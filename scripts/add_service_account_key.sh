SERVICE_ACCOUNT_KEY_PATH="$1"
DATABASE_URL="$2"
node -e "
  const fs = require('fs');
  const uuidv4 = require('uuid/v4');
  const cassandraDriver = require('cassandra-driver');
  const config = require('../config.json');


  console.info('Adding service account key...');

  const id = uuidv4();

  const value = JSON.stringify(JSON.parse(fs.readFileSync(\`$SERVICE_ACCOUNT_KEY_PATH\`.trim(), 'utf-8')));
  const databaseUrl = \`$DATABASE_URL\`.trim();

  const cassandraConfig = config.database.cassandra;
  const PlainTextAuthProvider = cassandraDriver.auth.PlainTextAuthProvider;
  const client = new cassandraDriver.Client({
    contactPoints: [cassandraConfig.host],
    authProvider: new PlainTextAuthProvider(cassandraConfig.user, cassandraConfig.password),
    keyspace: 'word_habit'
  });

  const query = \`
    INSERT INTO service_account_key (id, value, database_url, deleted, created_at, modified_at)
      VALUES (?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()));
  \`;

  client.execute(query, [id, value, databaseUrl, false])
    .then(result => {
      console.info('Service account key successfully added');
      process.exit();
    })
    .catch(err => {
      console.error(\`An error occurred during service account key addition: \${err}\`);
      process.exit(1);
    });
"
