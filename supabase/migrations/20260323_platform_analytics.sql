-- Tracks page views on the platform's own public pages
-- (landing, /quero-comecar, /premium, /login, /demo/*, etc.)

CREATE TABLE IF NOT EXISTS platform_page_views (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  path       TEXT        NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_page_views_path_visited
  ON platform_page_views (path, visited_at DESC);

CREATE INDEX IF NOT EXISTS idx_platform_page_views_visited
  ON platform_page_views (visited_at DESC);
