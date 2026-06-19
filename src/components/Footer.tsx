import { profile } from '../data/content'
import { GitHub, LinkedIn, Mail } from './icons'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', paddingBlock: '2.4rem', position: 'relative', zIndex: 1 }}>
      <div
        className="container-x"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}
      >
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, margin: 0 }}>{profile.name}</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            {profile.roleTitle} · {profile.location}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="GitHub">
            <GitHub width={18} height={18} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="LinkedIn">
            <LinkedIn width={18} height={18} />
          </a>
          <a href={`mailto:${profile.email}`} className="footer-icon" aria-label="Email">
            <Mail width={18} height={18} />
          </a>
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-dim)', margin: 0, width: '100%', textAlign: 'center', paddingTop: 8 }}>
          © {2026} Nasser Saleh — Designed & built with React, Three.js & a marketer's eye.
        </p>
      </div>
    </footer>
  )
}
