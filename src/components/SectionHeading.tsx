import Reveal from './Reveal'

type Props = {
  index: string
  eyebrow: string
  title: string
  action?: React.ReactNode
}

export default function SectionHeading({ index, eyebrow, title, action }: Props) {
  return (
    <Reveal>
      <div className="heading-row">
        <div>
          <span className="heading-index">{index}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h2 className="section-title">{title}</h2>
        </div>
        {action}
      </div>
    </Reveal>
  )
}
