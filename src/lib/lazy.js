import { lazy } from 'react'

// El carrito no se ve al entrar: se carga aparte para que la primera pantalla
// aparezca más rápido.
const loaders = {
  cart: () => import('../components/cart/CartDrawer'),
}

export const CartDrawer = lazy(loaders.cart)

/** Precarga en un momento libre del navegador, así abre al instante. */
export function preloadOverlays() {
  const run = () => Object.values(loaders).forEach((load) => load())
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}
