import type { Project } from '../data/content'

/**
 * Generated, on-brand visual for a project card.
 * If `project.image` is set (a path under /public), it renders that screenshot.
 * Otherwise it renders an attractive procedural accent panel so the card never
 * looks broken — the user can drop real screenshots into /public/projects later.
 */
export default function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  const accent = project.accent ?? '#6366f1'

  if (project.image) {
    return (
      <div className={className} style={{ overflow: 'hidden' }}>
        <img
          src={project.image}
          alt={`${project.name} preview`}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  const initials = project.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={className}
      aria-hidden
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(125% 125% at 0% 0%, ${accent}26, transparent 55%),
                     radial-gradient(120% 120% at 100% 100%, ${accent}1a, transparent 55%),
                     linear-gradient(160deg, #ffffff, #eef1f9)`,
      }}
    >
      {/* faint dot matrix */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${accent}4d 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
          opacity: 0.4,
          maskImage: 'radial-gradient(80% 80% at 50% 40%, black, transparent)',
        }}
      />
      {/* glow orb */}
      <div
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          right: '-10%',
          top: '-15%',
          background: `radial-gradient(circle, ${accent}3d, transparent 60%)`,
          filter: 'blur(18px)',
        }}
      />
      {/* monogram + category */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.1rem 1.3rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 6vw, 3.4rem)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: accent,
            opacity: 0.92,
            textShadow: `0 6px 24px ${accent}40`,
          }}
        >
          {initials}
        </span>
        <span
          style={{
            marginTop: '0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          {project.category}
        </span>
      </div>
    </div>
  )
}
