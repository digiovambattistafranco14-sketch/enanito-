import { useCallback, useRef, useState } from 'react'
import { useAnimationFrame, useInView, useMotionValue, useReducedMotion } from 'motion/react'

export const STORY_DURATION = 5 // segundos por marca

/**
 * Temporizador de las historias del inicio (estilo Instagram).
 * - Avanza solo mientras el bloque está en pantalla (ahorra batería).
 * - Se pausa con `paused.current = true` (mantener apretado / mouse encima).
 * - Con "reducir movimiento" no avanza solo: se navega tocando.
 */
export default function useStory(count, containerRef) {
  const [active, setActive] = useState(0)
  const progress = useMotionValue(0)
  const paused = useRef(false)
  const inView = useInView(containerRef)
  const reduced = useReducedMotion()

  useAnimationFrame((_, delta) => {
    if (!inView || paused.current || reduced) return
    const next = progress.get() + Math.min(delta, 100) / (STORY_DURATION * 1000)
    if (next >= 1) {
      progress.set(0)
      setActive((i) => (i + 1) % count)
    } else {
      progress.set(next)
    }
  })

  const go = useCallback(
    (index) => {
      progress.set(0)
      setActive(((index % count) + count) % count)
    },
    [count, progress],
  )

  return { active, go, progress, paused }
}
