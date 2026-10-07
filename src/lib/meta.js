import { SITE } from '../config/site'
import { BRAND_BY_ID } from '../data/brands'
import { PRODUCTS } from '../data/products'
import { matchProduct } from '../context/Router'
import { avifSrcSet, SIZES } from './image'

const HOME = {
  title: 'El Enanito Ordonieee · Embajador Oficial',
  description:
    'Portal oficial de El Enanito Ordonieee, embajador de Zoe Importaciones, NG Consultora, Reco.tactika y Apache Indumentaria. Armá tu pedido y confirmalo por WhatsApp.',
  // `ogSource` es la foto con la que el build arma la imagen para compartir (/og/<nombre>.jpg)
  ogName: 'inicio',
  ogSource: '/products/reco/stand-tactika.webp',
}

// Las vistas previas de WhatsApp/Facebook necesitan la URL completa de la imagen
const absolute = (path) => `${SITE.url}${path}`

/** Título, descripción e imagen para compartir de cada página (pestaña, Google y vista previa de WhatsApp). */
export function pageMeta(path) {
  const id = matchProduct(path)
  const product = id && PRODUCTS.find((p) => p.id === id)
  if (!product) {
    const home = { ...HOME, image: absolute('/og/inicio.jpg'), url: absolute('/') }
    return path === '/' ? home : { ...home, title: `Página no encontrada · ${SITE.name}` }
  }
  const brand = BRAND_BY_ID[product.brand]
  return {
    title: `${product.name} · ${brand.name} | ${SITE.name}`,
    description: brand.formal
      ? `${product.description} Consultá por WhatsApp.`
      : `${product.description} Pedilo por WhatsApp en la tienda oficial de ${SITE.name}.`,
    image: absolute(`/og/${product.id}.jpg`),
    ogName: product.id,
    ogSource: product.images[0],
    url: absolute(path),
    // Foto principal de la galería: se precarga en el <head> de la página del producto
    preload: { srcSet: avifSrcSet(product.images[0]), sizes: SIZES.gallery },
  }
}
