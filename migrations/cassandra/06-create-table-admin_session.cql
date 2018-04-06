CREATE TABLE word_habit.admin_session (
  id             UUID,
  admin_username TEXT,
  deleted        BOOLEAN,
  created_at     TIMESTAMP,
  modified_at    TIMESTAMP,
  PRIMARY KEY (admin_username, created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);
