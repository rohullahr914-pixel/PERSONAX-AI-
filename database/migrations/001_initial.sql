CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  name varchar(120) NOT NULL,
  email varchar(320) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  language varchar(10) NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name varchar(120),
  bio varchar(500),
  avatar_data_url text,
  profile_visibility varchar(10) NOT NULL DEFAULT 'Public' CHECK (profile_visibility IN ('Public', 'Private')),
  quote varchar(500),
  quote_visibility varchar(10) NOT NULL DEFAULT 'Public' CHECK (quote_visibility IN ('Public', 'Private')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorite_personas (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  persona_slug varchar(160) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, persona_slug)
);

CREATE TABLE IF NOT EXISTS liked_messages (
  id varchar(255) NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  persona_name varchar(160) NOT NULL,
  persona_slug varchar(160),
  content text NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, id)
);

CREATE INDEX IF NOT EXISTS liked_messages_user_saved_idx ON liked_messages(user_id, saved_at DESC);

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type varchar(40) NOT NULL CHECK (event_type IN ('page_view', 'login', 'signup')),
  path varchar(500) NOT NULL,
  country varchar(120) NOT NULL DEFAULT 'Unknown',
  device varchar(40) NOT NULL DEFAULT 'Unknown',
  browser varchar(80) NOT NULL DEFAULT 'Unknown',
  referrer varchar(500),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_type_path_idx ON analytics_events(event_type, path);
CREATE INDEX IF NOT EXISTS analytics_events_country_idx ON analytics_events(country);

CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
