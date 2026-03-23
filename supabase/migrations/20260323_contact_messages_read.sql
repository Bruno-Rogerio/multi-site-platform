-- Adds a read flag to contact_messages so the client admin
-- can track which form submissions have been seen.

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS read BOOLEAN NOT NULL DEFAULT false;

-- Partial index for fast unread count queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_site_unread
  ON contact_messages (site_id)
  WHERE NOT read;
