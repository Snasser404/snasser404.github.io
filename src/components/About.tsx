import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { about, profile } from '../data/content'
import { Code, Megaphone, MapPin } from './icons'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <SectionHeading index="01" eyebrow="About" title="Marketing instinct, engineering execution." />

        <div className="about-layout">
          {/* Portrait / monogram panel */}
          <Reveal>
            <div className="card about-portrait">
              {about.headshot ? (
                <img
                  src={about.headshot}
                  alt={profile.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                />
              ) : (
                <div className="about-portrait-fallback">
                  <span className="about-monogram">NS</span>
                  <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                    <span className="about-pill"><Megaphone width={15} height={15} /> Marketing</span>
                    <span className="about-pill"><Code width={15} height={15} /> MarTech &amp; Data</span>
                  </div>
                </div>
              )}
              <div className="about-portrait-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text-soft)', fontSize: '0.85rem' }}>
                  <MapPin width={15} height={15} style={{ color: 'var(--cyan)' }} /> {profile.location}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {profile.languages}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Narrative */}
          <div>
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  style={{
                    fontSize: i === 0 ? 'clamp(1.05rem, 2.4vw, 1.3rem)' : '1.02rem',
                    color: i === 0 ? 'var(--text)' : 'var(--text-soft)',
                    marginTop: i === 0 ? 0 : '1.1rem',
                    lineHeight: 1.7,
                  }}
                >
                  {p}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="stat-grid" style={{ marginTop: '2.2rem' }}>
                {about.stats.map((s) => (
                  <div key={s.label} className="card" style={{ padding: '1.1rem 1.2rem' }}>
                    <div className="gradient-text" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.9rem', lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-soft)' }}>{s.label}</div>
                    {s.sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{s.sub}</div>}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
