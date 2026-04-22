/**
 * B5: Shared Scroll Bus
 * Reduces 11 concurrent scroll listeners to 1 shared RAF loop
 */

type ScrollCallback = (y: number) => void

const callbacks = new Set<ScrollCallback>()
let ticking = false
let lastY = 0

function onScroll() {
  lastY = window.scrollY
  if (!ticking) {
    requestAnimationFrame(() => {
      callbacks.forEach(cb => cb(lastY))
      ticking = false
    })
    ticking = true
  }
}

let attached = false

export function subscribeScroll(cb: ScrollCallback): () => void {
  if (!attached && typeof window !== 'undefined') {
    window.addEventListener('scroll', onScroll, { passive: true })
    attached = true
  }
  callbacks.add(cb)
  // Call immediately with current position
  cb(typeof window !== 'undefined' ? window.scrollY : 0)
  
  return () => {
    callbacks.delete(cb)
    if (callbacks.size === 0 && attached) {
      window.removeEventListener('scroll', onScroll)
      attached = false
    }
  }
}

export function getCurrentScrollY(): number {
  return lastY
}
