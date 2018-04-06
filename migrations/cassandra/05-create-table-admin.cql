CREATE TABLE word_habit.admin (
  username    TEXT,
  password    TEXT,
  deleted     BOOLEAN,
  created_at  TIMESTAMP,
  modified_at TIMESTAMP,
  PRIMARY KEY (username)
);
