import { Suspense, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { BRANDS } from '../data/brands'
import { PRODUCTS } from '../data/products'
import { useScrollTo } from '../context/SmoothScroll'
import { ProductModal } from '../lib/lazy'
import Reveal from './ui/Reveal'
import { CloseIcon, SearchIcon } from './ui/icons'
import ProductCard from './shop/ProductCard'

const EASE = [0.22, 1, 0.36, 1]
const FILTERS = [{ id: 'all', short: 'Todo', accent: '#ffffff' }, ...BRANDS]
const COUNTS = Object.fromEntries(
  FILTERS.map((f) => [f.id, f.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.brand === f.id).length]),
)

const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Shop({ filter, onFilterChange }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [modalMounted, setModalMounted] = useState(false)
  const deferredQuery = useDeferredValue(query)
  const gridRef = useRef(null)
  const scrollTo = useScrollTo()

  const products = useMemo(() => {
    const q = normalize(deferredQuery.trim())
    return PRODUCTS.filter(
      (p) =>
        (filter === 'all' || p.brand === filter) &&
        (!q || normalize(`${p.name} ${p.description}`).includes(q)),
    )
  }, [filter, deferredQuery])

  const changeFilter = (id, button) => {
    onFilterChange(id)
    // Centra la pastilla elegida en el carrusel de filtros (celular)
    button?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    // Si estabas abajo en la grilla, volvés al principio de los resultados
    if (gridRef.current && gridRef.current.getBoundingClientRect().top < 0) scrollTo(gridRef.current, -170)
  }

  const openProduct = (p) => {
    setModalMounted(true)
    setSelected(p)
  }
  const closeProduct = useCallback(() => setSelected(null), [])

  return (
    <section id="tienda" className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute right-0 top-40 -z-10 size-[28rem] rounded-full bg-accent/10 blur-[110px] sm:size-[36rem] sm:blur-[140px]" />

      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-8 bg-accent" /> Tienda oficial
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.035em] sm:text-6xl">
              Armá tu pedido<span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-md text-muted">Mezclá productos de todas las embajadas en un solo carrito y confirmá por WhatsApp.</p>
          </Reveal>

          <Reveal delay={0.1} className="w-full md:w-80">
            <label className="glass flex h-12 items-center gap-3 rounded-full px-4 transition-colors focus-within:border-line-strong">
              <SearchIcon className="size-4 shrink-0 text-subtle" />
              <span className="sr-only">Buscar productos</span>
              <input
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar: botas, camiseta, RCP…"
                // 16px en celular: evita que iPhone haga zoom al tocar el buscador
                className="w-full bg-transparent text-base outline-none placeholder:text-subtle sm:text-sm [&::-webkit-search-cancel-button]:hidden"
              />
              <AnimatePresence>
                {query && (
                  <m.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    onClick={() => setQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="-mr-1 grid size-8 shrink-0 place-items-center rounded-full text-subtle hover:bg-white/5 hover:text-fg"
                  >
                    <CloseIcon className="size-4" />
                  </m.button>
                )}
              </AnimatePresence>
            </label>
          </Reveal>
        </div>

        {/* Filtros por marca */}
        <div className="sticky-under-nav sticky z-30 -mx-4 mt-10 px-4 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Filtrar por marca" className="glass no-scrollbar flex gap-1 overflow-x-auto rounded-full p-1.5 shadow-xl shadow-black/30 sm:inline-flex">
            {FILTERS.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  onClick={(e) => changeFilter(f.id, e.currentTarget)}
                  className={`relative flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-300 active:scale-95 ${
                    active ? 'text-ink' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active && (
                    <m.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-white"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative size-2 rounded-full" style={{ background: f.id === 'all' ? 'var(--color-accent)' : f.accent }} />
                  <span className="relative sm:hidden">{f.short}</span>
                  <span className="relative hidden sm:inline">{f.name ?? f.short}</span>
                  <span className={`relative text-xs tabular-nums ${active ? 'text-ink/65' : 'text-subtle'}`}>{COUNTS[f.id]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <m.ul ref={gridRef} layout className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {products.map((p, i) => (
              <m.li
                key={p.id}
                layout
                className="lazy-render"
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{
                  default: { duration: 0.7, ease: EASE, delay: (i % 4) * 0.06 },
                  layout: { duration: 0.45, ease: EASE },
                }}
              >
                <ProductCard product={p} onOpen={() => openProduct(p)} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>

        <AnimatePresence>
          {products.length === 0 && (
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 rounded-3xl border border-dashed border-line-strong p-10 text-center sm:p-12"
            >
              <p className="font-semibold">No encontramos “{query}”.</p>
              <p className="mt-1 text-sm text-muted">Probá con otra palabra o mirá todas las marcas.</p>
              <button
                onClick={() => {
                  setQuery('')
                  onFilterChange('all')
                }}
                className="mt-5 h-11 rounded-full bg-white px-6 text-sm font-bold text-ink active:scale-95"
              >
                Ver todo
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {modalMounted && (
        <Suspense fallback={null}>
          <ProductModal product={selected} onClose={closeProduct} />
        </Suspense>
      )}
    </section>
  )
}
