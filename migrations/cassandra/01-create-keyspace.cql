CREATE KEYSPACE word_habit
  WITH REPLICATION = { 
   'class': 'SimpleStrategy', 
   'replication_factor': 1 
  };
