-- Brew / Docker Postgres schema for learning DB ops.
-- Apply with: pnpm db:migrate
--
-- Entity (TypeScript Todo) ↔ table columns (snake_case).
-- The repository maps between them — that mapping IS the "entity layer" for raw SQL.
CREATE extension IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now (),
  updated_at timestamptz NOT NULL DEFAULT now (),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS todos_completed_idx ON todos (completed);

CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos (created_at DESC);