import { useEffect, useState } from 'react'
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { SITE } from '../config/site'
import { BRANDS } from '../data/brands'
import { useCart } from '../context/CartContext'
import { useScrollTo } from '../context/SmoothScroll'
import useOverlay from './ui/useOverlay'
import { ArrowUpRightIcon, BagIcon, InstagramIcon } from './ui/icons'

const EASE = [0.22, 1, 0.36, 1]
const LINKS = [
  { href: '#embajadas', label: 'Embajadas' },
  { href: '#como-comprar', label: 'Cómo comprar' },
  { href: '#tienda', label: 'Tienda' },
]

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, open } = useCart()
  const scrollTo = useScrollTo()

  // Se esconde al bajar y reaparece al subir: más pantalla útil en el celular
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (Math.abs(y - prev) < 4) return
    setHidden(y > prev && y > 480)
  })

  // Al agregar un producto, la navbar vuelve a mostrarse (el producto "vuela" hacia el carrito)
  useEffect(() => setHidden(false), [count])

  useEffect(() => {
    document.documentElement.dataset.nav = hidden && !menuOpen ? 'hidden' : 'visible'
  }, [hidden, menuOpen])

  const go = (href) => (e) => {
    e.preventDefault()
    // Con el menú abierto el scroll está bloqueado: esperamos a que se libere
    setTimeout(() => scrollTo(href), menuOpen ? 80 : 0)
    setMenuOpen(false)
  }

  return (
    <>
      <m.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[45] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-soft to-accent"
      />

      <m.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? '-120%' : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
      >
        <div className="container-x">
          <nav
            className={`flex h-14 items-center justify-between rounded-2xl px-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 ease-out-quint sm:px-3 sm:pl-4 ${
              scrolled || menuOpen ? 'glass shadow-2xl shadow-black/40' : 'border border-transparent'
            }`}
          >
            <a href="#inicio" onClick={go(0)} className="group flex items-center gap-2.5">
              <span className="flex gap-1" aria-hidden>
                <span className="size-2.5 rounded-full bg-accent transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span className="size-2.5 rounded-full bg-accent transition-transform delay-75 duration-300 group-hover:-translate-y-0.5" />
              </span>
              <span className="text-sm font-extrabold tracking-tight">
                ENANITO <span className="text-muted">ORDONIEEE</span>
              </span>
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={go(l.href)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-fg"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={`Instagram ${SITE.handle}`}
                className="hidden size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg sm:grid"
              >
                <InstagramIcon className="size-5" />
              </a>
              <button
                data-cart-target
                onClick={open}
                aria-label={`Abrir carrito (${count} productos)`}
                className="relative flex h-10 items-center gap-2 rounded-full bg-white px-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:px-4"
              >
                <BagIcon className="size-4" />
                <span className="hidden sm:inline">Carrito</span>
                <m.span
                  key={count}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold leading-5 text-white tabular-nums"
                >
                  {count}
                </m.span>
              </button>
              <MenuButton open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
            </div>
          </nav>
        </div>
      </m.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} go={go} />
    </>
  )
}

function MenuButton({ open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={open}
      className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-white/5 md:hidden"
    >
      <span className="relative block h-3 w-5" aria-hidden>
        <m.span
          animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-fg"
        />
        <m.span
          animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-fg"
        />
      </span>
    </button>
  )
}

function MobileMenu({ open, onClose, go }) {
  useOverlay(open, onClose)

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ clipPath: 'inset(0 0 100% 0 round 0 0 32px 32px)' }}
          animate={{ clipPath: 'inset(0 0 0% 0 round 0 0 0px 0px)' }}
          exit={{ clipPath: 'inset(0 0 100% 0 round 0 0 32px 32px)' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-[46] flex flex-col bg-ink/95 px-6 pb-safe pt-28 backdrop-blur-xl md:hidden"
        >
          <div aria-hidden className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-accent/25 blur-[100px]" />
          <nav className="relative">
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <m.a
                    href={l.href}
                    onClick={go(l.href)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.12 + i * 0.07 }}
                    className="flex items-baseline gap-4 py-2 text-[clamp(2.2rem,11vw,3rem)] font-extrabold tracking-[-0.04em]"
                  >
                    <span className="text-xs font-semibold tracking-normal text-accent tabular-nums">0{i + 1}</span>
                    {l.label}
                  </m.a>
                </li>
              ))}
            </ul>
          </nav>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
            className="relative mt-auto space-y-5"
          >
            <div>
              <p className="eyebrow">Embajadas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {BRANDS.map((b) => (
                  <a
                    key={b.id}
                    href={b.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-sm font-medium"
                  >
                    <span className="size-2 rounded-full" style={{ background: b.accent }} />
                    {b.short}
                  </a>
                ))}
              </div>
            </div>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center justify-between rounded-2xl bg-white px-5 font-bold text-ink"
            >
              <span className="flex items-center gap-3">
                <InstagramIcon className="size-5" />
                {SITE.handle}
              </span>
              <ArrowUpRightIcon className="size-4" />
            </a>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
