import { useContent, useLang } from '../lib/i18n'
import { track } from '../lib/analytics'

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
    </svg>
  )
}

/**
 * Two-language switch (English ⇄ العربية). Shows the language you'd
 * switch *to*, always rendered in that language's own script.
 */
export default function LangToggle({ block = false }: { block?: boolean }) {
  const { lang, setLang } = useLang()
  const t = useContent()
  const next = lang === 'en' ? 'ar' : 'en'

  return (
    <button
      type="button"
      className="lang-toggle"
      lang={next}
      aria-label={t.ui.langSwitchLabel}
      style={block ? { width: '100%', justifyContent: 'center' } : undefined}
      onClick={() => {
        setLang(next)
        track('language_switch', { to: next })
      }}
    >
      <GlobeIcon />
      <span>{t.ui.langSwitchTo}</span>
    </button>
  )
}
