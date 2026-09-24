import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/** Número que cuenta desde 0 cuando entra en pantalla. Escribe directo en el DOM (sin re-renders). */
export default function CountUp({ to, suffix = '', duration = 1.4, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    if (reduced) {
      el.textContent = `${to}${suffix}`
      return
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 4)
      el.textContent = `${Math.round(eased * to)}${suffix}`
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, suffix, duration, reduced])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
