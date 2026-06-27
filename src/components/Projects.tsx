import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import { featuredProjects } from '../data/content'

export default function Projects() {
  return (
    <section id="work" className="section" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)' }}>
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Selected Work · Clients"
          title="Marketing work I've delivered for clients."
        />
        <div className="project-grid">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
