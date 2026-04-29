import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { trackInquiryAdd } from './analytics'

export interface ShortlistedItem {
  id: string
  name: string
  category: string
  imageUrl?: string
  primary_image_url?: string  // For compatibility with AffinityProduct union
  updated_at?: string         // For cache-busting inventory/ images
  dims_display?: string
  quantity: number
}

interface InquiryStore {
  items: ShortlistedItem[]
  add: (item: Omit<ShortlistedItem, 'quantity'>, quantity?: number) => void
  remove: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  has: (id: string) => boolean
  getQuantity: (id: string) => number
  totalCount: () => number
}

export const useInquiryStore = create<InquiryStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      add: (item, quantity = 1) => set((s) => {
        const existing = s.items.find(i => i.id === item.id)
        if (existing) {
          // Update quantity if already exists
          return {
            items: s.items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          }
        }
        // Track new item adds with guaranteed delivery
        trackInquiryAdd(item.id, item.name)
        return {
          items: [...s.items, { ...item, quantity }]
        }
      }),
      
      remove: (id) => set((s) => ({
        items: s.items.filter(i => i.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((s) => ({
        items: s.items.map(i => 
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),
      
      clear: () => set({ items: [] }),
      
      has: (id) => get().items.some(i => i.id === id),
      
      getQuantity: (id) => {
        const item = get().items.find(i => i.id === id)
        return item?.quantity ?? 0
      },
      
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'eclectic-hive-inquiry',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
