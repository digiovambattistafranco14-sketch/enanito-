import { useRef } from 'react'
import { AnimatePresence, m, useMotionValue, useScroll, useTransform } from 'motion/react'
import { SITE } from '../config/site'
import { BRANDS } from '../data/brands'
import { PRODUCTS } from '../data/products'
import { useScrollTo } from '../context/SmoothScroll'
import HeroStory from './hero/HeroStory'
import useStory from './hero/useStory'
import CountUp from './ui/CountUp'
import Magnetic from './ui/Magnetic'
import { ArrowRightIcon, InstagramIcon } from './ui/icons'
import Marquee from './Marquee'

const EASE = [0.22, 1, 0.36, 1]

// La entrada del hero usa clases CSS (.hero-*, ver index.css): el texto se pinta
// en el primer frame, sin esperar a que cargue el JavaScript de animaciones.
const delay = (s) => ({ '--d': `${s}s` })

export default function Hero({ onShowProducts }) {
  const ref = useRef(null)
  const storyRef = useRef(null)
  const scrollTo = useScrollTo()
  const story = useStory(BRANDS.length, storyRef)
  const brand = BRANDS[story.active]

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const lift = useTransform(scrollYProgress, [0, 1], [0, -90])

  // Posición del mouse (-0.5 a 0.5) para la inclinación 3D de la historia
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }
  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      id="inicio"
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate flex flex-col overflow-hidden pt-24 sm:pt-32 lg:min-h-[100svh] lg:pt-28"
    >
      {/* Fondo: brillo rojo fijo + brillo del color de la marca activa + grilla */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-48 -top-48 size-[32rem] rounded-full bg-accent/25 blur-[110px] sm:size-[44rem] sm:blur-[150px]" />
        <m.div
          initial={false}
          animate={{ backgroundColor: brand.accent }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute -right-24 top-[35%] size-[26rem] rounded-full opacity-20 blur-[100px] sm:top-[12%] sm:size-[38rem] sm:blur-[140px] lg:right-[2%]"
          style={{ backgroundColor: BRANDS[0].accent }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_40%_30%,#000_30%,transparent_75%)] sm:bg-[size:72px_72px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="container-x grid flex-1 items-center gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-[1fr_auto] lg:gap-y-8">
        {/* Texto principal */}
        <m.div style={{ opacity: fade, y: lift }} className="relative z-10 lg:col-start-1 lg:row-start-1 lg:self-end">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="hero-rise glass group inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-xs font-semibold text-fg/90 transition-colors hover:border-line-strong"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
              </span>
              Creador
            </span>
            {SITE.region}
            <ArrowRightIcon className="size-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1 className="mt-6 text-[clamp(2.6rem,14vw,5.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.05em] sm:mt-8 lg:text-[clamp(4.5rem,7.4vw,8rem)]">
            <span className="block overflow-hidden whitespace-nowrap pb-[0.07em]">
              <span className="hero-line block" style={delay(0.05)}>
                <span className="text-gradient">El Enanito</span>
              </span>
            </span>
            <span className="block overflow-hidden whitespace-nowrap pb-[0.07em]">
              <span className="hero-line block" style={delay(0.15)}>
                Ordoni
                <span className="italic text-accent">
                  {'eee'.split('').map((ch, j) => (
                    <span key={j} className="hero-pop" style={delay(0.5 + j * 0.08)}>
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h1>

          {/* "Embajador oficial de ___" sincronizado con la historia */}
          <p className="hero-rise mt-5 text-lg font-semibold tracking-tight text-muted sm:mt-7 sm:text-2xl" style={delay(0.3)}>
            Embajador oficial de <br className="sm:hidden" />
            <span className="relative inline-grid overflow-hidden align-bottom">
              <AnimatePresence initial={false}>
                <m.span
                  key={brand.id}
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-105%' }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="col-start-1 row-start-1 whitespace-nowrap font-extrabold"
                  style={{ color: brand.accent }}
                >
                  {brand.name}
                </m.span>
              </AnimatePresence>
            </span>
          </p>

          <p className="hero-slide mt-4 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base" style={delay(0.35)}>
            Tecnología importada, seguridad laboral, equipo táctico y la camiseta de la Selección.{' '}
            <span className="text-fg">Todo en un solo lugar, con pedido directo por WhatsApp.</span>
          </p>

          <div className="hero-rise mt-7 flex items-center gap-3 sm:mt-9" style={delay(0.42)}>
            <Magnetic className="flex-1 sm:flex-none">
              <button
                onClick={() => scrollTo('#tienda')}
                className="group relative inline-flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-7 text-sm font-bold text-white shadow-[0_12px_40px_-12px] shadow-accent transition-shadow duration-300 hover:shadow-[0_16px_50px_-10px] active:scale-[0.97] sm:w-auto sm:px-8"
              >
                <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 ease-out-quint group-hover:translate-x-[320%]" />
                <span className="relative">Ir a la tienda</span>
                <ArrowRightIcon className="relative size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={`Instagram ${SITE.handle}`}
                className="glass group inline-flex size-13 items-center justify-center gap-2.5 rounded-full text-sm font-semibold transition-colors duration-300 hover:border-line-strong hover:bg-white/10 active:scale-[0.97] sm:w-auto sm:px-6"
              >
                <InstagramIcon className="size-5 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 sm:size-4.5" />
                <span className="hidden sm:inline">{SITE.handle}</span>
              </a>
            </Magnetic>
          </div>
        </m.div>

        {/* Historia de las embajadas */}
        <div ref={storyRef} className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-[25rem] lg:self-center">
          <HeroStory story={story} mx={mx} my={my} onShowProducts={onShowProducts} />
        </div>

        {/* Prueba social */}
        <div className="hero-rise lg:col-start-1 lg:row-start-2 lg:self-start" style={delay(0.5)}>
        <m.div
          style={{ opacity: fade }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 border-t border-line pt-6 sm:justify-start lg:border-0 lg:pt-0"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {BRANDS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => story.go(i)}
                  aria-label={`Ver ${b.name}`}
                  className={`grid size-9 place-items-center rounded-full border-2 border-ink text-[11px] font-extrabold text-ink transition-transform duration-300 hover:z-10 hover:-translate-y-1 ${
                    i === story.active ? 'z-10 -translate-y-1 ring-2 ring-white/70' : ''
                  }`}
                  style={{ background: b.accent }}
                >
                  {b.short[0]}
                </button>
              ))}
            </div>
            <p className="text-sm leading-tight">
              <span className="font-bold">
                <CountUp to={BRANDS.length} /> embajadas oficiales
              </span>
              <span className="block text-subtle">Zoe · NG · Reco · Apache</span>
            </p>
          </div>
          <div className="hidden h-9 w-px bg-line sm:block" />
          <p className="text-sm leading-tight max-sm:hidden">
            <span className="font-bold">
              <CountUp to={PRODUCTS.length} suffix="+" /> productos
            </span>
            <span className="block text-subtle">Pedidos web 24/7</span>
          </p>
        </m.div>
        </div>
      </div>

      <div className="mt-14 sm:mt-20 lg:mt-12">
        <Marquee />
      </div>
    </section>
  )
}
