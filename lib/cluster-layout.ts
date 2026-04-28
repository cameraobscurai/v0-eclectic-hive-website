// Products with sub-category already detected
export interface ClusteredProduct {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  _subCategory: string
  primary_image_url?: string
  is_featured?: boolean
  updated_at?: string
  display_type?: string
  dims_display?: string
  stock_count?: number
  width_inches?: number
  depth_inches?: number
  height_inches?: number
}

export interface Cluster {
  subCategory: string
  products: ClusteredProduct[]
  // x offset of this cluster's left edge in the canvas (px)
  xOffset: number
  // total width of this cluster including label gutter
  width: number
}

const CARD_SIZE    = 220  // px — card width and height
const CARD_GAP     = 2    // px — gap between cards (matches ShortlistGrid)
const LABEL_GUTTER = 64   // px — space before each cluster for the vertical label
const CLUSTER_GAP  = 48   // px — space between clusters
const CANVAS_PAD   = 48   // px — leading and trailing horizontal padding

// How many rows to use based on available canvas height
// This is called with the measured container height at runtime
export function getRowCount(canvasHeight: number): number {
  const rows = Math.floor(canvasHeight / (CARD_SIZE + CARD_GAP))
  return Math.max(2, Math.min(rows, 5)) // clamp 2–5 rows
}

export function buildClusters(
  products: ClusteredProduct[],
  sortOrder: string[],
  canvasHeight: number,
): Cluster[] {
  const rows = getRowCount(canvasHeight)

  // Group by sub-category
  const groups = new Map<string, ClusteredProduct[]>()
  for (const p of products) {
    const key = p._subCategory || 'Other'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(p)
  }

  // Sort groups by the provided sortOrder
  const sorted = Array.from(groups.entries()).sort(([a], [b]) => {
    const ai = sortOrder.indexOf(a)
    const bi = sortOrder.indexOf(b)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  const clusters: Cluster[] = []
  let xCursor = CANVAS_PAD

  for (const [subCategory, clusterProducts] of sorted) {
    const cols = Math.ceil(clusterProducts.length / rows)
    const clusterWidth = LABEL_GUTTER + cols * CARD_SIZE + (cols - 1) * CARD_GAP

    clusters.push({
      subCategory,
      products: clusterProducts,
      xOffset: xCursor,
      width: clusterWidth,
    })

    xCursor += clusterWidth + CLUSTER_GAP
  }

  return clusters
}

export function getTotalCanvasWidth(clusters: Cluster[]): number {
  if (clusters.length === 0) return 0
  const last = clusters[clusters.length - 1]
  return last.xOffset + last.width + CANVAS_PAD
}

// Constants exported for use in the component
export const CANVAS_CONSTANTS = { CARD_SIZE, CARD_GAP, LABEL_GUTTER, CLUSTER_GAP, CANVAS_PAD }
