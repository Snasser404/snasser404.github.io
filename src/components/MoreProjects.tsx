import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { otherProjects } from '../data/content'
import { ArrowUpRight, GitHub } from './icons'

export default function MoreProjects() {
  return (
    <section id="more" className="section" style={{ paddingTop: 0 }}>
      <div className="container-x">
        <SectionHeading index="04" eyebrow="More Builds" title="The rest of the workshop." />
        <div className="more-grid">
          {otherProjects.map((p, i) => {
            const accent = p.accent ?? '#6366f1'
            const href = p.live ?? p.repo
            const Wrapper = (href ? 'a' : 'div') as 'a'
            return (
              <Reveal key={p.name} delay={(i % 3) * 0.06}>
                <Wrapper
                  {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="card more-card glass-hover"
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center', background: `${accent}1f`, border: `1px solid ${accent}44`, fontFamily: 'var(--font-sans)', fontWeight: 700, color: accent, fontSize: '0.95rem' }}>
                      {p.name[0]}
                    </span>
                    {p.live ? (
                      <ArrowUpRight width={16} height={16} style={{ color: 'var(--text-dim)' }} />
                    ) : p.repo ? (
                      <GitHub width={16} height={16} style={{ color: 'var(--text-dim)' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                        On request
                      </span>
                    )}
                  </div>
                  <span className="chip" style={{ marginTop: 14, borderColor: `${accent}55`, color: accent }}>{p.category}</span>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 600, margin: '0.6rem 0 0' }}>
                    {p.name}
                    {p.client && <span className="client-tag">Client</span>}
                  </h3>
                  <p style={{ marginTop: 8, fontSize: '0.88rem', color: 'var(--text-soft)', lineHeight: 1.55 }}>{p.blurb}</p>
                  <div className="tech-row" style={{ marginTop: 14 }}>
                    {p.techStack.slice(0, 5).map((t) => (
                      <span key={t} className="tech-chip">{t}</span>
                    ))}
                  </div>
                </Wrapper>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
