import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail } from './icons'

function ArrowUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

/** Floating quick-actions: jump to Contact, and back to top. Appear after scrolling. */
export default function FloatingActions() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fab-stack"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <button className="btn btn-primary fab-contact" onClick={toContact} aria-label="Jump to contact">
            <Mail width={16} height={16} /> Let's talk
          </button>
          <button className="fab-top" onClick={toTop} aria-label="Back to top">
            <ArrowUp />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
