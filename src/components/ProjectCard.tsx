import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Project } from '../data/content'
import ProjectVisual from './ProjectVisual'
import { ArrowUpRight, GitHub, Lock } from './icons'

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const accent = project.accent ?? '#6366f1'

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="card project-card"
    >
      {/* accent glow border on hover */}
      <div className="project-card-glow" style={{ background: `radial-gradient(60% 60% at 50% 0%, ${accent}33, transparent 70%)` }} />

      <ProjectVisual project={project} className="project-visual" />

      <div className="project-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span className="chip" style={{ borderColor: `${accent}66`, color: accent }}>
            {project.category}
          </span>
          {project.status && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              {project.status}
            </span>
          )}
        </div>

        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 600, margin: '0.7rem 0 0', letterSpacing: '-0.01em' }}>
          {project.name}
          {project.client && <span className="client-tag">Client</span>}
        </h3>

        <p style={{ marginTop: 10, color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: 1.6 }}>{project.blurb}</p>

        {project.highlights && (
          <ul className="project-highlights">
            {project.highlights.map((h, i) => (
              <li key={i}>
                <span className="hl-dot" style={{ background: accent }} />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="tech-row">
          {project.techStack.map((t) => (
            <span key={t} className="tech-chip">
              {t}
            </span>
          ))}
        </div>

        <div className="project-links">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="proj-link primary" style={{ color: accent }}>
              Live site <ArrowUpRight width={15} height={15} />
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="proj-link">
              <GitHub width={15} height={15} /> Code
            </a>
          )}
          {project.repoPrivate && (
            <span className="proj-link" style={{ color: 'var(--text-dim)', cursor: 'default' }}>
              <Lock width={14} height={14} /> Private repo
            </span>
          )}
          {!project.live && !project.repo && !project.repoPrivate && (
            <span className="proj-link" style={{ color: 'var(--text-dim)', cursor: 'default' }}>
              <Lock width={14} height={14} /> Case study on request
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
