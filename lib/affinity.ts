// ─── Types ────────────────────────────────────────────────────────────────────

export interface AffinityProduct {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  primary_image_url?: string
  is_featured?: boolean
  dims_display?: string
  display_type?: 'single' | 'variants' | 'custom_inquiry'
  updated_at?: string  // Needed for cache-busting inventory/ images
}

// ─── Room Logic ───────────────────────────────────────────────────────────────
// Earlier in each array = stronger complement

const COMPLEMENTS: Record<string, string[]> = {
  'Seating':                ['Tables', 'Rugs', 'Pillows', 'Lighting', 'Candlelight', 'Styling'],
  'Tables':                 ['Seating', 'Lighting', 'Candlelight', 'Styling', 'Rugs', 'Tableware'],
  'Rugs':                   ['Seating', 'Tables', 'Pillows', 'Lighting', 'Styling'],
  'Lighting':               ['Seating', 'Tables', 'Rugs', 'Styling', 'Candlelight'],
  'Chandeliers':            ['Tables', 'Seating', 'Styling', 'Candlelight', 'Rugs'],
  'Pillows':                ['Seating', 'Rugs', 'Styling', 'Furs & Pelts'],
  'Styling':                ['Tables', 'Seating', 'Lighting', 'Candlelight', 'Rugs'],
  'Candlelight':            ['Tables', 'Seating', 'Styling', 'Tableware', 'Serveware'],
  'Tableware':              ['Tables', 'Candlelight', 'Styling', 'Serveware', 'Bars'],
  'Serveware':              ['Tableware', 'Tables', 'Bars', 'Styling', 'Candlelight'],
  'Bars':                   ['Seating', 'Lighting', 'Styling', 'Serveware', 'Tableware'],
  'Large Decor & Dividers': ['Seating', 'Lighting', 'Rugs', 'Styling', 'Tables'],
  'Furs & Pelts':           ['Seating', 'Rugs', 'Pillows', 'Styling'],
  'Storage':                ['Styling', 'Seating', 'Lighting'],
}

// ─── Color Families ───────────────────────────────────────────────────────────

const COLOR_FAMILIES: Record<string, string[]> = {
  warm: [
    'toffee', 'cream', 'ivory', 'sand', 'wheat', 'linen', 'champagne',
    'blush', 'peach', 'copper', 'bronze', 'gold', 'amber', 'honey',
    'caramel', 'cognac', 'walnut', 'oak', 'ash', 'birch', 'maple',
  ],
  cool: [
    'slate', 'steel', 'silver', 'fog', 'grey', 'gray', 'blue', 'navy',
    'indigo', 'cobalt', 'teal', 'azure', 'ice', 'frost', 'pewter',
  ],
  earth: [
    'sage', 'green', 'moss', 'olive', 'forest', 'fern', 'cedar', 'rust',
    'terra', 'clay', 'sienna', 'tobacco', 'espresso', 'mahogany', 'ebony',
    'chocolate', 'bark', 'umber',
  ],
  neutral: [
    'white', 'black', 'charcoal', 'onyx', 'graphite', 'stone', 'pebble',
    'natural', 'raw', 'bone', 'chalk',
  ],
  jewel: [
    'emerald', 'sapphire', 'velvet', 'burgundy', 'wine', 'plum',
    'aubergine', 'mustard', 'saffron', 'ochre', 'marigold', 'paprika',
  ],
}

export function getColorFamily(name: string): string | null {
  const lower = name.toLowerCase()
  for (const [family, words] of Object.entries(COLOR_FAMILIES)) {
    if (words.some(w => lower.includes(w))) return family
  }
  return null
}

// ─── Sub-category Detection ───────────────────────────────────────────────────

const SUB_KEYWORDS: Record<string, string[]> = {
  'Sofas':         ['sofa', 'loveseat', 'settee', 'couch'],
  'Chairs':        ['chair', 'armchair', 'accent chair', 'lounge chair'],
  'Benches':       ['bench', 'daybed'],
  'Ottomans':      ['ottoman', 'pouf', 'footstool'],
  'Stools':        ['stool', 'barstool'],
  'Coffee Tables': ['coffee table', 'cocktail table'],
  'Side Tables':   ['side table', 'end table', 'accent table', 'drink table'],
  'Dining Tables': ['dining table', 'farm table'],
  'Consoles':      ['console', 'entry table', 'sofa table'],
}

function detectSub(name: string): string {
  const lower = name.toLowerCase()
  for (const [sub, kws] of Object.entries(SUB_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return sub
  }
  return 'Other'
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export function getAffinityScore(
  source: AffinityProduct,
  candidate: AffinityProduct,
): number {
  if (source.id === candidate.id) return -1

  let score = 0
  const srcFamily  = getColorFamily(source.name)
  const candFamily = getColorFamily(candidate.name)

  // Same category: only suggest different sub-types
  if (source.category === candidate.category) {
    const srcSub  = detectSub(source.name)
    const candSub = detectSub(candidate.name)
    if (srcSub !== 'Other' && srcSub === candSub) return -1
    score += 2
  }

  // Complementary category
  const complements = COMPLEMENTS[source.category] ?? []
  const idx = complements.indexOf(candidate.category)
  if (idx !== -1) score += Math.max(1, 6 - idx)

  // No relationship — exclude
  if (score === 0) return 0

  // Color affinity
  if (srcFamily && candFamily) {
    if (srcFamily === candFamily) {
      score += 3
    } else if (
      (srcFamily === 'warm' && candFamily === 'earth') ||
      (srcFamily === 'earth' && candFamily === 'warm')
    ) {
      score += 2
    } else if (srcFamily === 'neutral' || candFamily === 'neutral') {
      score += 1
    }
  }

  if (candidate.is_featured) score += 1

  return score
}

// Single source → ranked suggestions
export function getSuggestions(
  source: AffinityProduct,
  pool: AffinityProduct[],
  count = 8,
): AffinityProduct[] {
  return pool
    .map(p => ({ p, s: getAffinityScore(source, p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, count)
    .map(({ p }) => p)
}

// Multiple sources (tray aggregate) → ranked suggestions
export function getAggregateSuggestions(
  sources: AffinityProduct[],
  pool: AffinityProduct[],
  count = 6,
): AffinityProduct[] {
  const sourceIds = new Set(sources.map(s => s.id))
  return pool
    .filter(p => !sourceIds.has(p.id))
    .map(p => ({
      p,
      s: sources.reduce((sum, src) => sum + Math.max(0, getAffinityScore(src, p)), 0),
    }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, count)
    .map(({ p }) => p)
}
