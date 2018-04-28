CREATE TABLE word_habit.topic (
  name           TEXT,
  primary_lang   TEXT,
  secondary_lang TEXT,
  difficulty     TEXT,
  environment    TEXT,
  deleted        BOOLEAN,
  created_at     TIMESTAMP,
  modified_at    TIMESTAMP,
  PRIMARY KEY ((primary_lang, secondary_lang, difficulty, environment))
);
