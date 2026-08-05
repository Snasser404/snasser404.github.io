import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'
import { LangProvider } from './lib/i18n'

/** Used at build time by scripts/prerender.mjs to bake the page text into
 *  dist/index.html, so crawlers and AI answer engines see real content
 *  instead of an empty <div id="root">. Always English — that's what
 *  <html lang="en"> and the canonical URL advertise. */
export function render(): string {
  return renderToStaticMarkup(
    <LangProvider>
      <App />
    </LangProvider>,
  )
}
