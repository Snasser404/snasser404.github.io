import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import { featuredProjects, services } from '../data/content'

export default function Projects() {
  return (
    <section id="work" className="section" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)' }}>
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Selected Work · Clients"
          title="Marketing programs I've run for clients."
        />

        {/* What I take on — customer-facing */}
        <Reveal>
          <p className="work-lead">
            I take on the marketing function end to end — strategy and research, the campaigns that run off
            it, the reporting that proves what worked, and the commercial growth work around it.
          </p>
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
          <h3 className="work-subhead">Selected client work</h3>
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
