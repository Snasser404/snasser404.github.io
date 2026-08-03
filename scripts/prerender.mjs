/* Bakes the rendered page text into dist/index.html.
   Runs after `vite build` (client) and `vite build --ssr`.

   Why: the site is a SPA, so <div id="root"> shipped empty — search crawlers
   and AI answer engines that don't execute JS saw nothing. React replaces this
   markup on mount, so users get the identical interactive page. */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const htmlPath = path.join(root, 'dist', 'index.html')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')

if (!fs.existsSync(ssrEntry)) {
  console.error(`[prerender] SSR bundle missing: ${ssrEntry}`)
  process.exit(1)
}

const { render } = await import(pathToFileURL(ssrEntry).href)
const appHtml = render()

const html = fs.readFileSync(htmlPath, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) {
  console.error('[prerender] could not find an empty <div id="root"></div> in dist/index.html')
  process.exit(1)
}

fs.writeFileSync(htmlPath, html.replace(marker, `<div id="root">${appHtml}</div>`), 'utf8')

const text = appHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
console.log(
  `[prerender] injected ${(appHtml.length / 1024).toFixed(1)} KB of markup ` +
    `(~${text.split(' ').length} words of text) into dist/index.html`,
)
