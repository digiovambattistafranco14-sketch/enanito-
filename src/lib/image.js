// Cada foto existe en 4 tamaños (ver scripts/optimize-images.mjs):
//   nombre-xs.webp (360px) · nombre-sm.webp (640px) · nombre-md.webp (1000px) · nombre.webp (1400px)
// Con srcset + sizes el navegador descarga solo el tamaño justo para cada pantalla.

const variant = (src, suffix) => src.replace(/\.webp$/, `${suffix}.webp`)

export const thumb = (src) => variant(src, '-xs')

export const responsive = (src, sizes) => ({
  src: variant(src, '-sm'),
  srcSet: `${variant(src, '-xs')} 360w, ${variant(src, '-sm')} 640w, ${variant(src, '-md')} 1000w, ${src} 1400w`,
  sizes,
})

export const SIZES = {
  card: '(min-width: 1280px) 300px, (min-width: 1024px) 33vw, 50vw',
  half: '(min-width: 768px) 50vw, 100vw',
  collage: '(min-width: 1024px) 280px, 46vw',
}
