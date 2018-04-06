USERNAME="$1"
PASSWORD="$2"
node -e "
  const bcrypt = require('bcrypt');
  const cassandraDriver = require('cassandra-driver');
  const config = require('../config.json');


  console.info('Creating new admin...');

  const username = \`$USERNAME\`.trim();
  const password = \`$PASSWORD\`.trim();

  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  const cassandraConfig = config.database.cassandra;
  const PlainTextAuthProvider = cassandraDriver.auth.PlainTextAuthProvider;
  const client = new cassandraDriver.Client({
    contactPoints: [cassandraConfig.host],
    authProvider: new PlainTextAuthProvider(cassandraConfig.user, cassandraConfig.password),
    keyspace: 'word_habit'
  });

  const query = \`
    INSERT INTO admin (username, password, deleted, created_at, modified_at)
      VALUES (?, ?, ?, toTimestamp(now()), toTimestamp(now()));
  \`;

  client.execute(query, [username, hash, false])
    .then(result => {
      console.info('New admin successfully created');
      process.exit();
    })
    .catch(err => {
      console.error(\`An error occurred during new admin creation: \${err}\`);
      process.exit(1);
    });
"
