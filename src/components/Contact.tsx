import { useState } from 'react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { useContent } from '../lib/i18n'
import { track } from '../lib/analytics'
import { Mail, Phone, MapPin, Globe, LinkedIn, Download, ArrowUpRight } from './icons'

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
  const { profile, ui } = useContent()
  const c = ui.contact
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})

  const validate = (name: string, email: string, message: string): Errors => {
    const e: Errors = {}
    if (!name.trim()) e.name = c.errName
    if (!email.trim()) e.email = c.errEmail
    else if (!isEmail(email)) e.email = c.errEmailInvalid
    if (!message.trim()) e.message = c.errMessage
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
      track('contact_form_error', { fields: Object.keys(found).join(',') })
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
          track('contact_form_submit', { method: 'web3forms' })
          form.reset()
        } else setStatus('error')
      } catch {
        setStatus('error')
      }
    } else {
      // mailto fallback — works with zero setup
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
      const subject = encodeURIComponent(`Portfolio message from ${name}`)
      track('contact_form_submit', { method: 'mailto' })
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('sent')
    }
  }

  // clear a field's error as the user corrects it
  const clearError = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  const contactLinks = [
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}`, method: 'email' },
    { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/[^0-9+]/g, '')}`, method: 'phone' },
    { icon: LinkedIn, label: 'linkedin.com/in/nasser-saleh', href: profile.linkedin, method: 'linkedin' },
    { icon: Globe, label: 'nassersaleh.ca', href: 'https://nassersaleh.ca', method: 'website' },
  ]

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <SectionHeading index="07" eyebrow={c.eyebrow} title={c.title} />

        <div className="contact-layout">
          {/* Left: pitch + direct links */}
          <Reveal>
            <div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-soft)', maxWidth: 460 }}>{c.intro}</p>

              <div className="assistant-callout">
                <span className="assistant-callout-icon">💬</span>
                <p>
                  <strong>{c.calloutStrong}</strong> {c.calloutBody}
                </p>
              </div>

              <div className="contact-links">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="card contact-link glass-hover"
                    onClick={() => track('contact_click', { method: link.method })}
                  >
                    <span className="contact-link-icon">
                      <link.icon width={17} height={17} />
                    </span>
                    <span dir="ltr" style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{link.label}</span>
                  </a>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
                <a
                  href={`${import.meta.env.BASE_URL}${profile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  onClick={() => track('resume_download', { location: 'contact' })}
                >
                  <Download width={16} height={16} /> {ui.nav.downloadResume}
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
                  {WEB3FORMS_ACCESS_KEY ? c.sentOk : `${c.sentMailto} ${profile.email}.`}
                </div>
              )}
              {status === 'error' && (
                <div className="form-banner form-banner--err" role="alert">
                  {c.sendFailed} {profile.email}.
                </div>
              )}

              <label className="field">
                <span>{c.name}</span>
                <input
                  name="name"
                  type="text"
                  placeholder={c.namePlaceholder}
                  aria-invalid={!!errors.name}
                  onChange={() => clearError('name')}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>

              <label className="field">
                <span>{c.email}</span>
                <input
                  name="email"
                  type="email"
                  dir="ltr"
                  placeholder={c.emailPlaceholder}
                  aria-invalid={!!errors.email}
                  onChange={() => clearError('email')}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>

              <label className="field">
                <span>{c.message}</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder={c.messagePlaceholder}
                  aria-invalid={!!errors.message}
                  onChange={() => clearError('message')}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </label>

              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={status === 'sending'}>
                {status === 'sending' ? c.sending : status === 'sent' ? c.sentButton : c.send}
                {status === 'idle' && <ArrowUpRight width={16} height={16} />}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
