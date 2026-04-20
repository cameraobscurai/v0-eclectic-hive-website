-- Categories reference table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO categories (slug, name, sort_order) VALUES
  ('seating', 'Seating', 1),
  ('tables', 'Tables', 2),
  ('bars', 'Bars', 3),
  ('lighting', 'Lighting', 4),
  ('large-decor', 'Large Decor & Dividers', 5),
  ('small-decor', 'Small Decor', 6),
  ('candlelight', 'Candlelight', 7),
  ('rugs', 'Rugs', 8),
  ('pillows', 'Pillows', 9),
  ('linens', 'Linens', 10),
  ('tableware', 'Tableware', 11)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);
