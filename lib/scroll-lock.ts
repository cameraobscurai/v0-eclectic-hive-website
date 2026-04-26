// Reference-counted scroll lock with iOS Safari support
// Uses window-based counter so it can be reset on route change

function getLockCount(): number {
  if (typeof window === 'undefined') return 0
  return (window as any).__scrollLockCount || 0
}

function setLockCount(count: number) {
  if (typeof window !== 'undefined') {
    (window as any).__scrollLockCount = count
  }
}

function getSavedScrollY(): number {
  if (typeof window === 'undefined') return 0
  return (window as any).__savedScrollY || 0
}

function setSavedScrollY(y: number) {
  if (typeof window !== 'undefined') {
    (window as any).__savedScrollY = y
  }
}

export function lockScroll() {
  const count = getLockCount()
  if (count === 0) {
    // Capture scroll position before any style changes
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0
    setSavedScrollY(scrollY)
    // iOS Safari requires position:fixed to truly prevent background scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.left = '0'
  }
  setLockCount(count + 1)
}

export function unlockScroll() {
  const count = getLockCount()
  const newCount = Math.max(0, count - 1)
  setLockCount(newCount)
  
  if (newCount === 0) {
    const savedY = getSavedScrollY()
    // Clear styles first
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.left = ''
    // Use requestAnimationFrame to ensure styles are applied before scroll restore
    // This prevents the flash of wrong scroll position
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedY, behavior: 'instant' })
    })
  }
}

// Force reset - used by ScrollReset on route change
export function forceUnlockScroll() {
  setLockCount(0)
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.left = ''
}
