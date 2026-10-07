import { Suspense, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Brands from './components/Brands'
import HowItWorks from './components/HowItWorks'
import Shop from './components/Shop'
import Footer from './components/Footer'
import ProductPage from './components/product/ProductPage'
import CartFab from './components/cart/CartFab'
import Toast from './components/cart/Toast'
import { useCart } from './context/CartContext'
import { useRouter } from './context/Router'
import { useScrollTo } from './context/SmoothScroll'
import { pageMeta } from './lib/meta'
import { CartDrawer, preloadOverlays } from './lib/lazy'

export default function App() {
  const [brandFilter, setBrandFilter] = useState('all')
  const [cartMounted, setCartMounted] = useState(false)
  const { isOpen } = useCart()
  const { path, productId } = useRouter()
  const scrollTo = useScrollTo()

  useEffect(() => {
    if (isOpen) setCartMounted(true)
  }, [isOpen])

  useEffect(() => {
    preloadOverlays()
  }, [])

  // Título de la pestaña según la página
  useEffect(() => {
    document.title = pageMeta(path).title
  }, [path])

  const showBrand = (brandId) => {
    setBrandFilter(brandId)
    scrollTo('#tienda')
  }

  return (
    <>
      <Navbar />
      {/* Cualquier ruta que no sea el inicio va a ProductPage: si no es un producto
          válido, muestra el aviso de "no encontrado" (también es la página 404.html) */}
      {path !== '/' ? (
        <ProductPage productId={productId} onShowBrand={showBrand} />
      ) : (
        /* Cada <Suspense> es un bloque que React activa por separado al cargar:
           el celular no se traba procesando toda la página de una sola vez. */
        <main>
          <Hero onShowProducts={showBrand} />
          <Suspense fallback={null}>
            <Brands onShowProducts={showBrand} />
          </Suspense>
          <Suspense fallback={null}>
            <HowItWorks />
          </Suspense>
          <Suspense fallback={null}>
            <Shop filter={brandFilter} onFilterChange={setBrandFilter} />
          </Suspense>
        </main>
      )}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      {/* Espacio para que la barra fija del producto (celular) no tape el final del footer */}
      {productId && <div aria-hidden className="h-20 sm:hidden" />}
      {/* En la página de producto (celular) la barra fija de abajo reemplaza al botón flotante */}
      <CartFab className={productId ? 'max-sm:hidden' : ''} />
      {cartMounted && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}
      <Toast />
    </>
  )
}
