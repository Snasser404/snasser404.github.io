import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { useContent } from '../lib/i18n'

export default function Education() {
  const { education, ui } = useContent()
  return (
    <section id="education" className="section" style={{ paddingTop: 0 }}>
      <div className="container-x">
        <SectionHeading index="06" eyebrow={ui.education.eyebrow} title={ui.education.title} />
        <div className="edu-grid">
          {education.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.05}>
              <div className="card edu-card glass-hover">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    className="chip"
                    style={{
                      borderColor: c.kind === 'cert' ? 'rgba(168,85,247,0.5)' : 'rgba(34,211,238,0.5)',
                      color: c.kind === 'cert' ? 'var(--violet)' : 'var(--cyan)',
                    }}
                  >
                    {c.kind === 'cert' ? ui.education.certificate : c.kind === 'study' ? ui.education.university : ui.education.degree}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>{c.year}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.02rem', fontWeight: 600, margin: '0.8rem 0 0', lineHeight: 1.3 }}>
                  {c.title}
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-soft)' }}>{c.org}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
