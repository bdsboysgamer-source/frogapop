-- Frogapop leaderboard schema (D1 / SQLite).
-- The API creates these automatically; provided here for manual setup.
CREATE TABLE IF NOT EXISTS users (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT UNIQUE,
  token   TEXT UNIQUE,
  created INTEGER
);

CREATE TABLE IF NOT EXISTS scores (
  user_id INTEGER,
  key     TEXT,
  score   INTEGER,
  updated INTEGER,
  PRIMARY KEY (user_id, key)
);

CREATE INDEX IF NOT EXISTS idx_scores_key ON scores(key, score DESC);
