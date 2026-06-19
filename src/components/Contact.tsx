import { useState } from 'react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { profile } from '../data/content'
import { Mail, Phone, MapPin, GitHub, LinkedIn, Download, ArrowUpRight } from './icons'

/**
 * To enable real form submissions (no email client needed), create a free
 * access key at https://web3forms.com and paste it below. Until then the form
 * gracefully falls back to opening the visitor's email client (mailto).
 */
const WEB3FORMS_ACCESS_KEY = '' // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Errors = { name?: string; email?: string; message?: string }

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})

  const validate = (name: string, email: string, message: string): Errors => {
    const e: Errors = {}
    if (!name.trim()) e.name = 'Please enter your name.'
    if (!email.trim()) e.email = 'Please enter your email.'
    else if (!isEmail(email)) e.email = 'Please enter a valid email address.'
    if (!message.trim()) e.message = 'Please add a short message.'
    return e
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '')
    const email = String(data.get('email') || '')
    const message = String(data.get('message') || '')

    const found = validate(name, email, message)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setStatus('idle')
      return
    }

    if (WEB3FORMS_ACCESS_KEY) {
      setStatus('sending')
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name,
            email,
            message,
            subject: `Portfolio message from ${name}`,
          }),
        })
        if (res.ok) {
          setStatus('sent')
          form.reset()
        } else setStatus('error')
      } catch {
        setStatus('error')
      }
    } else {
      // mailto fallback — works with zero setup
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
      const subject = encodeURIComponent(`Portfolio message from ${name}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('sent')
    }
  }

  // clear a field's error as the user corrects it
  const clearError = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  const contactLinks = [
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/[^0-9+]/g, '')}` },
    { icon: LinkedIn, label: 'linkedin.com/in/nasser-saleh', href: profile.linkedin },
    { icon: GitHub, label: 'github.com/Snasser404', href: profile.github },
  ]

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <SectionHeading index="08" eyebrow="Contact" title="Let's build something worth marketing." />

        <div className="contact-layout">
          {/* Left: pitch + direct links */}
          <Reveal>
            <div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-soft)', maxWidth: 460 }}>
                Open to software, marketing, and hybrid roles — plus freelance builds. Drop a line and I'll get back to you
                quickly.
              </p>

              <div className="contact-links">
                {contactLinks.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="card contact-link glass-hover"
                  >
                    <span className="contact-link-icon">
                      <c.icon width={17} height={17} />
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{c.label}</span>
                  </a>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
                <a
                  href={`${import.meta.env.BASE_URL}${profile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Download width={16} height={16} /> Download résumé
                </a>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  <MapPin width={15} height={15} /> {profile.location}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.1}>
            <form className="card contact-form" onSubmit={onSubmit} noValidate>
              {status === 'sent' && (
                <div className="form-banner form-banner--ok" role="status">
                  Thanks! {WEB3FORMS_ACCESS_KEY ? 'Your message was sent.' : 'Your email app should have opened — if not, write to ' + profile.email + '.'}
                </div>
              )}
              {status === 'error' && (
                <div className="form-banner form-banner--err" role="alert">
                  Something went wrong. Please email me directly at {profile.email}.
                </div>
              )}

              <label className="field">
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  onChange={() => clearError('name')}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  onChange={() => clearError('email')}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>

              <label className="field">
                <span>Message</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="What are you building?"
                  aria-invalid={!!errors.message}
                  onChange={() => clearError('message')}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </label>

              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message ready ✓' : 'Send message'}
                {status === 'idle' && <ArrowUpRight width={16} height={16} />}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
