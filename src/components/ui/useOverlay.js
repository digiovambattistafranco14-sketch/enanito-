import { useEffect, useState } from 'react'
import { useScrollLock } from '../../context/SmoothScroll'

/** Comportamiento común de modales y paneles: bloquear scroll y cerrar con Escape. */
export default function useOverlay(open, onClose) {
  useScrollLock(open)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

/** true en pantallas táctiles (celulares/tablets): habilita gestos de deslizar. */
export function useIsTouch() {
  const [touch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
  return touch
}
