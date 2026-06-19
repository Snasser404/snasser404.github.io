import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { navItems, profile } from '../data/content'
import { Download } from './icons'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
        background: scrolled ? 'rgba(255,255,255,0.78)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px -12px rgba(16,24,40,0.25)' : 'none',
      }}
    >
      <nav
        className="container-x"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 38,
              height: 38,
              borderRadius: 11,
              border: '1px solid var(--line-strong)',
              background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(168,85,247,0.15))',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            NS
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text)' }}>
            Nasser&nbsp;Saleh
          </span>
        </button>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: 4 }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => go(item.id)} className="nav-link">
              {item.label}
            </button>
          ))}
          <a
            href={`${import.meta.env.BASE_URL}${profile.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ marginLeft: 12, padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <Download width={15} height={15} /> Résumé
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="nav-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span style={{ transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="nav-mobile glass"
            style={{ overflow: 'hidden' }}
          >
            <div className="container-x" style={{ display: 'flex', flexDirection: 'column', paddingBlock: 14, gap: 4 }}>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => go(item.id)} className="nav-link" style={{ textAlign: 'left', padding: '0.7rem 0' }}>
                  {item.label}
                </button>
              ))}
              <a
                href={`${import.meta.env.BASE_URL}${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ marginTop: 8, justifyContent: 'center' }}
              >
                <Download width={15} height={15} /> Download Résumé
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
