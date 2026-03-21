-- Adiciona tipo 'stats' à constraint de seções
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
ALTER TABLE sections ADD CONSTRAINT sections_type_check
  CHECK (type IN (
    'hero', 'about', 'services', 'cta', 'testimonials', 'contact',
    'faq', 'blog', 'gallery', 'events', 'stats'
  ));
