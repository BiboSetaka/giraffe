-- Run this once against your Vercel Postgres database.
-- Easiest way: Vercel dashboard → Storage → your Postgres database → Query tab → paste and run.

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  tag         TEXT NOT NULL DEFAULT 'Tops',      -- Tops / Outerwear / Collab / etc.
  price       NUMERIC(10,2) NOT NULL DEFAULT 0,
  images      TEXT[] NOT NULL DEFAULT '{}',       -- array of Blob URLs, first = thumbnail
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_tag_idx ON products (tag);
