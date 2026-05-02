# Schema and Environment

## Database Tables

### products
Primary product table.
```
id (uuid, PK)
name (text)
category (text) - canonical key: seating, tables, lighting, etc.
item_type (text) - subcategory
item_root (text) - first word of name, uppercase
description (text)
price (numeric)
is_active (boolean)
primary_image_url (text)
primary_image_path (text)
image_match_status (text) - matched_csv_safe, needs_manual_assignment, no_candidate, conflict
image_match_confidence (numeric)
image_match_reason (text)
image_group_key (text)
assigned_image_path (text)
assigned_image_source (text)
image_review_required (boolean)
image_review_notes (text)
category_key (text)
created_at (timestamptz)
updated_at (timestamptz)
```

### product_variants
Variant-level data (size, color, stock).
```
id (uuid, PK)
product_id (uuid, FK -> products.id)
rms_id (integer) - external RMS system ID
name (text)
stock_count (integer)
original_image_url (text) - RMS S3 URL
source_image_filename (text) - extracted filename from CSV
image_group_key (text)
match_method (text)
match_confidence (numeric)
created_at (timestamptz)
```

### product_images
Multi-image support per product.
```
id (uuid, PK)
product_id (uuid, FK)
image_url (text)
image_path (text)
display_order (integer)
is_primary (boolean)
image_group_key (text)
match_method (text)
match_confidence (numeric)
created_at (timestamptz)
```

### inquiries
Customer inquiry submissions.
```
id (uuid, PK)
name (text)
email (text)
phone (text)
company (text)
event_type (text)
event_date (date)
guest_count (integer)
message (text)
products (jsonb) - selected product IDs
status (text)
created_at (timestamptz)
```

### categories
Category definitions.
```
id (uuid, PK)
name (text) - display name
key (text) - canonical key
display_order (integer)
is_active (boolean)
```

---

## Storage Buckets

### inventory (public)
Product images organized by category folder.
- SEATING/
- TABLES/
- LIGHTING/
- TABLEWARE/
- etc.

### fonts (private)
Brand fonts (Saol Display .otf files).
- Accessed via `/api/fonts/[name]` route

---

## Environment Variables

### Required
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Optional
```
NEXT_PUBLIC_SITE_URL
```

**Note:** Do not export actual values. These are key names only.

---

## Versions

```json
{
  "next": "16.2.0",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "tailwindcss": "^4.2.0",
  "@supabase/supabase-js": "^2.103.3",
  "@supabase/ssr": "^0.10.2",
  "framer-motion": "^12.38.0",
  "typescript": "5.7.3"
}
```

---

## Commands

```bash
# Package manager
pnpm

# Development
pnpm dev

# Build
pnpm build

# Start
pnpm start

# Lint
pnpm lint
```

---

## Vercel Deployment Notes

- Framework preset: Next.js
- Build command: `pnpm build`
- Output directory: `.next`
- Node version: 20.x
- Install command: `pnpm install`
