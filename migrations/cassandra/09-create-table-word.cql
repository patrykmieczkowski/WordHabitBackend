CREATE TABLE word_habit.word (
  id                         UUID,
  primary_lang               TEXT,
  secondary_lang             TEXT,
  difficulty                 TEXT,
  environment                TEXT,
  primary_lang_word          TEXT,
  primary_lang_description   TEXT,
  secondary_lang_word        TEXT,
  secondary_lang_description TEXT,
  image_url                  TEXT,
  executed                   BOOLEAN,
  execute_at                 TIMESTAMP,
  deleted                    BOOLEAN,
  created_at                 TIMESTAMP,
  modified_at                TIMESTAMP,
  PRIMARY KEY (id)
);
