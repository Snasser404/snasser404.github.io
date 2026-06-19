import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { skillGroups } from '../data/content'

const accents = ['#22d3ee', '#6366f1', '#a855f7', '#34e0c4', '#3D9DF6', '#fbbf24']

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container-x">
        <SectionHeading index="05" eyebrow="Skills & Stack" title="A toolkit that spans growth and engineering." />
        <div className="skills-grid">
          {skillGroups.map((g, i) => {
            const accent = accents[i % accents.length]
            return (
              <Reveal key={g.group} delay={(i % 3) * 0.06}>
                <div className="card" style={{ padding: '1.4rem 1.4rem 1.5rem', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: accent, boxShadow: `0 0 14px ${accent}` }} />
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>{g.group}</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                    {g.skills.map((s) => (
                      <span key={s} className="tech-chip">{s}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
