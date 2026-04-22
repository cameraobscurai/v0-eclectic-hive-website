/**
 * Analytics utility with fetchLater() for guaranteed delivery
 * 
 * fetchLater() survives page unload, tab close, and navigation.
 * Falls back to sendBeacon() for browsers without support.
 */

type AnalyticsEvent = {
  event: string
  properties?: Record<string, unknown>
  timestamp: number
}

// Check if we're in a prerendered page (speculation rules)
function isPrerendering(): boolean {
  return typeof document !== 'undefined' && (document as any).prerendering === true
}

// Defer analytics until page is actually activated
function waitForActivation(): Promise<void> {
  return new Promise((resolve) => {
    if (!isPrerendering()) {
      resolve()
      return
    }
    document.addEventListener('prerenderingchange', () => resolve(), { once: true })
  })
}

/**
 * Track an analytics event with guaranteed delivery
 */
export async function trackEvent(
  eventName: string, 
  properties?: Record<string, unknown>
): Promise<void> {
  // Don't fire analytics in prerendered pages
  if (isPrerendering()) {
    await waitForActivation()
  }

  const payload: AnalyticsEvent = {
    event: eventName,
    properties,
    timestamp: Date.now()
  }

  const body = JSON.stringify(payload)
  const url = '/api/analytics'

  // fetchLater() - guaranteed delivery even on tab close (Chrome 121+)
  if ('fetchLater' in window) {
    try {
      ;(window as any).fetchLater(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        activateAfter: 0 // send immediately, but survives unload
      })
      return
    } catch {
      // Fall through to sendBeacon
    }
  }

  // sendBeacon - good delivery, survives most unloads
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    if (navigator.sendBeacon(url, blob)) {
      return
    }
  }

  // Last resort - regular fetch (may be cancelled on unload)
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true // helps with unload scenarios
    })
  } catch {
    // Silently fail - analytics shouldn't break the app
  }
}

/**
 * Track when a product is added to inquiry
 */
export function trackInquiryAdd(productId: string, productName: string): void {
  trackEvent('inquiry_add', { productId, productName })
}

/**
 * Track when inquiry form is submitted
 */
export function trackInquirySubmit(itemCount: number): void {
  trackEvent('inquiry_submit', { itemCount })
}

/**
 * Track page views
 */
export function trackPageView(path: string): void {
  trackEvent('page_view', { path })
}

/**
 * Track collection filter changes
 */
export function trackFilterChange(category: string, subCategory?: string): void {
  trackEvent('filter_change', { category, subCategory })
}
