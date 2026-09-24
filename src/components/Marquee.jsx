import { useRef } from 'react'
import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { BRANDS } from '../data/brands'

const WORDS = BRANDS.flatMap((b) => [
  { text: b.name, color: b.accent },
  { text: b.category.split(' · ')[0], color: null },
])

const BASE_SPEED = 2.2 // % del ancho por segundo
const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/**
 * Cinta infinita con las marcas. Se acelera y se inclina según la velocidad del scroll,
 * y se detiene cuando no está en pantalla para no gastar batería.
 */
export default function Marquee() {
  const ref = useRef(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const baseX = useMotionValue(0)

  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-2500, 0, 2500], [6, 0, 6], { clamp: false })
  const skewX = useTransform(velocity, [-2500, 2500], [7, -7])
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const hovering = useRef(false)

  useAnimationFrame((_, delta) => {
    if (!inView || reduced) return
    const speed = hovering.current ? 0.25 : 1 + Math.abs(boost.get())
    baseX.set(baseX.get() - BASE_SPEED * speed * (delta / 1000))
  })

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      className="mask-fade-x relative flex overflow-hidden border-y border-line py-5"
    >
      <m.ul style={{ x, skewX }} className="flex w-max shrink-0 items-center will-change-transform">
        {[...WORDS, ...WORDS].map((w, i) => (
          <li key={i} className="flex items-center gap-8 whitespace-nowrap pr-8 sm:gap-10 sm:pr-10">
            <span
              className={`text-xl font-extrabold uppercase tracking-tight sm:text-3xl ${w.color ? '' : 'text-white/25'}`}
              style={w.color ? { color: w.color } : undefined}
            >
              {w.text}
            </span>
            <span className="size-2 rotate-45 bg-accent/80" />
          </li>
        ))}
      </m.ul>
    </div>
  )
}
