# Eclectic Hive - Vercel Final Package

## Current Project Status

**Build Status:** Working  
**Framework:** Next.js 16.2.0, React 19.2.4, Tailwind 4.2.0  
**Database:** Supabase (connected)  
**Package Manager:** pnpm

---

## What Is Working

- Homepage with hero, press section, new arrivals, material palette
- Atelier page with hero, space, humans, fabrication sections
- Gallery page with distorted card effects
- Collection page with product grid, filtering, quick-view modal
- Contact page with inquiry form
- FAQ page with accordion
- Process page
- Brand pages (guidelines, language, typography, visual)
- Privacy policy page
- Navigation with mobile drawer
- Footer
- Inquiry tray and flow (multi-step form)
- Products API with category/stock filtering
- Categories API
- Inquiry submission API
- Font serving API (Saol Display from Supabase storage)
- 308 products have verified images (matched_csv_safe)

---

## What Is Incomplete

- 732 products without images (70.4%)
  - 270 have CSV filename but no storage match
  - 460 have no CSV filename (no_candidate)
  - 2 have conflicts (Hudson)
- Studio page (moodboard canvas - partially built)
- Admin page (large, needs splitting)
- Import page (migration tool, not production)
- Product detail pages (no individual /collection/[slug] routes)

---

## What Is Risky

| Risk | Severity | Notes |
|------|----------|-------|
| `/api/import-inventory-csv` | HIGH | Unauthenticated, writes to DB |
| `/api/import-inventory` | HIGH | Migration-only, writes to DB |
| `/api/upload-inventory` DELETE | HIGH | Deletes all storage files |
| `/api/image-manifest` POST | MEDIUM | Applies image matches |
| Service role operations | HIGH | Must fail closed |
| Unresolved products visible | MEDIUM | Placeholders may confuse users |
| Storage inflated (~3,400 files) | LOW | Many angle variants, not cleaned |

---

## Inventory Status

| Status | Count |
|--------|-------|
| Total active products | 1,040 |
| matched_csv_safe | 308 |
| needs_manual_assignment | 270 |
| no_candidate | 460 |
| conflict | 2 |
| **Unresolved** | **732** |

**Storage:** ~3,400 files in inventory bucket (inflated by angle variants 0,1,2,3)  
**Expected canonical:** ~1,000 primary images

**DO NOT** apply item_root matches until storage is reduced to canonical primary images only.

---

## Safest Next Vercel Step

1. **Protect or disable** `/api/import-*` routes before any production traffic
2. **Hide unresolved products** from public collection (filter by `image_match_status = 'matched_csv_safe'`)
3. **Launch with 308 verified products** as MVP
4. **Clean storage** to canonical images before expanding matching
5. **Add auth protection** to admin routes

---

## Package Contents

```
migration_exports/vercel_final_package/
├── README.md                          # This file
├── 00_cleanup_report.md               # Files to preserve, risks, stale refs
├── site_manifest.md                   # All routes with status
├── content_export.md                  # Page copy preserved
├── design_system.md                   # Colors, typography, animations
├── api_security_manifest.md           # API route audit
├── schema_and_env.md                  # DB schema, env vars, versions
├── production_hardening_todo.md       # Pre-launch checklist
└── inventory_migration/               # CSVs (no modifications applied)
    ├── 01_verified_matched_csv_safe.csv
    ├── 02_unresolved_products.csv
    ├── 03_needs_manual_assignment.csv
    ├── 04_no_candidate_products.csv
    ├── 05_image_conflicts.csv
    ├── 06_unassigned_storage_files.csv
    ├── 07_item_root_candidate_dry_run.csv
    └── 08_category_resolution_summary.csv
```
