# Production Hardening Todo

## Critical - Before Launch

- [ ] **Protect or disable `/api/import-inventory-csv`**
  - Add admin auth check or return 404

- [ ] **Protect or disable `/api/import-inventory`**
  - Migration-only, should not be accessible

- [ ] **Remove DELETE method from `/api/upload-inventory`**
  - Catastrophic if called, wipes all storage

- [ ] **Protect `/api/image-manifest` POST**
  - Applies matches without auth

- [ ] **Do not expose service-role routes without auth**
  - All service-role operations must verify user first

- [ ] **Filter unresolved products from public collection**
  - Only show `image_match_status = 'matched_csv_safe'`
  - Or implement placeholder image handling

---

## High Priority - Week 1

- [ ] **Add auth to admin routes**
  - `/api/admin/inquiries`
  - `/api/inventory-image/update`
  - `/admin` page

- [ ] **Add rate limiting to `/api/inquiry`**
  - Prevent spam submissions

- [ ] **Add cache headers to `/api/fonts/[name]`**
  - Reduce Supabase storage reads

- [ ] **Reduce storage to canonical primary images**
  - Remove angle variants (1, 2, 3)
  - Keep only angle 0 or no-suffix files
  - Then consider item_root matching

---

## Medium Priority - Post-Launch

- [ ] **Do not use exact product name = exact filename matching**
  - Current system uses normalized CSV filename
  - Item_root matching has conflicts

- [ ] **Split large admin page**
  - Currently one large component
  - Break into tabs/sections

- [ ] **Split large collection page**
  - Filter/sort logic could be separate

- [ ] **Extract hardcoded gallery data**
  - Move to CMS or database

- [ ] **Add product detail routes**
  - `/collection/[slug]` for SEO
  - Currently quick-view only

---

## Low Priority - Future

- [ ] **Verify Gallery and Atelier assets**
  - Some may be placeholder references

- [ ] **Implement proper image CDN**
  - Vercel Image Optimization
  - Or Supabase transforms

- [ ] **Add error boundaries**
  - Graceful failure for component errors

- [ ] **Add analytics events**
  - Vercel Analytics already installed
  - Add custom events for inquiries

---

## Image Matching Rules (Reference)

**DO:**
- Use CSV filename exact match (with underscore normalization)
- Only apply 1:1 matches (one product claims one file)
- Verify matches before applying

**DO NOT:**
- Use exact product name = exact filename
- Apply item_root matches with conflicts
- Auto-match without conflict detection
- Apply matches until storage is cleaned
