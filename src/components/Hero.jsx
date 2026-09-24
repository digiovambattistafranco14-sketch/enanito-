import { useRef } from 'react'
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { SITE } from '../config/site'
import { BRANDS } from '../data/brands'
import { PRODUCTS } from '../data/products'
import { useScrollTo } from '../context/SmoothScroll'
import { responsive, SIZES } from '../lib/image'
import CountUp from './ui/CountUp'
import Magnetic from './ui/Magnetic'
import { ArrowRightIcon, InstagramIcon } from './ui/icons'
import Marquee from './Marquee'

const COLLAGE = [
  { src: '/products/apache/camiseta-faa.webp', alt: 'Camiseta Argentina bordada F.A.A.', className: 'left-0 top-10 w-[46%] -rotate-6', depth: 60, mouse: 18, float: '0s', delay: 0.45 },
  { src: '/products/reco/botas-rocky-negras.webp', alt: 'Botas tácticas Rocky', className: 'right-0 top-0 w-[50%] rotate-3', depth: 120, mouse: 30, float: '-2s', delay: 0.58 },
  { src: '/products/zoe/nike-cortez.webp', alt: 'Nike Cortez', className: 'left-[24%] bottom-0 w-[44%] rotate-[-1deg]', depth: 30, mouse: 12, float: '-4s', delay: 0.7 },
]

// La entrada del hero usa clases CSS (.hero-*, ver index.css): el texto se pinta
// en el primer frame, sin esperar a que cargue el JavaScript de animaciones.
const delay = (s) => ({ '--d': `${s}s` })

export default function Hero() {
  const ref = useRef(null)
  const scrollTo = useScrollTo()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const lift = useTransform(scrollYProgress, [0, 1], [0, -80])

  // Posición del mouse (-0.5 a 0.5) para el parallax del collage
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 })
  const my = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 })
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  return (
    <section id="inicio" ref={ref} onPointerMove={onPointerMove} className="relative isolate overflow-hidden pt-28 sm:pt-36">
      {/* Fondo: brillo rojo + grilla */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-accent/25 blur-[110px] sm:size-[42rem] sm:blur-[140px]" />
        <div className="absolute -right-40 top-40 hidden size-[30rem] rounded-full bg-[#4f7bff]/10 blur-[120px] sm:block" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)] sm:bg-[size:72px_72px]" />
      </div>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <m.div style={{ opacity: fade, y: lift }}>
          <span className="hero-rise glass inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-xs font-semibold text-fg/90">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Embajador oficial · {BRANDS.length} marcas aliadas
          </span>

          <h1 className="mt-6 text-[clamp(3rem,13.5vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] sm:mt-7">
            {['El Enanito', 'Ordoni'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block" style={delay(0.05 + i * 0.1)}>
                  {i === 1 ? (
                    <>
                      {line}
                      <span className="inline-block italic text-accent">
                        {'eee'.split('').map((ch, j) => (
                          <span key={j} className="hero-pop" style={delay(0.5 + j * 0.08)}>
                            {ch}
                          </span>
                        ))}
                      </span>
                    </>
                  ) : (
                    <span className="text-gradient">{line}</span>
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-slide mt-6 max-w-xl text-[15px] leading-relaxed text-muted sm:mt-7 sm:text-lg">
            Creador de contenido desde {SITE.region} y cara visible de las marcas que la rompen: tecnología importada,
            seguridad laboral, equipamiento táctico y la camiseta de la Selección.{' '}
            <span className="text-fg">Todo en un solo lugar, con pedido directo por WhatsApp.</span>
          </p>

          <div style={delay(0.3)} className="hero-rise mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic className="w-full sm:w-auto">
              <button
                onClick={() => scrollTo('#tienda')}
                className="group relative inline-flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-7 text-sm font-bold text-white shadow-[0_10px_40px_-10px] shadow-accent/70 transition-shadow duration-300 hover:shadow-accent active:scale-[0.97] sm:w-auto"
              >
                {/* brillo que cruza el botón */}
                <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 ease-out-quint group-hover:translate-x-[320%]" />
                <span className="relative">Ir a la tienda</span>
                <ArrowRightIcon className="relative size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic strength={0.2} className="w-full sm:w-auto">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="glass group inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full px-6 text-sm font-semibold transition-colors duration-300 hover:border-line-strong hover:bg-white/10 active:scale-[0.97] sm:w-auto"
              >
                <InstagramIcon className="size-4.5 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
                {SITE.handle}
              </a>
            </Magnetic>
          </div>

          <dl style={delay(0.45)} className="hero-rise mt-10 grid max-w-md grid-cols-3 divide-x divide-line border-t border-line pt-6 sm:mt-12"
          >
            {[
              [<CountUp key="b" to={BRANDS.length} />, 'Embajadas'],
              [<CountUp key="p" to={PRODUCTS.length} suffix="+" />, 'Productos'],
              ['24/7', 'Pedidos web'],
            ].map(([value, label]) => (
              <div key={label} className="px-3 first:pl-0 sm:px-4">
                <dt className="text-xs text-subtle">{label}</dt>
                <dd className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </m.div>

        <Collage progress={scrollYProgress} mx={mx} my={my} />
      </div>

      <div className="mt-16 sm:mt-28">
        <Marquee />
      </div>
    </section>
  )
}

function Collage({ progress, mx, my }) {
  return (
    <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[25rem] sm:max-w-[34rem]">
      {COLLAGE.map((item, i) => (
        <CollageCard key={item.src} item={item} progress={progress} mx={mx} my={my} priority={i === 0} />
      ))}
      <div
        style={delay(0.9)}
        className="hero-rise glass absolute -bottom-2 right-0 z-10 flex items-center gap-3 rounded-2xl px-4 py-3 sm:right-6"
      >
        <span className="flex -space-x-1.5">
          {BRANDS.map((b) => (
            <span key={b.id} className="size-5 rounded-full ring-2 ring-ink" style={{ background: b.accent }} />
          ))}
        </span>
        <span className="text-xs font-semibold leading-tight">
          Zoe · NG · Reco · Apache
          <span className="block font-medium text-subtle">Alianzas oficiales</span>
        </span>
      </div>
    </div>
  )
}

function CollageCard({ item, progress, mx, my, priority }) {
  const scrollY = useTransform(progress, [0, 1], [0, -item.depth])
  const mouseX = useTransform(mx, (v) => v * item.mouse)
  const mouseY = useTransform(my, (v) => v * item.mouse)
  const y = useTransform([scrollY, mouseY], ([a, b]) => a + b)

  return (
    <m.figure style={{ y, x: mouseX }} className={`absolute hover:z-20 ${item.className}`}>
      <div className="hero-card" style={delay(item.delay)}>
        <div
          className="group animate-float overflow-hidden rounded-[1.4rem] border border-line-strong bg-ink-2 p-1 shadow-2xl shadow-black/60 sm:rounded-[1.6rem] sm:p-1.5"
          style={{ animationDelay: item.float }}
        >
          <img
            {...responsive(item.src, SIZES.collage)}
            alt={item.alt}
            width="640"
            height="800"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="aspect-[4/5] w-full rounded-[1.1rem] object-cover transition-transform duration-700 ease-out-quint group-hover:scale-105 sm:rounded-[1.25rem]"
          />
        </div>
      </div>
    </m.figure>
  )
}
