import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import { useContent } from '../lib/i18n'

export default function Projects() {
  const { featuredProjects, services, ui } = useContent()
  return (
    <section id="work" className="section" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)' }}>
      <div className="container-x">
        <SectionHeading index="02" eyebrow={ui.work.eyebrow} title={ui.work.title} />

        {/* What I take on — customer-facing */}
        <Reveal>
          <p className="work-lead">{ui.work.lead}</p>
        </Reveal>
        <div className="service-grid">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={(i % 4) * 0.06}>
              <div className="service-card card">
                <span className="service-card-name" style={{ color: s.accent }}>
                  {s.name}
                </span>
                <p>{s.blurb}</p>
                {s.example && <span className="service-card-eg">{s.example}</span>}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Client proof */}
        <Reveal>
          <h3 className="work-subhead">{ui.work.subhead}</h3>
        </Reveal>
        <div className="project-grid">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
