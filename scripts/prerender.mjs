// Pre-render: genera dentro de dist/ todo lo que se puede dejar listo en el build.
//   /                   → dist/index.html
//   /producto/<id>/     → dist/producto/<id>/index.html
//   404.html            → página de "no encontrado"
//   /og/<nombre>.jpg    → imagen 1200×630 para la vista previa al compartir (WhatsApp, Instagram…)
//   sitemap.xml y robots.txt
// Así el contenido se ve apenas llega el HTML (sin esperar al JavaScript), Google lo indexa
// y el link de cada producto muestra su foto al compartirlo.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = `${root}dist`
const { render, routes, siteUrl } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)

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
      `  <link rel="canonical" href="${meta.url}" />\n    <meta property="og:url" content="${meta.url}" />\n  </head>`,
    )
}

const page = (html) => template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

/** Imagen para compartir: la foto entera centrada sobre una versión desenfocada de sí misma. */
async function ogImage(source, name) {
  const file = `${root}public${source}`
  const [W, H] = [1200, 630]
  const background = await sharp(file).resize(W, H, { fit: 'cover' }).blur(28).modulate({ brightness: 0.75 }).toBuffer()
  const photo = await sharp(file).resize(W, H, { fit: 'inside' }).toBuffer()
  await sharp(background)
    .composite([{ input: photo, gravity: 'centre' }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${dist}/og/${name}.jpg`)
}

await mkdir(`${dist}/og`, { recursive: true })

for (const url of routes) {
  const { html, meta } = render(url)
  let out = withHead(page(html), meta, url)
  if (url !== '/') {
    // En cada producto se precarga su propia foto en lugar de la de la historia del inicio
    const preload = meta.preload
      ? `
    <link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${meta.preload.srcSet}" imagesizes="${meta.preload.sizes}" />`
      : ''
    out = out.replace(heroPreload, preload)
  }
  const file = url === '/' ? `${dist}/index.html` : `${dist}${url}index.html`
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, out)
  await ogImage(meta.ogSource, meta.ogName)
}

// 404.html: Vercel la sirve sola para cualquier dirección que no exista
const notFound = page(render('/404/').html)
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Página no encontrada · El Enanito Ordonieee</title>')
  .replace(heroPreload, '')
  .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
await writeFile(`${dist}/404.html`, notFound)

// sitemap.xml + robots.txt
const today = new Date().toISOString().slice(0, 10)
await writeFile(
  `${dist}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((url) => `  <url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod><priority>${url === '/' ? '1.0' : '0.7'}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
)
await writeFile(`${dist}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)

await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`✓ Pre-render listo: ${routes.length} páginas (inicio + ${routes.length - 1} productos), 404, sitemap e imágenes para compartir`)
