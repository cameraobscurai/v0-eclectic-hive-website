-- Product variants table (individual SKUs, sizes, pieces)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Identity (from RMS)
  rms_id INTEGER UNIQUE,
  sku TEXT,
  
  -- Variant Info
  name TEXT NOT NULL,
  variant_type TEXT,
  variant_value TEXT,
  
  -- Dimensions (parsed)
  width_inches DECIMAL,
  depth_inches DECIMAL,
  height_inches DECIMAL,
  dims_display TEXT,
  
  -- Inventory
  stock_count INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'available',
  
  -- Image (optional - inherits from parent if null)
  image_url TEXT,
  
  -- Original data (for re-sync)
  original_name TEXT,
  original_image_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_rms ON product_variants(rms_id);
CREATE INDEX IF NOT EXISTS idx_variants_active ON product_variants(is_active);

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access for active variants
CREATE POLICY "variants_public_read" ON product_variants
  FOR SELECT USING (is_active = TRUE);

-- Authenticated users can manage variants
CREATE POLICY "variants_auth_all" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');
