-- Products table (parent/display items - one row = one card on website)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  -- Display
  name TEXT NOT NULL,
  description TEXT,
  
  -- Categorization
  category TEXT NOT NULL,
  sub_category TEXT,
  style_collection TEXT,
  tags TEXT[],
  
  -- Display Type: 'single', 'variants', 'custom_inquiry'
  display_type TEXT NOT NULL DEFAULT 'single',
  
  -- Visual
  primary_image_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  
  -- Notes
  staff_notes TEXT,
  public_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = TRUE);

-- Authenticated users can manage products
CREATE POLICY "products_auth_all" ON products
  FOR ALL USING (auth.role() = 'authenticated');
