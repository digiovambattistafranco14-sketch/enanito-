import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

const ScrollContext = createContext(null)
const NAV_OFFSET = -80

/** Scroll inercial tipo Apple con Lenis. Se desactiva si el usuario prefiere menos movimiento. */
export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null)
  const frame = useRef()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
    const raf = (time) => {
      instance.raf(time)
      frame.current = requestAnimationFrame(raf)
    }
    frame.current = requestAnimationFrame(raf)
    setLenis(instance)

    return () => {
      cancelAnimationFrame(frame.current)
      instance.destroy()
    }
  }, [])

  return <ScrollContext.Provider value={lenis}>{children}</ScrollContext.Provider>
}

/** Devuelve scrollTo(selector | elemento | número, offset?) que funciona con o sin Lenis. */
export function useScrollTo() {
  const lenis = useContext(ScrollContext)
  return (target, offset = NAV_OFFSET) => {
    if (lenis) return lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : offset })
    if (typeof target === 'number') return window.scrollTo({ top: target, behavior: 'smooth' })
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

/** Frena el scroll de la página (por ejemplo con el carrito abierto). */
export function useScrollLock(locked) {
  const lenis = useContext(ScrollContext)
  useEffect(() => {
    if (!locked) return
    lenis?.stop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = prev
    }
  }, [locked, lenis])
}
