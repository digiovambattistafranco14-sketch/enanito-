import { lazy } from 'react'

// El carrito y la vista de producto no se ven al entrar: se cargan aparte
// para que la primera pantalla aparezca más rápido.
const loaders = {
  cart: () => import('../components/cart/CartDrawer'),
  modal: () => import('../components/shop/ProductModal'),
}

export const CartDrawer = lazy(loaders.cart)
export const ProductModal = lazy(loaders.modal)

/** Precarga ambos en un momento libre del navegador, así abren al instante. */
export function preloadOverlays() {
  const run = () => Object.values(loaders).forEach((load) => load())
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}
