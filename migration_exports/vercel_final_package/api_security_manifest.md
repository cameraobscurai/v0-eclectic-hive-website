# API Security Manifest

## Route Audit

| Route | Methods | Reads DB | Writes DB | Writes Storage | Uses Service Role | Current Auth | Recommended Action |
|-------|---------|----------|-----------|----------------|-------------------|--------------|-------------------|
| `/api/products` | GET | Yes | No | No | No | None | Keep public |
| `/api/categories` | GET | Yes | No | No | No | None | Keep public |
| `/api/inquiry` | POST | No | Yes | No | No | None | Add rate limiting |
| `/api/fonts/[name]` | GET | Yes | No | No | Yes | None | Keep public, cache |
| `/api/inventory-image` | GET | Yes | No | No | No | None | Keep public |
| `/api/inventory-image/update` | POST | Yes | Yes | No | Yes | None | **Add auth** |
| `/api/admin/inquiries` | GET | Yes | No | No | Yes | None | **Add auth** |
| `/api/studio-auth` | POST | Yes | No | No | No | None | Review purpose |
| `/api/import-inventory-csv` | POST | Yes | Yes | No | Yes | None | **Disable or protect** |
| `/api/import-inventory` | POST | Yes | Yes | No | Yes | None | **Disable or protect** |
| `/api/upload-inventory` | GET | Yes | No | Yes | Yes | None | **Disable or protect** |
| `/api/upload-inventory` | POST | No | No | Yes | Yes | None | **Disable or protect** |
| `/api/upload-inventory` | DELETE | No | No | Yes | Yes | None | **DISABLE - Destructive** |
| `/api/image-manifest` | GET | Yes | No | No | Yes | None | Dev only |
| `/api/image-manifest` | POST | Yes | Yes | No | Yes | None | **Disable** |
| `/api/inventory-audit` | GET | Yes | No | No | Yes | None | Dev only |
| `/auth/callback` | GET | Yes | Yes | No | No | OAuth | Production ready |

---

## Critical Flags

### HIGH RISK - Must Disable Before Production

1. **`/api/import-inventory-csv` POST**
   - Unauthenticated CSV import
   - Writes to products, product_variants tables
   - Action: Add admin auth or disable route

2. **`/api/import-inventory` POST**
   - Migration-only legacy import
   - Writes to products, product_variants
   - Action: Disable route

3. **`/api/upload-inventory` DELETE**
   - Deletes ALL files from inventory storage
   - Catastrophic if called
   - Action: Remove DELETE method entirely

4. **`/api/image-manifest` POST**
   - Applies image matches to products table
   - No auth check
   - Action: Disable or add admin auth

### MEDIUM RISK - Add Auth

1. **`/api/inventory-image/update`**
   - Updates product image URLs
   - Should require admin

2. **`/api/admin/inquiries`**
   - Lists customer inquiries
   - Should require admin

### LOW RISK - Monitor

1. **`/api/inquiry` POST**
   - Public form submission
   - Add rate limiting to prevent spam

2. **`/api/fonts/[name]`**
   - Serves font files
   - Add cache headers for performance

---

## Service Role Usage

Routes using service role client (elevated privileges):
- `/api/fonts/[name]` - Reads from private storage bucket
- `/api/inventory-image/update` - Updates products
- `/api/admin/inquiries` - Reads inquiries
- `/api/import-inventory-csv` - Writes products
- `/api/import-inventory` - Writes products
- `/api/upload-inventory` - Manages storage
- `/api/image-manifest` - Reads/writes products
- `/api/inventory-audit` - Reads storage.objects

**Rule:** Service role operations must fail closed if auth not verified.

---

## Recommended Production Config

```typescript
// Middleware or route protection pattern
import { createClient } from '@/lib/supabase/server'

async function requireAdmin(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Check admin role if needed
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', user.id)
  //   .single()
  
  return null // Continue
}
```
