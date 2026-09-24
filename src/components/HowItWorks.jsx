import { useRef } from 'react'
import { m, useScroll, useSpring } from 'motion/react'
import Reveal from './ui/Reveal'
import { BagIcon, SearchIcon, WhatsAppIcon } from './ui/icons'

const STEPS = [
  { icon: SearchIcon, title: 'Elegí', text: 'Filtrá por marca y encontrá lo que buscás entre todo el catálogo de las embajadas.' },
  { icon: BagIcon, title: 'Armá tu carrito', text: 'Sumá productos de distintas marcas en un mismo pedido y ajustá las cantidades como quieras.' },
  { icon: WhatsAppIcon, title: 'Confirmá por WhatsApp', text: 'Dejá tu nombre y teléfono: se abre un chat con el pedido listo y te pasamos precios y stock. Sin registros.' },
]

export default function HowItWorks() {
  const ref = useRef(null)
  // La línea que une los pasos se "dibuja" a medida que scrolleás
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="como-comprar" className="border-y border-line bg-ink-2/60 py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-8 bg-accent" /> Cómo comprar <span className="h-px w-8 bg-accent" />
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Tres pasos. Cero vueltas.</h2>
        </Reveal>

        <div ref={ref} className="relative mt-12">
          {/* Línea horizontal (escritorio) */}
          <div aria-hidden className="absolute left-[16.6%] right-[16.6%] top-[3.25rem] hidden h-px bg-line md:block">
            <m.div style={{ scaleX: progress }} className="h-full origin-left bg-gradient-to-r from-accent to-wa" />
          </div>
          {/* Línea vertical (celular) */}
          <div aria-hidden className="absolute bottom-10 left-[2.75rem] top-10 w-px bg-line md:hidden">
            <m.div style={{ scaleY: progress }} className="h-full origin-top bg-gradient-to-b from-accent to-wa" />
          </div>

          <ol className="relative grid gap-4 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.12}
                className="group relative flex gap-5 rounded-3xl border border-line p-5 transition-colors duration-500 hover:border-line-strong hover:bg-white/[0.02] md:block md:p-7"
              >
                <div className="flex shrink-0 items-center justify-between md:justify-center">
                  <span className="relative grid size-12 place-items-center rounded-2xl bg-ink-3 text-fg ring-1 ring-line transition-all duration-500 ease-out-quint group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                </div>
                <div className="md:mt-6 md:text-center">
                  <span className="text-xs font-bold text-accent tabular-nums">Paso 0{i + 1}</span>
                  <h3 className="mt-1 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
