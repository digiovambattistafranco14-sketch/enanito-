import { renderToString } from 'react-dom/server'
import Root from './Root'
import { productPath } from './context/Router'
import { PRODUCTS } from './data/products'
import { pageMeta } from './lib/meta'

/** Todas las páginas que se generan en el build (ver scripts/prerender.mjs). */
export const routes = ['/', ...PRODUCTS.map((p) => productPath(p.id))]

/** HTML de una página + sus datos para <head>. */
export function render(url) {
  return { html: renderToString(<Root url={url} />), meta: pageMeta(url) }
}
