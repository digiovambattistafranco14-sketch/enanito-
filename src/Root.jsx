import { StrictMode } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import App from './App'
import { CartProvider } from './context/CartContext'
import { SmoothScrollProvider } from './context/SmoothScroll'

const loadMotionFeatures = () => import('./lib/motion-features').then((mod) => mod.default)

/** Árbol completo de la app. Lo usan el navegador (main.jsx) y el pre-render (entry-server.jsx). */
export default function Root() {
  return (
    <StrictMode>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <SmoothScrollProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </SmoothScrollProvider>
        </MotionConfig>
      </LazyMotion>
    </StrictMode>
  )
}
