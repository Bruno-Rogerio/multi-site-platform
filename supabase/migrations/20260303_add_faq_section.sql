-- Add 'faq' to the allowed section types
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
ALTER TABLE sections ADD CONSTRAINT sections_type_check
  CHECK (type IN ('hero', 'about', 'services', 'cta', 'testimonials', 'contact', 'faq'));
