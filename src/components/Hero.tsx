import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../lib/i18n'
import { ArrowDown, ArrowUpRight, Sparkle } from './icons'

// Lazy-load the WebGL scene so first paint isn't blocked by Three.js.
const Scene3D = lazy(() => import('./Scene3D'))

const SSR = typeof window === 'undefined'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } },
}

export default function Hero() {
  const { profile, ui } = useContent()
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  /* Hold the WebGL scene back until the page is painted and idle. It's
     decorative, so it must never compete with first paint — and we skip it
     entirely for reduced-motion, low-core, or data-saver visitors. */
  const [showScene, setShowScene] = useState(false)
  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      nav.connection?.saveData === true ||
      (nav.hardwareConcurrency ?? 8) <= 2 ||
      (nav.deviceMemory ?? 8) <= 2
    if (skip) return

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const w = window as IdleWindow

    let cancelled = false
    let idleId: number | undefined
    let timerId: number | undefined
    const start = () => {
      if (!cancelled) setShowScene(true)
    }

    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(start, { timeout: 2500 })
    } else {
      timerId = window.setTimeout(start, 1200)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId)
      if (timerId !== undefined) clearTimeout(timerId)
    }
  }, [])

  return (
    <section
      id="hero"
      style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
    >
      {/* 3D backdrop — shifted right on desktop so it never sits under the text */}
      <div className="hero-scene">
        {!SSR && showScene && (
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        )}
      </div>
      {/* readability vignette over the canvas, on the text side (flips in RTL) */}
      <div className="hero-vignette" />

      <motion.div
        className="container-x"
        variants={container}
        initial={SSR ? false : "hidden"}
        animate="show"
        style={{ position: 'relative', zIndex: 2, paddingTop: 90, width: '100%' }}
      >
        <motion.div variants={item} style={{ marginBottom: 22 }}>
          <span className="chip" style={{ borderColor: 'rgba(34,211,238,0.4)', color: 'var(--text)' }}>
            <Sparkle width={14} height={14} style={{ color: 'var(--cyan)' }} /> {profile.location} · {ui.hero.availability}
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 'clamp(2.6rem, 8vw, 5.6rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            margin: 0,
            maxWidth: 16 + 'ch',
          }}
        >
          {profile.name.split(' ')[0]}{' '}
          <span className="gradient-text">{profile.name.split(' ').slice(1).join(' ')}</span>
        </motion.h1>

        <motion.p
          variants={item}
          style={{
            marginTop: 18,
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
            letterSpacing: '0.04em',
            color: 'var(--cyan)',
          }}
        >
          {profile.roleTitle}
        </motion.p>

        <motion.p
          variants={item}
          style={{ marginTop: 18, maxWidth: 540, fontSize: 'clamp(1rem, 2.2vw, 1.18rem)', color: 'var(--text-soft)' }}
        >
          {profile.subheadline}
        </motion.p>

        <motion.div variants={item} style={{ marginTop: 30, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button onClick={() => go('work')} className="btn btn-primary">
            {ui.hero.viewWork} <ArrowUpRight width={16} height={16} />
          </button>
          <button onClick={() => go('contact')} className="btn btn-ghost">
            {ui.hero.getInTouch}
          </button>
        </motion.div>

        <motion.p
          variants={item}
          style={{ marginTop: 36, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}
        >
          “{profile.tagline}”
        </motion.p>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        onClick={() => go('about')}
        aria-label={ui.hero.scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: 'absolute',
          bottom: 26,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          background: 'none',
          border: 'none',
          color: 'var(--text-dim)',
          cursor: 'pointer',
        }}
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ display: 'block' }}
        >
          <ArrowDown width={22} height={22} />
        </motion.span>
      </motion.button>
    </section>
  )
}
