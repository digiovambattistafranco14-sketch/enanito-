import { renderToString } from 'react-dom/server'
import Root from './Root'

/** Genera el HTML de la página en el build (ver scripts/prerender.mjs). */
export function render() {
  return renderToString(<Root />)
}
