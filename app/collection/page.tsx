'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Lazy load 3D viewer for performance
const InlineProductViewer = lazy(() => import('@/components/product-viewer-3d').then(mod => ({ default: mod.InlineProductViewer })))

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ARRIVALS - Featured pieces for the scrolling strip (separate from inventory)
// ═══════════════════════════════════════════════════════════════════════════════
const NEW_ARRIVALS = [
  { name: 'Georgia Sconce', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GEORGIA%2BSconce%2B1-rnc4CfwUpYrddyEN1oZ9B2AK5yhfyz.webp' },
  { name: 'Cressida Table Lamp', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CRESSIDA%2BTable%2BLamp-7vpkT2QzVYlThgDRVshSk3XOLY5ja7.webp' },
  { name: 'Jina Duo', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JINA%2BDuo-j7eLEUai1yqDNA6NSfIq4Nj5UJZoX4.webp' },
  { name: 'Agatha Duo', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AGATHA%2BDuo-KYMnfwMmh4lt6l8yfhY7AuLhem533g.webp' },
  { name: 'Concreta Wall Sconce', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CONCRETA%2BWall%2BSconce%2B0-49NNZi7tHXTuGuSL9ieNtbgm24eKPZ.webp' },
  { name: 'Culetta Marble Lamp', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CULETTA%2BMarble%2BCab%2BLamp-wy4XnS6P7WgnkozWwyGLs9QO2FmtNx.webp' },
  { name: 'Leanna Ivory Ottoman', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png' },
  { name: 'Jesamay Armchair', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/0bf81375-08dc-4f07-b967-998d4eb24c6a/JESAMAY+Chair+1.png' },
  { name: 'Fulton Sofa', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// FULL INVENTORY - Organized by category (matching their real site structure)
// ═══════════════════════════════════════════════════════════════════════════════
const CATEGORIES = ['All', 'Sofas', 'Loveseats', 'Chairs', 'Benches', 'Ottomans'] as const
type Category = typeof CATEGORIES[number]

interface InventoryItem {
  name: string
  category: 'Sofas' | 'Loveseats' | 'Chairs' | 'Benches' | 'Ottomans'
  image: string
}

// Real inventory from their site
const INVENTORY: InventoryItem[] = [
  // ─────────────────────────────────────────────────────────────
  // SOFAS
  // ─────────────────────────────────────────────────────────────
  { name: 'Indiwin Black Leather Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393201962-4E4HKZNINTLTPTQE7Z8O/INDIWIN_Sofa_0.png' },
  { name: 'Brooklyn Plush Charcoal Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393192804-GCYSRGVJ8BJOCF3G6AKM/BROOKLYN_Sofa_0.png' },
  { name: 'Stanhope Chocolate Leather Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png' },
  { name: 'Sylvanus Green & Ash Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png' },
  { name: 'Silas Sage + Oak Cane Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'Henry Upholstered Grey Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png' },
  { name: 'Lindt Toffee Velvet Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png' },
  { name: 'Reshma Botanical Sculptural Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'Aviana Botanical Linen Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393192804-GCYSRGVJ8BJOCF3G6AKM/BROOKLYN_Sofa_0.png' },
  { name: 'Elizabeth Velvet Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393201962-4E4HKZNINTLTPTQE7Z8O/INDIWIN_Sofa_0.png' },
  { name: 'Calista Fringe Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png' },
  { name: 'Talon Black Metal Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png' },
  
  // ─────────────────────────────────────────────────────────────
  // LOVESEATS
  // ─────────────────────────────────────────────────────────────
  { name: 'Cosette Sage Velvet Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'Phillipe Grey Silk Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'Antonella Cotton Velvet Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'Commodore Canvas Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'Jacinda Armless Textile Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'Rowntree Leather Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'Eloise Antique White French Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'Sidony Wood + White Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'Cicely Wicker + Linen Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  
  // ─────────────────────────────────────────────────────────────
  // CHAIRS
  // ─────────────────────────────────────────────────────────────
  { name: 'Benecio Leather Knit Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'Noelle Black Cane Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'Antonio Black Leather Butterfly Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'Fabian Grey Hide Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'Pierre Grey Silk Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png' },
  { name: 'Marshall Mango Wood Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'Fawn Natural Cane Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'Jesamay Armchair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/0bf81375-08dc-4f07-b967-998d4eb24c6a/JESAMAY+Chair+1.png' },
  { name: 'Giles Goat Hide Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'Hirshfield Leather Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'Nomad Wood Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'Artesia Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png' },
  { name: 'Lagos Swivel Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png' },
  { name: 'Hemingway Brown Leather Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'Tailor Brown Leather Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'Ford Deconstructed Leather Wingback', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'Bard Deconstructed Leather Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'Amun Brown Leather Butterfly Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'Poe Deconstructed Leather Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'Suhana Cognac Leather Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'Azalea Botanical Velvet Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png' },
  { name: 'Elspeth Almond Velvet Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png' },
  { name: 'Natori Fur Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'Florian Ivory Hide Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'Corwin Canvas Lounge Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png' },
  { name: 'Fulton White Leather Butterfly Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  
  // ─────────────────────────────────────────────────────────────
  // BENCHES
  // ─────────────────────────────────────────────────────────────
  { name: 'Osprey Black Metal Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  { name: 'Ygritte Ebony Tufted Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  { name: 'Alistair Green Leather Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  { name: 'Jourdain Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  { name: 'Avalon Iron + Linen Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  { name: 'Dune Wood and Tan Boucle Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  { name: 'Geraldine Goat Fur Wood Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  { name: 'Spencer Beige Cot Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  
  // ─────────────────────────────────────────────────────────────
  // OTTOMANS
  // ─────────────────────────────────────────────────────────────
  { name: 'Torro Leather Knit Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'Morrison Charcoal Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png' },
  { name: 'Jessie Cow Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
  { name: 'Evander Tapered Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'Grey Hills Linen Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png' },
  { name: 'Blanc White & Grey Cow Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'Ellora Sage Velvet Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
  { name: 'Leanna Ivory Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png' },
  { name: 'Lorenzo Ivory Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png' },
  { name: 'Nazara Grey Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png' },
  { name: 'Neriya Ivory Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'Siete Rattan Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
  { name: 'Omar Brown Leather Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png' },
  { name: 'Joseph Goat Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png' },
  { name: 'Trapper Canvas Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
]

// 3D model mapping
const MODEL_3D_MAP: Record<string, string> = {
  'Lindt Toffee Velvet Sofa': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb',
}

// Featured 3D product for hero
const FEATURED_3D = {
  name: 'Lindt Toffee Velvet Sofa',
  modelUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb',
  description: 'Channel tufted velvet sofa with brass frame detailing',
  category: 'Sofas'
}


export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [loaded, setLoaded] = useState(false)
  const [active3DProduct, setActive3DProduct] = useState<string | null>(null)
  const [hero3DReady, setHero3DReady] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Carousel refs for manual scrolling
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoaded(true)
    const timer = setTimeout(() => setHero3DReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const toggle3DView = (productName: string) => {
    setActive3DProduct(active3DProduct === productName ? null : productName)
  }

  const has3DModel = (name: string) => name in MODEL_3D_MAP
  const is3DActive = (name: string) => active3DProduct === name

  const filteredInventory = activeCategory === 'All' 
    ? INVENTORY 
    : INVENTORY.filter(item => item.category === activeCategory)

  // Manual carousel scroll
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = 400
    carouselRef.current.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    })
  }

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO: Compact 3D Showcase
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="pt-24 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* 3D Viewer */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[45vh] bg-[#d5cdc5]">
            {hero3DReady && (
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-charcoal/10 border-t-charcoal/40 rounded-full animate-spin" />
                </div>
              }>
                <InlineProductViewer modelUrl={FEATURED_3D.modelUrl} />
              </Suspense>
            )}
          </div>
          
          {/* Info Panel */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-10 lg:py-0 bg-charcoal">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-3">
              Featured · 3D Preview
            </p>
            <h1 className={cn(
              'font-display text-2xl lg:text-3xl tracking-tight font-light italic text-cream mb-3 transition-all duration-700 normal-case',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              {FEATURED_3D.name}
            </h1>
            <p className="text-sm text-cream/50 mb-4 max-w-sm">
              {FEATURED_3D.description}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/30">
              {FEATURED_3D.category}
            </p>
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════════
          NEW ARRIVALS STRIP - Manual scroll, no auto-filter
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-white border-y border-charcoal/5">
        <div className="flex items-center justify-between px-6 lg:px-12 mb-4">
          <h2 className="text-[10px] uppercase tracking-[0.25em] text-charcoal/50">New Arrivals</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-7 h-7 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/40 hover:border-charcoal/30 hover:text-charcoal transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-7 h-7 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/40 hover:border-charcoal/30 hover:text-charcoal transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Scrollable strip - NO auto filter on click */}
        <div 
          ref={carouselRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {NEW_ARRIVALS.map((item, i) => (
            <div
              key={i}
              className="group flex-shrink-0 w-[120px] lg:w-[140px]"
            >
              <div className="relative aspect-[3/4] bg-[#F5F3F0] mb-1.5 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  sizes="140px"
                />
              </div>
              <p className="text-[8px] tracking-[0.08em] text-charcoal/40 group-hover:text-charcoal/70 transition-colors truncate">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════════
          FILTER BAR - Dropdown style like their site
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-16 z-40 bg-cream border-b border-charcoal/10">
        <div className="px-6 lg:px-12 py-3 flex items-center justify-between">
          {/* Category Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal hover:text-charcoal/70 transition-colors"
            >
              <span>{activeCategory === 'All' ? 'All Categories' : activeCategory}</span>
              <svg 
                className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-2 bg-white border border-charcoal/10 shadow-lg z-40 min-w-[180px]">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category)
                        setDropdownOpen(false)
                      }}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors',
                        activeCategory === category 
                          ? 'bg-charcoal text-cream' 
                          : 'text-charcoal/70 hover:bg-charcoal/5'
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Item count */}
          <span className="text-[10px] text-charcoal/30 tracking-wider">
            {filteredInventory.length} pieces
          </span>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════════
          INVENTORY GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-3 lg:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px]">
          {filteredInventory.map((item, i) => (
            <div
              key={item.name}
              className={cn(
                'group transition-all duration-500',
                loaded ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${Math.min(i * 15, 300)}ms` }}
            >
              {/* Product Card */}
              <div className="relative aspect-square bg-[#eae6e1] overflow-hidden">
                {/* 3D or Static */}
                {is3DActive(item.name) && has3DModel(item.name) ? (
                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center bg-[#d5cdc5]">
                      <div className="w-5 h-5 border-2 border-charcoal/10 border-t-charcoal/50 rounded-full animate-spin" />
                    </div>
                  }>
                    <InlineProductViewer modelUrl={MODEL_3D_MAP[item.name]} />
                  </Suspense>
                ) : (
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105" 
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading={i < 8 ? "eager" : "lazy"}
                  />
                )}
                
                {/* 3D Toggle */}
                {has3DModel(item.name) && (
                  <button
                    onClick={() => toggle3DView(item.name)}
                    className={cn(
                      "absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300",
                      is3DActive(item.name)
                        ? "bg-charcoal text-cream"
                        : "bg-white/80 text-charcoal/50 hover:bg-white hover:text-charcoal"
                    )}
                    aria-label={is3DActive(item.name) ? 'Show photo' : 'View in 3D'}
                  >
                    {is3DActive(item.name) ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              
              {/* Product Info */}
              <div className="py-2 px-1">
                <h3 className="text-[10px] lg:text-xs tracking-[0.08em] text-charcoal font-medium truncate">
                  {item.name}
                </h3>
                <p className="text-[9px] tracking-[0.1em] text-charcoal/40 uppercase mt-0.5">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-charcoal">
        <div className="px-6 lg:px-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-4">
            Ready to design your event?
          </p>
          <a 
            href="/contact" 
            className="inline-block text-sm uppercase tracking-[0.2em] text-cream border-b border-cream/30 pb-1 hover:border-cream transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
