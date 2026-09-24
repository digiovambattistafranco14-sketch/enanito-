// Pre-render: mete el HTML de la página dentro de dist/index.html.
// Así el contenido se ve apenas llega el HTML, sin esperar al JavaScript.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const indexPath = `${root}dist/index.html`
const serverEntry = pathToFileURL(`${root}dist-ssr/entry-server.js`).href

const { render } = await import(serverEntry)
const html = render()
const template = await readFile(indexPath, 'utf-8')

if (!template.includes('<div id="root"></div>')) throw new Error('No se encontró <div id="root"></div> en dist/index.html')

// CSS en línea: el navegador puede pintar sin esperar otra descarga (clave en 4G lenta)
let page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
const cssLink = page.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(`${root}dist${cssLink[1]}`, 'utf-8')
  page = page.replace(cssLink[0], `<style>${css}</style>`)
}

await writeFile(indexPath, page)
await rm(`${root}dist-ssr`, { recursive: true, force: true })

console.log(`✓ Pre-render listo (${(html.length / 1024).toFixed(0)} KB de HTML)`)
