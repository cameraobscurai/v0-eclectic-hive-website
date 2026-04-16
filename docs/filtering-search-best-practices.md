# Eclectic Hive: Filtering & Search Best Practices

## Overview

This document outlines the comprehensive filtering and search functionality for the Hive Signature Collection inventory. The goal is to create an intuitive, fast, and visually consistent experience for event planners browsing rental furniture.

---

## 1. Data Model

### Product Attributes

Each inventory item should include these attributes for comprehensive filtering:

```typescript
interface Product {
  // Core identification
  id: string                    // Unique identifier
  name: string                  // Display name (e.g., "INDIWIN SOFA")
  slug: string                  // URL-friendly name
  
  // Categorization
  category: Category            // Primary: Sofas, Loveseats, Chairs, Benches, Ottomans
  subcategory?: string          // Optional: Accent Chairs, Lounge Chairs, etc.
  collection?: string           // Optional: Modern, Vintage, Botanical, etc.
  
  // Visual attributes (for filtering)
  color: Color[]                // Primary colors: Ivory, Charcoal, Cognac, Sage, etc.
  finish: Finish[]              // Wood, Metal, Velvet, Leather, Linen, Rattan, etc.
  style: Style[]                // Modern, Vintage, Bohemian, Classic, Industrial
  
  // Physical attributes
  dimensions: {
    width: number               // inches
    depth: number               // inches  
    height: number              // inches
    seatHeight?: number         // inches (for seating)
  }
  
  // Availability
  quantity: number              // Available units
  isNew: boolean                // New arrival flag
  isCustomizable: boolean       // Can be customized (fabric, finish)
  
  // Media
  image: string                 // Primary image URL
  images?: string[]             // Additional angles
  model3D?: string              // GLB file for 3D viewer
  
  // Metadata
  tags: string[]                // Searchable keywords
  description?: string          // Optional detailed description
}
```

### Attribute Types

```typescript
type Category = 'All' | 'Sofas' | 'Loveseats' | 'Chairs' | 'Benches' | 'Ottomans' | 'Tables' | 'Lighting' | 'Decor'

type Color = 
  | 'Ivory' | 'Cream' | 'White' 
  | 'Charcoal' | 'Black' | 'Grey'
  | 'Cognac' | 'Brown' | 'Tan'
  | 'Sage' | 'Green' | 'Olive'
  | 'Blush' | 'Pink' | 'Rose'
  | 'Navy' | 'Blue' | 'Teal'
  | 'Gold' | 'Brass' | 'Bronze'
  | 'Natural' | 'Wood'

type Finish = 
  | 'Velvet' | 'Linen' | 'Leather' | 'Bouclé' | 'Cotton'
  | 'Wood' | 'Rattan' | 'Cane' | 'Bamboo'
  | 'Metal' | 'Brass' | 'Iron' | 'Chrome'
  | 'Marble' | 'Stone' | 'Concrete'
  | 'Glass'

type Style = 
  | 'Modern' | 'Contemporary'
  | 'Vintage' | 'Antique' | 'French'
  | 'Bohemian' | 'Eclectic'
  | 'Industrial' | 'Rustic'
  | 'Classic' | 'Traditional'
  | 'Minimalist' | 'Sculptural'
```

---

## 2. Filter UI Best Practices

### 2.1 Filter Bar Layout

**Desktop (1024px+)**
```
┌─────────────────────────────────────────────────────────────────────┐
│  [Category ▾]  [Color ▾]  [Finish ▾]  [Style ▾]  │  🔍 Search...  │  72 pieces  │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile (< 768px)**
```
┌────────────────────────────────────┐
│  🔍 Search pieces...               │
├────────────────────────────────────┤
│  [Filters ▾]           72 pieces   │
└────────────────────────────────────┘
```

### 2.2 Filter Dropdown Behavior

1. **Single-select dropdowns** for mutually exclusive filters (Category)
2. **Multi-select dropdowns** for combinable filters (Color, Finish, Style)
3. **Active filters** shown as removable chips below the filter bar
4. **Clear all** button when any filters are active
5. **Count indicators** showing matching items per filter option

### 2.3 Visual Alignment Rules

To prevent "tilting" or misalignment:

```css
/* Filter bar container */
.filter-bar {
  display: flex;
  align-items: center;        /* Vertical alignment */
  gap: 1rem;                  /* Consistent spacing */
  height: 48px;               /* Fixed height prevents jumping */
}

/* Dropdown buttons - consistent sizing */
.filter-dropdown {
  min-width: 120px;           /* Prevents layout shift */
  height: 36px;               /* Fixed height */
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Search input - fixed width */
.search-input {
  width: 240px;               /* Fixed on desktop */
  height: 36px;               /* Match dropdown height */
}
```

### 2.4 Dropdown Positioning

```typescript
// Prevent dropdowns from going off-screen
const positionDropdown = (trigger: HTMLElement, dropdown: HTMLElement) => {
  const triggerRect = trigger.getBoundingClientRect()
  const dropdownRect = dropdown.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  
  // Check if dropdown would overflow right edge
  if (triggerRect.left + dropdownRect.width > viewportWidth - 16) {
    dropdown.style.left = 'auto'
    dropdown.style.right = '0'
  }
}
```

---

## 3. Search Functionality

### 3.1 Search Behavior

**What to search:**
- Product name (exact and fuzzy match)
- Category name
- Color names
- Finish/material names
- Tags and keywords
- Collection names

**Search algorithm priority:**
1. Exact name match (highest relevance)
2. Name starts with query
3. Name contains query
4. Category/color/finish match
5. Tag match (lowest relevance)

```typescript
const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return products
  
  const q = query.toLowerCase().trim()
  
  return products
    .map(product => {
      let score = 0
      const name = product.name.toLowerCase()
      
      // Scoring
      if (name === q) score = 100                           // Exact match
      else if (name.startsWith(q)) score = 80              // Starts with
      else if (name.includes(q)) score = 60                // Contains
      else if (product.category.toLowerCase().includes(q)) score = 40
      else if (product.color?.some(c => c.toLowerCase().includes(q))) score = 30
      else if (product.finish?.some(f => f.toLowerCase().includes(q))) score = 30
      else if (product.tags?.some(t => t.toLowerCase().includes(q))) score = 20
      
      return { ...product, _score: score }
    })
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score)
}
```

### 3.2 Search UX Patterns

1. **Debounce input** - 300ms delay to prevent excessive filtering
2. **Show result count** immediately as user types
3. **Highlight matching text** in results (optional)
4. **Recent searches** - store last 5 searches in localStorage
5. **Suggested searches** - popular terms or categories
6. **No results state** - helpful message with clear filters option

```typescript
// Debounced search
const [searchQuery, setSearchQuery] = useState('')
const [debouncedQuery, setDebouncedQuery] = useState('')

useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
  return () => clearTimeout(timer)
}, [searchQuery])

// Filter uses debouncedQuery
const filteredProducts = useMemo(() => {
  return filterProducts(INVENTORY, activeCategory, debouncedQuery)
}, [activeCategory, debouncedQuery])
```

---

## 4. Sort Functionality

### Sort Options

```typescript
type SortOption = 
  | 'featured'      // Default - curated order
  | 'name-asc'      // A-Z
  | 'name-desc'     // Z-A
  | 'newest'        // New arrivals first
  | 'availability'  // Most available first
```

### Sort UI

```tsx
<select 
  value={sortBy} 
  onChange={(e) => setSortBy(e.target.value)}
  className="text-xs uppercase tracking-wide"
>
  <option value="featured">Featured</option>
  <option value="name-asc">Name: A-Z</option>
  <option value="name-desc">Name: Z-A</option>
  <option value="newest">Newest First</option>
  <option value="availability">Most Available</option>
</select>
```

---

## 5. Combined Filter Logic

### Filter Combination Rules

1. **Category** - Single select, narrows results
2. **Color** - Multi-select, items must have ANY selected color
3. **Finish** - Multi-select, items must have ANY selected finish
4. **Style** - Multi-select, items must have ANY selected style
5. **Search** - Applied on top of all filters

```typescript
const filterProducts = (
  products: Product[],
  filters: {
    category: Category
    colors: Color[]
    finishes: Finish[]
    styles: Style[]
    search: string
  }
): Product[] => {
  return products.filter(product => {
    // Category filter (AND)
    if (filters.category !== 'All' && product.category !== filters.category) {
      return false
    }
    
    // Color filter (OR within, AND with others)
    if (filters.colors.length > 0) {
      const hasColor = product.color?.some(c => filters.colors.includes(c))
      if (!hasColor) return false
    }
    
    // Finish filter (OR within, AND with others)
    if (filters.finishes.length > 0) {
      const hasFinish = product.finish?.some(f => filters.finishes.includes(f))
      if (!hasFinish) return false
    }
    
    // Style filter (OR within, AND with others)
    if (filters.styles.length > 0) {
      const hasStyle = product.style?.some(s => filters.styles.includes(s))
      if (!hasStyle) return false
    }
    
    // Search filter (AND)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      const searchable = [
        product.name,
        product.category,
        ...(product.color || []),
        ...(product.finish || []),
        ...(product.tags || [])
      ].join(' ').toLowerCase()
      
      if (!searchable.includes(q)) return false
    }
    
    return true
  })
}
```

---

## 6. URL State Management

Persist filter state in URL for shareability:

```typescript
// Example URL: /collection?category=Chairs&color=Ivory,Charcoal&search=velvet

const useFilterParams = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const filters = {
    category: searchParams.get('category') || 'All',
    colors: searchParams.get('color')?.split(',') || [],
    search: searchParams.get('search') || ''
  }
  
  const setFilters = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams()
    if (newFilters.category && newFilters.category !== 'All') {
      params.set('category', newFilters.category)
    }
    if (newFilters.colors?.length) {
      params.set('color', newFilters.colors.join(','))
    }
    if (newFilters.search) {
      params.set('search', newFilters.search)
    }
    router.push(`/collection?${params.toString()}`)
  }
  
  return [filters, setFilters] as const
}
```

---

## 7. Performance Considerations

1. **Memoize filtered results** with useMemo
2. **Virtualize long lists** if >100 items visible
3. **Lazy load images** with Next.js Image priority
4. **Debounce search input** (300ms)
5. **Skeleton loading states** for perceived performance

---

## 8. Accessibility

1. **Keyboard navigation** - Arrow keys in dropdowns
2. **Focus management** - Return focus after dropdown closes
3. **Screen reader announcements** - "X results found"
4. **Clear button** - Accessible label "Clear all filters"
5. **Search input** - Proper label and aria-describedby

```tsx
<div role="status" aria-live="polite" className="sr-only">
  {filteredProducts.length} pieces found
</div>
```

---

## 9. Implementation Checklist

- [ ] Extended Product interface with all attributes
- [ ] Category dropdown (single-select)
- [ ] Color filter dropdown (multi-select)
- [ ] Finish filter dropdown (multi-select)
- [ ] Style filter dropdown (multi-select)
- [ ] Search input with debounce
- [ ] Sort dropdown
- [ ] Active filter chips
- [ ] Clear all filters button
- [ ] URL state persistence
- [ ] Mobile filter drawer
- [ ] Empty state handling
- [ ] Loading states
- [ ] Accessibility testing
