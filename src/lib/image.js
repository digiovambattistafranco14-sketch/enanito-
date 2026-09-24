// Cada foto existe en 4 tamaños y 2 formatos (ver scripts/optimize-images.mjs):
//   nombre-xs (360px) · nombre-sm (640px) · nombre-md (1000px) · nombre (1400px), en .avif y .webp
// Con srcset + sizes el navegador descarga solo el tamaño justo; con <picture> (ui/Picture.jsx)
// elige AVIF si lo soporta. Usá siempre <Picture> para mostrar fotos.

const variant = (src, suffix) => src.replace(/\.webp$/, `${suffix}.webp`)

export const thumb = (src) => variant(src, '-xs')

export const responsive = (src, sizes) => ({
  src: variant(src, '-sm'),
  srcSet: `${variant(src, '-xs')} 360w, ${variant(src, '-sm')} 640w, ${variant(src, '-md')} 1000w, ${src} 1400w`,
  sizes,
})

/** Mismo juego de tamaños en AVIF (para <source type="image/avif">). */
export const avifSrcSet = (src) =>
  [['-xs', 360], ['-sm', 640], ['-md', 1000], ['', 1400]]
    .map(([suffix, w]) => `${src.replace(/\.webp$/, `${suffix}.avif`)} ${w}w`)
    .join(', ')

export const SIZES = {
  card: '(min-width: 1280px) 300px, (min-width: 1024px) 33vw, 50vw',
  half: '(min-width: 768px) 50vw, 100vw',
  collage: '(min-width: 1024px) 280px, 46vw',
  gallery: '(min-width: 1024px) 45vw, 90vw',
}
