CREATE TABLE word_habit.service_account_key (
  id           UUID,
  value        TEXT,
  database_url TEXT,
  deleted      BOOLEAN,
  created_at   TIMESTAMP,
  modified_at  TIMESTAMP,
  PRIMARY KEY (id)
);
