import { Suspense, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Brands from './components/Brands'
import HowItWorks from './components/HowItWorks'
import Shop from './components/Shop'
import Footer from './components/Footer'
import CartFab from './components/cart/CartFab'
import Toast from './components/cart/Toast'
import { useCart } from './context/CartContext'
import { useScrollTo } from './context/SmoothScroll'
import { CartDrawer, preloadOverlays } from './lib/lazy'

export default function App() {
  const [brandFilter, setBrandFilter] = useState('all')
  const [cartMounted, setCartMounted] = useState(false)
  const { isOpen } = useCart()
  const scrollTo = useScrollTo()

  useEffect(() => {
    if (isOpen) setCartMounted(true)
  }, [isOpen])

  useEffect(() => {
    preloadOverlays()
  }, [])

  const showBrand = (brandId) => {
    setBrandFilter(brandId)
    scrollTo('#tienda')
  }

  return (
    <>
      <Navbar />
      {/* Cada <Suspense> es un bloque que React activa por separado al cargar:
          el celular no se traba procesando toda la página de una sola vez. */}
      <main>
        <Hero />
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
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <CartFab />
      {cartMounted && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}
      <Toast />
    </>
  )
}
