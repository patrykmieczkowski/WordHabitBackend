MIGRATION="$1"
node -e "
  const cassandraDriver = require('cassandra-driver');
  const config = require('../config.json');


  console.info('Migrating...');

  const cassandraConfig = config.database.cassandra;
  const PlainTextAuthProvider = cassandraDriver.auth.PlainTextAuthProvider;
  const client = new cassandraDriver.Client({
    contactPoints: [cassandraConfig.host],
    authProvider: new PlainTextAuthProvider('cassandra', 'cassandra'),
    keyspace: 'word_habit'
  });

  const query = fs.readFileSync(\`$MIGRATION\`.trim(), 'utf-8');

  client.execute(query, [])
    .then(result => {
      console.info('Migration successful');
      process.exit();
    })
    .catch(err => {
      console.error(\`An error occurred during migration: \${err}\`);
      process.exit(1);
    });
"
