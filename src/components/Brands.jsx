import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { BRANDS } from '../data/brands'
import { PRODUCTS } from '../data/products'
import { SIZES } from '../lib/image'
import Picture from './ui/Picture'
import Reveal from './ui/Reveal'
import { ArrowRightIcon, ArrowUpRightIcon, InstagramIcon } from './ui/icons'

const countByBrand = PRODUCTS.reduce((acc, p) => ({ ...acc, [p.brand]: (acc[p.brand] ?? 0) + 1 }), {})

export default function Brands({ onShowProducts }) {
  return (
    <section id="embajadas" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-8 bg-accent" /> Embajador oficial
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.035em] sm:text-6xl">
              Cuatro marcas.
              <br />
              <span className="text-muted">Una misma cara.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-base leading-relaxed text-muted lg:ml-auto">
              El Enanito Ordonieee no recomienda cualquier cosa. Estas son las empresas que eligió representar porque las
              conoce, las usa y las apoya. Cada una en su rubro, todas con la misma actitud.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {BRANDS.map((brand, i) => (
            <Reveal key={brand.id} delay={(i % 2) * 0.08}>
              <BrandCard brand={brand} index={i} count={countByBrand[brand.id] ?? 0} onShowProducts={onShowProducts} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandCard({ brand, index, count, onShowProducts }) {
  const coverRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  // Brillo que sigue al cursor
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <article
      onPointerMove={onMove}
      style={{ '--accent': brand.accent }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-ink-2 transition-[border-color,transform] duration-500 ease-out-quint hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 16%, transparent), transparent 65%)' }}
      />

      <div ref={coverRef} className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
        {/* Parallax: la foto se desplaza más lento que la página */}
        <m.div style={{ y: parallaxY }} className="absolute inset-x-0 -top-[10%] h-[120%]">
          <div className="size-full transition-transform duration-[1.2s] ease-out-quint group-hover:scale-[1.06]">
            {Array.isArray(brand.cover) ? (
              <div className="grid size-full grid-cols-3 gap-1">
                {brand.cover.map((src) => (
                  <Picture key={src} src={src} sizes="(min-width: 768px) 17vw, 33vw" loading="lazy" imgClassName="size-full object-cover object-center" />
                ))}
              </div>
            ) : (
              <Picture src={brand.cover} sizes={SIZES.half} alt={brand.name} loading="lazy" imgClassName="size-full object-cover object-center" />
            )}
          </div>
        </m.div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-2 to-transparent" />
        <span className="absolute left-5 top-5 font-mono text-xs font-semibold text-white/70">0{index + 1}</span>
        <span
          className="glass absolute right-4 top-4 max-w-[70%] truncate rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider sm:right-5 sm:top-5 sm:text-[11px]"
          style={{ color: brand.text }}
        >
          {brand.category}
        </span>
      </div>

      <div className="relative z-20 -mt-10 flex flex-1 flex-col p-5 sm:p-8">
        <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{brand.name}</h3>
        <p className="mt-2 text-sm font-semibold" style={{ color: brand.text }}>
          {brand.tagline}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{brand.description}</p>

        {brand.services && (
          <ul className="mt-5 grid gap-2">
            {brand.services.map((service) => (
              <li key={service} className="flex gap-2.5 text-sm leading-snug text-fg/85">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: brand.accent }} />
                {service}
              </li>
            ))}
          </ul>
        )}

        <blockquote className="mt-6 border-l-2 pl-4 text-sm leading-relaxed text-fg/85" style={{ borderColor: brand.accent }}>
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">{brand.allianceLabel ?? 'La alianza'}</span>
          {brand.alliance}
        </blockquote>

        <div className="mt-auto flex flex-col gap-2.5 pt-7 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            onClick={() => onShowProducts(brand.id)}
            className="group/btn inline-flex h-12 items-center justify-center gap-2 rounded-full sm:h-11 bg-fg px-5 text-sm font-bold text-ink transition-all duration-300 hover:gap-3 active:scale-[0.97]"
          >
            Ver productos
            <span className="rounded-full bg-ink/10 px-1.5 text-xs tabular-nums">{count}</span>
            <ArrowRightIcon className="size-4" />
          </button>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border sm:h-11 border-line-strong px-4 text-sm font-semibold text-fg/90 transition-colors duration-300 hover:bg-fg/5"
          >
            <InstagramIcon className="size-4" />
            {brand.handle}
            <ArrowUpRightIcon className="size-3.5 opacity-60" />
          </a>
        </div>
      </div>
    </article>
  )
}
