// Optimiza las fotos de /public/products:
//  1. Convierte cada .jpg/.jpeg/.png a .webp (máx. 1400px, calidad 78) y borra el original.
//  2. Genera versiones más chicas para que cada pantalla baje solo lo que necesita:
//     "-xs" (360px), "-sm" (640px) y "-md" (1000px).
// Uso: npm run optimize
import { readdir, unlink, stat, access } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('../public/products/', import.meta.url))
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png'])
const LARGE = 1400
const VARIANTS = [
  { suffix: '-xs', width: 360, quality: 70 },
  { suffix: '-sm', width: 640, quality: 72 },
  { suffix: '-md', width: 1000, quality: 75 },
]
const isVariant = (f) => VARIANTS.some((v) => f.endsWith(`${v.suffix}.webp`))

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  )
  return files.flat()
}

const exists = (f) => access(f).then(() => true, () => false)
const kb = async (f) => ((await stat(f)).size / 1024) | 0
const rel = (f) => f.split(/[\\/]products[\\/]/)[1]

let converted = 0
let thumbs = 0

// 1. Originales → .webp grande
for (const file of (await walk(ROOT)).filter((f) => SOURCE_EXT.has(extname(f).toLowerCase()))) {
  const out = file.slice(0, -extname(file).length) + '.webp'
  const before = await kb(file)
  await sharp(file)
    .rotate()
    .resize({ width: LARGE, height: LARGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(out)
  await unlink(file)
  converted++
  console.log(`✓ ${rel(out)}  ${before}KB → ${await kb(out)}KB`)
}

// 2. .webp grande → variantes (solo las que faltan)
for (const file of (await walk(ROOT)).filter((f) => f.endsWith('.webp') && !isVariant(f))) {
  for (const { suffix, width, quality } of VARIANTS) {
    const out = file.replace(/\.webp$/, `${suffix}.webp`)
    if (await exists(out)) continue
    await sharp(file)
      .resize({ width, height: Math.round(width * 1.6), fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(out)
    thumbs++
    console.log(`✓ ${rel(out)}  ${await kb(out)}KB`)
  }
}

console.log(
  converted || thumbs
    ? `\n${converted} imágenes convertidas · ${thumbs} miniaturas generadas`
    : 'Todo optimizado, no hay imágenes nuevas.',
)
