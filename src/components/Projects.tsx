import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import { featuredProjects, webPlatforms } from '../data/content'

export default function Projects() {
  return (
    <section id="work" className="section" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)' }}>
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Selected Work · Clients"
          title="Websites that market themselves — built and run for clients."
        />

        {/* Website development — the "how", customer-facing */}
        <Reveal>
          <p className="work-lead">
            I build the website on whatever platform fits your business — then handle the SEO, GEO, tracking, and lead
            funnels that make it actually perform.
          </p>
        </Reveal>
        <div className="web-platforms">
          {webPlatforms.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.06}>
              <div className="web-card card">
                <span className="web-card-name" style={{ color: p.accent }}>
                  {p.name}
                </span>
                <p>{p.blurb}</p>
                {p.example && <span className="web-card-eg">{p.example}</span>}
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
