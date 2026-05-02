# Cleanup Report

## High-Value Files to Preserve

### Core Pages
- `app/page.tsx` - Homepage
- `app/layout.tsx` - Root layout
- `app/globals.css` - Design system, brand tokens
- `app/atelier/page.tsx` - Atelier showcase
- `app/gallery/page.tsx` - Gallery with effects
- `app/collection/page.tsx` - Product collection
- `app/contact/page.tsx` - Contact form
- `app/faq/page.tsx` - FAQ accordion
- `app/process/page.tsx` - Process page
- `app/privacy/page.tsx` - Privacy policy
- `app/brand/*.tsx` - Brand guideline pages

### Core Components
- `components/navigation.tsx` - Main nav with mobile drawer
- `components/footer.tsx` - Site footer
- `components/inquiry-flow.tsx` - Multi-step inquiry form
- `components/inquiry-tray.tsx` - Inquiry drawer
- `components/quick-view-modal.tsx` - Product quick view
- `components/atelier/*` - Atelier section components
- `components/gallery/*` - Gallery effects
- `components/ui/*` - UI primitives

### Core APIs
- `app/api/products/route.ts` - Product listing
- `app/api/categories/route.ts` - Category listing
- `app/api/inquiry/route.ts` - Inquiry submission
- `app/api/fonts/[name]/route.ts` - Font serving
- `app/api/inventory-image/route.ts` - Image URL resolution

---

## Migration-Only Routes (Disable Before Production)

| Route | Purpose | Risk |
|-------|---------|------|
| `app/api/import-inventory-csv/route.ts` | CSV import | Writes DB |
| `app/api/import-inventory/route.ts` | Legacy import | Writes DB |
| `app/api/upload-inventory/route.ts` | Storage upload | DELETE destructive |
| `app/api/image-manifest/route.ts` | Image matching | POST modifies DB |
| `app/api/inventory-audit/route.ts` | Audit queries | Read-only, but exposes internals |
| `app/import/page.tsx` | Import UI | Should not be public |

---

## Unsafe Admin Actions

- `/api/upload-inventory` DELETE method wipes all storage files
- `/api/image-manifest` POST applies image matches without auth
- `/api/import-inventory-csv` POST imports CSV without auth
- Service role client used in multiple routes without auth check

---

## Stale or Broken References

- `components/studio/moodboard-canvas.tsx` - Partially built, may have missing deps
- `components/studio/konva-editor/image-editor.tsx` - Complex, needs testing
- Gallery page has hardcoded project data (should move to DB or CMS)
- Some Atelier images may be placeholder references

---

## Placeholder-Heavy Areas

- 732 products without images will show placeholder
- Gallery projects have hardcoded data
- Studio page is WIP
- Some brand page images may be placeholder

---

## Production Risks

1. **Unprotected import routes** - Must add auth or disable
2. **Service role exposure** - Should use anon client for public routes
3. **Large component files** - Admin page, Collection page need splitting
4. **No individual product routes** - SEO limitation
5. **Hardcoded gallery data** - Not CMS-driven
