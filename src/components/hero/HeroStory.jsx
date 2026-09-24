import { useEffect, useState } from 'react'
import { AnimatePresence, m, useSpring, useTransform } from 'motion/react'
import { BRANDS } from '../../data/brands'
import { PRODUCTS } from '../../data/products'
import { responsive } from '../../lib/image'
import { ArrowRightIcon, InstagramIcon, WhatsAppIcon } from '../ui/icons'
import { STORY_DURATION } from './useStory'

const EASE = [0.22, 1, 0.36, 1]
// Mantener igual al <link rel="preload"> de index.html (la foto de la primera historia)
const SIZES = '(min-width: 1024px) 400px, (min-width: 640px) 360px, 80vw'

/**
 * Historia estilo Instagram con las 4 embajadas.
 * Tocar a la izquierda/derecha cambia de marca; mantener apretado pausa.
 */
export default function HeroStory({ story, mx, my, onShowProducts }) {
  const { active, go, progress, paused } = story
  const brand = BRANDS[active]
  const behind = [BRANDS[(active + 1) % BRANDS.length], BRANDS[(active + 2) % BRANDS.length]]

  // Inclinación 3D siguiendo al mouse (solo escritorio; en touch mx/my quedan en 0)
  const rotateY = useSpring(useTransform(mx, (v) => v * 14), { stiffness: 120, damping: 18 })
  const rotateX = useSpring(useTransform(my, (v) => v * -10), { stiffness: 120, damping: 18 })

  // Las tarjetas de atrás son decorativas: sus fotos se cargan después de la principal
  const [showBehind, setShowBehind] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowBehind(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const pause = () => (paused.current = true)
  const resume = () => (paused.current = false)

  return (
    <div className="relative mx-auto w-full max-w-[22.5rem] [perspective:1400px] sm:max-w-[24rem] lg:max-w-[25rem]">
      {/* Tarjetas de atrás: las próximas marcas */}
      {[0, 1].map((slot) => {
        const b = behind[slot]
        return (
          <div key={slot} aria-hidden className="hero-card absolute inset-0" style={{ zIndex: 1 - slot, '--d': `${0.35 + slot * 0.1}s` }}>
            <m.div
              initial={false}
              animate={{ rotate: slot === 0 ? 7 : -8, x: slot === 0 ? '9%' : '-9%', y: slot === 0 ? 14 : 26, scale: 0.9 - slot * 0.04 }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-ink-3 shadow-2xl shadow-black/60"
            >
              <AnimatePresence>
                {showBehind && (
                <m.img
                  key={b.id}
                  {...responsive(b.story.image, SIZES)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0 size-full object-cover"
                />
                )}
              </AnimatePresence>
            </m.div>
          </div>
        )
      })}

      {/* Sin animación de entrada a propósito: la foto principal es el elemento más grande
          de la pantalla (LCP) y tiene que pintarse completa desde el primer frame. */}
      <div className="relative z-10">
      <m.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && pause()}
        onPointerLeave={resume}
        className="relative"
      >
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/15 bg-ink-3 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] sm:aspect-[9/13]"
          onPointerDown={pause}
          onPointerUp={resume}
          onPointerCancel={resume}
        >
          {/* Foto con zoom lento tipo Ken Burns */}
          <AnimatePresence initial={false}>
            <m.img
              key={brand.id}
              {...responsive(brand.story.image, SIZES)}
              alt={`${brand.name}: ${brand.story.caption}`}
              fetchPriority={active === 0 ? 'high' : 'auto'}
              decoding="async"
              draggable={false}
              initial={{ opacity: 0, scale: 1.14 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.6, ease: 'easeOut' }, scale: { duration: STORY_DURATION + 1, ease: 'linear' } }}
              className="absolute inset-0 size-full select-none object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Barras de progreso */}
          <div className="absolute inset-x-3 top-3 z-20 flex gap-1.5">
            {BRANDS.map((b, i) => (
              <button
                key={b.id}
                onClick={() => go(i)}
                aria-label={`Ver ${b.name}`}
                className="group/seg relative h-4 flex-1 cursor-pointer"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/30 transition-colors group-hover/seg:bg-white/45">
                  <m.span
                    className="absolute inset-0 origin-left rounded-full bg-white"
                    style={{ scaleX: i === active ? progress : i < active ? 1 : 0 }}
                  />
                </span>
              </button>
            ))}
          </div>

          {/* Cabecera: avatar + usuario */}
          <div className="absolute inset-x-3 top-8 z-20 flex items-center justify-between">
            <a
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-full py-1 pr-2 transition-colors hover:bg-white/10"
            >
              <span className="rounded-full bg-[conic-gradient(from_200deg,#f9ce34,#ee2a7b,#6228d7,#f9ce34)] p-[2px]">
                <span className="grid size-8 place-items-center rounded-full border-2 border-black text-xs font-extrabold text-ink" style={{ background: brand.accent }}>
                  {brand.short[0]}
                </span>
              </span>
              <span className="leading-tight">
                <span className="block text-[13px] font-bold text-white">{brand.handle.replace('@', '')}</span>
                <span className="block text-[11px] font-medium text-white/70">Embajada oficial</span>
              </span>
            </a>
            <InstagramIcon className="size-5 text-white/80" />
          </div>

          {/* Zonas táctiles: anterior / siguiente */}
          <button aria-label="Marca anterior" onClick={() => go(active - 1)} className="absolute bottom-40 left-0 top-20 z-10 w-1/3 cursor-w-resize" />
          <button aria-label="Marca siguiente" onClick={() => go(active + 1)} className="absolute bottom-40 right-0 top-20 z-10 w-2/3 cursor-e-resize" />

          {/* Pie: marca + acción */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={brand.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-md"
                  style={{ color: brand.accent }}
                >
                  <span className="size-1.5 rounded-full" style={{ background: brand.accent }} />
                  {brand.category}
                </span>
                <p className="mt-2.5 text-2xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-[1.65rem]">{brand.name}</p>
                <p className="mt-1 text-sm text-white/75">{brand.story.caption}</p>
              </m.div>
            </AnimatePresence>
            <button
              onClick={() => onShowProducts(brand.id)}
              className="group mt-4 flex h-12 w-full items-center justify-between rounded-full bg-white pl-5 pr-1.5 text-sm font-bold text-ink transition-transform duration-300 active:scale-[0.98]"
            >
              Ver productos de {brand.short}
              <span
                className="grid size-9 place-items-center rounded-full text-ink transition-transform duration-300 group-hover:translate-x-0.5"
                style={{ background: brand.accent }}
              >
                <ArrowRightIcon className="size-4" />
              </span>
            </button>
          </div>
        </div>

        {/* Chips flotantes (escritorio) */}
        <div
          className="glass absolute -left-16 top-24 z-30 hidden animate-float items-center gap-2.5 rounded-2xl py-2.5 pl-2.5 pr-4 shadow-xl shadow-black/40 xl:flex"
          style={{ transform: 'translateZ(60px)' }}
        >
          <span className="grid size-8 place-items-center rounded-xl bg-wa text-ink">
            <WhatsAppIcon className="size-4.5" />
          </span>
          <span className="text-xs font-semibold leading-tight">
            Pedido directo
            <span className="block font-medium text-subtle">por WhatsApp</span>
          </span>
        </div>
        <div
          className="glass absolute -right-12 bottom-36 z-30 hidden animate-float items-center gap-2 rounded-2xl px-4 py-2.5 shadow-xl shadow-black/40 xl:flex"
          style={{ transform: 'translateZ(80px)', animationDelay: '-3s' }}
        >
          <span className="text-xl font-extrabold tabular-nums">{PRODUCTS.length}+</span>
          <span className="text-xs font-medium leading-tight text-subtle">
            productos
            <span className="block">en la tienda</span>
          </span>
        </div>
      </m.div>
      </div>
    </div>
  )
}
