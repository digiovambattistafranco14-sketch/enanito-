// Pre-render: genera el HTML completo de cada página dentro de dist/.
//   /                   → dist/index.html
//   /producto/<id>/     → dist/producto/<id>/index.html
// Así el contenido se ve apenas llega el HTML (sin esperar al JavaScript), Google lo indexa
// y el link de cada producto muestra su foto al compartirlo por WhatsApp.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = `${root}dist`
const { render, routes } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)

let template = await readFile(`${dist}/index.html`, 'utf-8')
if (!template.includes('<div id="root"></div>')) throw new Error('No se encontró <div id="root"></div> en dist/index.html')

// CSS en línea: el navegador puede pintar sin esperar otra descarga (clave en 4G lenta)
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) template = template.replace(cssLink[0], `<style>${await readFile(`${dist}${cssLink[1]}`, 'utf-8')}</style>`)

// La precarga de la foto de la historia solo sirve en el inicio
const heroPreload = template.match(/\s*<!-- Foto de la primera historia[\s\S]*?\/>/)?.[0] ?? ''

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function withHead(html, meta, url) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(meta.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escape(meta.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escape(meta.description)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${meta.image}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${url === '/' ? 'website' : 'product'}$2`)
    .replace(
      '</head>',
      // Con dominio configurado (SITE.url) se agregan la URL canónica y la de la vista previa
      meta.url.startsWith('http')
        ? `  <link rel="canonical" href="${meta.url}" />
    <meta property="og:url" content="${meta.url}" />
  </head>`
        : '</head>',
    )
}

for (const url of routes) {
  const { html, meta } = render(url)
  let page = withHead(template.replace('<div id="root"></div>', `<div id="root">${html}</div>`), meta, url)
  if (url !== '/') {
    // En cada producto se precarga su propia foto en lugar de la de la historia del inicio
    const preload = meta.preload
      ? `
    <link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${meta.preload.srcSet}" imagesizes="${meta.preload.sizes}" />`
      : ''
    page = page.replace(heroPreload, preload)
  }
  const file = url === '/' ? `${dist}/index.html` : `${dist}${url}index.html`
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page)
}

await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`✓ Pre-render listo: ${routes.length} páginas (inicio + ${routes.length - 1} productos)`)
