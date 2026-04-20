-- Import logs table (tracks CSV imports)
CREATE TABLE IF NOT EXISTS import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Import info
  filename TEXT,
  imported_by UUID REFERENCES auth.users(id),
  
  -- Stats
  total_rows INTEGER DEFAULT 0,
  products_created INTEGER DEFAULT 0,
  products_updated INTEGER DEFAULT 0,
  variants_created INTEGER DEFAULT 0,
  variants_updated INTEGER DEFAULT 0,
  images_downloaded INTEGER DEFAULT 0,
  errors INTEGER DEFAULT 0,
  
  -- Details
  error_details JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can access logs
CREATE POLICY "logs_auth_read" ON import_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "logs_auth_insert" ON import_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "logs_auth_update" ON import_logs
  FOR UPDATE USING (auth.role() = 'authenticated');
