-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE entries (
  id             UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  free_text      TEXT        NOT NULL,
  meta_questions JSONB       DEFAULT '[]'::jsonb,
  ai_insights    JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-user queries ordered by recency
CREATE INDEX entries_user_id_created_at_idx ON entries (user_id, created_at DESC);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own entries"
  ON entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
