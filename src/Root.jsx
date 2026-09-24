import { StrictMode } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import App from './App'
import { CartProvider } from './context/CartContext'
import { RouterProvider } from './context/Router'
import { SmoothScrollProvider } from './context/SmoothScroll'

const loadMotionFeatures = () => import('./lib/motion-features').then((mod) => mod.default)

/**
 * Árbol completo de la app. Lo usan el navegador (main.jsx) y el pre-render (entry-server.jsx).
 * `url`: ruta a renderizar en el build; en el navegador se toma de la barra de direcciones.
 */
export default function Root({ url }) {
  return (
    <StrictMode>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <SmoothScrollProvider>
            <RouterProvider initialPath={url}>
              <CartProvider>
                <App />
              </CartProvider>
            </RouterProvider>
          </SmoothScrollProvider>
        </MotionConfig>
      </LazyMotion>
    </StrictMode>
  )
}
