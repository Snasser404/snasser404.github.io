/* ============================================================
   ANALYTICS — GA4 + (optional) Google Tag Manager

   ⚙️  SETUP: paste your IDs below and redeploy. Until then every
   function here is a safe no-op, so the site runs fine without them.

     1. GA4      → analytics.google.com → Admin → Data Streams → Web
                   → copy the "Measurement ID"  (looks like G-XXXXXXXXXX)
     2. GTM      → tagmanager.google.com → container ID (GTM-XXXXXXX)
                   Optional. Use GA4 alone if you don't need a tag manager.

   Events sent (all visible in GA4 → Reports → Realtime / Events):
     resume_download        — someone downloaded the resume PDF
     contact_click          — email / phone / linkedin / website click
     contact_form_submit    — contact form submitted successfully
     contact_form_error     — form submitted with validation errors
     assistant_open         — opened the portfolio assistant
     assistant_message      — sent the assistant a message
     view_work_section      — scrolled the Selected Work section into view
     scroll_depth           — 25 / 50 / 75 / 90 % of the page reached
   ============================================================ */

export const GA4_MEASUREMENT_ID = 'G-NJ992HNVP4'
export const GTM_CONTAINER_ID = '' // e.g. 'GTM-XXXXXXX'  (optional)

type Params = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const enabled = () => !!(GA4_MEASUREMENT_ID || GTM_CONTAINER_ID)

/** Send an event to GA4 (and the GTM dataLayer). No-op until IDs are set. */
export function track(event: string, params: Params = {}): void {
  if (!enabled() || typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
  window.gtag?.('event', event, params)
}

function injectScript(src: string): void {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

/** Load the tags. Call once on app start. */
export function initAnalytics(): void {
  if (!enabled() || typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []

  if (GA4_MEASUREMENT_ID) {
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`)
    // gtag must push `arguments` verbatim — don't refactor to (...args) => push(args)
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    } as (...args: unknown[]) => void
    window.gtag('js', new Date())
    window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: true })
  }

  if (GTM_CONTAINER_ID) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    injectScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`)
  }
}

/**
 * Scroll-depth milestones + a one-time "reached the Work section" event.
 * Returns a cleanup function.
 */
export function initScrollTracking(): () => void {
  if (!enabled() || typeof window === 'undefined') return () => {}

  const milestones = [25, 50, 75, 90]
  const hit = new Set<number>()

  const onScroll = () => {
    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    if (scrollable <= 0) return
    const pct = (window.scrollY / scrollable) * 100
    for (const m of milestones) {
      if (pct >= m && !hit.has(m)) {
        hit.add(m)
        track('scroll_depth', { percent_scrolled: m })
      }
    }
    if (hit.size === milestones.length) window.removeEventListener('scroll', onScroll)
  }

  window.addEventListener('scroll', onScroll, { passive: true })

  // fire once when the Selected Work section is actually seen
  let io: IntersectionObserver | undefined
  const work = document.getElementById('work')
  if (work && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track('view_work_section')
          io?.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(work)
  }

  return () => {
    window.removeEventListener('scroll', onScroll)
    io?.disconnect()
  }
}
