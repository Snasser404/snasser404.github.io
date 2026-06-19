import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { experience } from '../data/content'

export default function Experience() {
  return (
    <section id="experience" className="section" style={{ paddingTop: 0 }}>
      <div className="container-x">
        <SectionHeading index="06" eyebrow="Experience" title="Where the marketing results were made." />
        <div className="timeline">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.08}>
              <div className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-dot" />
                  {i < experience.length - 1 && <span className="timeline-line" />}
                </div>
                <div className="card timeline-card">
                  <div className="timeline-head">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{job.role}</h3>
                      <p style={{ margin: '4px 0 0', color: 'var(--cyan)', fontSize: '0.95rem' }}>
                        {job.company} <span style={{ color: 'var(--text-dim)' }}>· {job.location}</span>
                      </p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                      {job.period}
                    </span>
                  </div>
                  <ul className="job-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
