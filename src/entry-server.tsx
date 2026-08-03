import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'

/** Used at build time by scripts/prerender.mjs to bake the page text into
 *  dist/index.html, so crawlers and AI answer engines see real content
 *  instead of an empty <div id="root">. */
export function render(): string {
  return renderToStaticMarkup(<App />)
}
