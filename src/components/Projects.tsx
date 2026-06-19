import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import { featuredProjects, type Project } from '../data/content'

const FILTERS = ['All', 'AI', 'Web & SaaS', 'Client'] as const
type Filter = (typeof FILTERS)[number]

function matches(p: Project, f: Filter): boolean {
  if (f === 'All') return true
  if (f === 'Client') return !!p.client
  const c = p.category.toLowerCase()
  if (f === 'AI') return c.includes('ai')
  if (f === 'Web & SaaS') return c.includes('saas') || c.includes('pwa') || c.includes('site') || c.includes('web')
  return true
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All')
  const shown = featuredProjects.filter((p) => matches(p, filter))

  return (
    <section id="work" className="section" style={{ paddingTop: 'clamp(2rem, 5vw, 4rem)' }}>
      <div className="container-x">
        <SectionHeading index="02" eyebrow="Selected Work" title="Things I've designed, built, and shipped." />

        <Reveal>
          <div className="filter-bar" role="tablist" aria-label="Filter projects">
            {FILTERS.map((f) => {
              const count = featuredProjects.filter((p) => matches(p, f)).length
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  className={`filter-pill${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f} <span className="filter-count">{count}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <motion.div layout className="project-grid">
          {shown.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
