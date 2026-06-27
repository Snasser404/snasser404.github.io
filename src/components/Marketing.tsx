import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { marketingProjects, designGallery } from '../data/content'

export default function Marketing() {
  return (
    <section id="marketing" className="section" style={{ paddingTop: 0 }}>
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Campaigns & Results"
          title="Campaigns and creative that moved the numbers."
        />

        {/* Case studies */}
        <div className="mkt-grid">
          {marketingProjects.map((m, i) => (
            <Reveal key={m.title} delay={(i % 2) * 0.08}>
              <article className="card mkt-card glass-hover" style={{ height: '100%' }}>
                <div
                  className="project-card-glow"
                  style={{ background: `radial-gradient(60% 60% at 50% 0%, ${m.accent}1f, transparent 70%)`, opacity: 1 }}
                />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span className="chip" style={{ borderColor: `${m.accent}66`, color: m.accent }}>
                    {m.type}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>{m.org}</span>
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 18 }}>
                  <span className="mkt-metric" style={{ color: m.accent }}>
                    {m.metric}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>{m.metricLabel}</span>
                </div>

                <h3 style={{ position: 'relative', fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 600, margin: '0.9rem 0 0' }}>
                  {m.title}
                </h3>
                <p style={{ position: 'relative', marginTop: 8, color: 'var(--text-soft)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {m.description}
                </p>

                {m.image && (
                  <img
                    src={m.image}
                    alt={`${m.title} preview`}
                    loading="lazy"
                    style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-sm)', marginTop: 14, border: '1px solid var(--line)' }}
                  />
                )}

                <div className="mkt-toolrow" style={{ position: 'relative' }}>
                  {m.tools.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Design & content gallery (placeholders to fill) */}
        <Reveal>
          <div className="design-head">
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.3rem', fontWeight: 600, margin: 0 }}>Design & Content</h3>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-dim)' }}>
              Creative I produce across the funnel — selected samples available on request.
            </span>
          </div>
        </Reveal>

        <div className="design-gallery">
          {designGallery.map((tile, i) => (
            <Reveal key={tile.label} delay={(i % 3) * 0.06}>
              <div className="design-tile">
                {tile.image ? (
                  <img src={tile.image} alt={tile.label} loading="lazy" />
                ) : (
                  <>
                    <span className="design-tile-badge">{tile.label[0]}</span>
                    <span className="design-tile-label">{tile.label}</span>
                    <span className="design-tile-tag">{tile.tag}</span>
                    <span className="design-tile-req">Samples on request</span>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
