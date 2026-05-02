# Site Manifest

## Public Pages (18)

| Route | Source | Type | Purpose | Data Dependencies | Status |
|-------|--------|------|---------|-------------------|--------|
| `/` | `app/page.tsx` | Public | Homepage | Products API | Production |
| `/atelier` | `app/atelier/page.tsx` | Public | Atelier showcase | None (static) | Production |
| `/gallery` | `app/gallery/page.tsx` | Public | Project gallery | Hardcoded | Production* |
| `/collection` | `app/collection/page.tsx` | Public | Product collection | Products/Categories API | Production |
| `/contact` | `app/contact/page.tsx` | Public | Contact form | Inquiry API | Production |
| `/faq` | `app/faq/page.tsx` | Public | FAQ | None (static) | Production |
| `/process` | `app/process/page.tsx` | Public | Process overview | None (static) | Production |
| `/privacy` | `app/privacy/page.tsx` | Public | Privacy policy | None (static) | Production |
| `/brand` | `app/brand/page.tsx` | Public | Brand overview | None (static) | Production |
| `/brand/guidelines` | `app/brand/guidelines/page.tsx` | Public | Brand guidelines | None (static) | Production |
| `/brand/language` | `app/brand/language/page.tsx` | Public | Brand language | None (static) | Production |
| `/brand/typography` | `app/brand/typography/page.tsx` | Public | Typography guide | None (static) | Production |
| `/brand/visual` | `app/brand/visual/page.tsx` | Public | Visual guide | None (static) | Production |
| `/studio` | `app/studio/page.tsx` | Public | Moodboard tool | None | WIP |
| `/admin` | `app/admin/page.tsx` | Admin | Admin dashboard | All APIs | Needs Auth |
| `/import` | `app/import/page.tsx` | Admin | Import tool | Import APIs | Dev Only |
| `/auth/login` | `app/auth/login/page.tsx` | Auth | Login | Supabase Auth | Production |
| `/auth/error` | `app/auth/error/page.tsx` | Auth | Auth error | None | Production |

*Gallery has hardcoded project data

---

## API Routes (14)

| Route | Methods | Type | Purpose | Reads DB | Writes DB | Writes Storage | Auth | Status |
|-------|---------|------|---------|----------|-----------|----------------|------|--------|
| `/api/products` | GET | Public | List products | Yes | No | No | None | Production |
| `/api/categories` | GET | Public | List categories | Yes | No | No | None | Production |
| `/api/inquiry` | POST | Public | Submit inquiry | No | Yes | No | None | Production |
| `/api/fonts/[name]` | GET | Public | Serve fonts | Yes (storage) | No | No | None | Production |
| `/api/inventory-image` | GET | Public | Resolve image URL | Yes | No | No | None | Production |
| `/api/inventory-image/update` | POST | Admin | Update image | Yes | Yes | No | None* | Needs Auth |
| `/api/admin/inquiries` | GET | Admin | List inquiries | Yes | No | No | None* | Needs Auth |
| `/api/studio-auth` | POST | Admin | Studio auth | Yes | No | No | None* | Needs Auth |
| `/api/import-inventory-csv` | POST | Migration | CSV import | Yes | Yes | No | None* | Dev Only |
| `/api/import-inventory` | POST | Migration | Legacy import | Yes | Yes | No | None* | Dev Only |
| `/api/upload-inventory` | GET,POST,DELETE | Migration | Storage upload | Yes | No | Yes | None* | Dev Only |
| `/api/image-manifest` | GET,POST | Migration | Image matching | Yes | Yes | No | None* | Dev Only |
| `/api/inventory-audit` | GET | Migration | Audit queries | Yes | No | No | None* | Dev Only |
| `/auth/callback` | GET | Auth | OAuth callback | Yes | Yes | No | OAuth | Production |

*Needs auth protection before production

---

## Navigation Structure

```
Header:
  Logo -> /
  Collection -> /collection
  Gallery -> /gallery  
  Atelier -> /atelier
  Process -> /process
  Contact -> /contact
  Inquiry Button -> Opens inquiry tray

Footer:
  Collection -> /collection
  Gallery -> /gallery
  Atelier -> /atelier
  FAQ -> /faq
  Contact -> /contact
  Privacy -> /privacy
  Brand -> /brand
```
