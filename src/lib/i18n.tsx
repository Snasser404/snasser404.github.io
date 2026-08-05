import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as en from '../data/content'
import * as ar from '../data/content.ar'

export type Lang = 'en' | 'ar'

const STORAGE_KEY = 'ns-lang'
const BUNDLES = { en, ar } as const
export type Bundle = typeof en

type Ctx = { lang: Lang; dir: 'ltr' | 'rtl'; setLang: (l: Lang) => void; t: Bundle }

const LangContext = createContext<Ctx>({ lang: 'en', dir: 'ltr', setLang: () => {}, t: en })

/** Read the saved choice, else fall back to the browser's language. */
function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en' // prerender in English
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'ar') return saved
  } catch {
    /* private mode — fall through */
  }
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  // Keep <html lang>/<dir> — and the tab title — in sync so screen readers,
  // fonts, and CSS logical properties all behave correctly.
  useEffect(() => {
    const el = document.documentElement
    el.lang = lang
    el.dir = dir

    const { title, description } = BUNDLES[lang].ui.meta
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [lang, dir])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<Ctx>(() => ({ lang, dir, setLang, t: BUNDLES[lang] }), [lang, dir, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

/** Everything a component needs: the active language and its content bundle. */
export function useLang(): Ctx {
  return useContext(LangContext)
}

/** Shorthand when a component only needs the content. */
export function useContent(): Bundle {
  return useContext(LangContext).t
}
