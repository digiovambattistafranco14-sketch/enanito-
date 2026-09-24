import { useRef } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 }

/** El contenido "se pega" al cursor al pasar cerca (solo con mouse; en touch no hace nada). */
export default function Magnetic({ strength = 0.3, className, children }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x, y }} className={className}>
      {children}
    </m.div>
  )
}
