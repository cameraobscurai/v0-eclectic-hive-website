// Reference-counted scroll lock with iOS Safari support
// Prevents race conditions when multiple modals/overlays open simultaneously

let lockCount = 0
let savedScrollY = 0

export function lockScroll() {
  if (lockCount === 0) {
    savedScrollY = window.scrollY
    // iOS Safari requires position:fixed to truly prevent background scroll
    document.body.style.cssText += `
      overflow: hidden;
      position: fixed;
      top: -${savedScrollY}px;
      width: 100%;
    `
  }
  lockCount++
}

export function unlockScroll() {
  lockCount--
  if (lockCount <= 0) {
    lockCount = 0 // Prevent negative counts
    document.body.style.cssText = document.body.style.cssText
      .replace(/overflow:\s*hidden;?/g, '')
      .replace(/position:\s*fixed;?/g, '')
      .replace(/top:\s*-?\d+px;?/g, '')
      .replace(/width:\s*100%;?/g, '')
    window.scrollTo(0, savedScrollY)
  }
}

// Hook for React components
export function useScrollLock(isLocked: boolean) {
  if (typeof window === 'undefined') return
  
  if (isLocked) {
    lockScroll()
  }
  
  // Return cleanup function
  return () => {
    if (isLocked) {
      unlockScroll()
    }
  }
}
