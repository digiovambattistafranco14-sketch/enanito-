import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { BRAND_BY_ID } from '../../data/brands'
import { PRODUCTS } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { productPath, useRouter } from '../../context/Router'
import { formatPrice } from '../../lib/format'
import { buildProductQuestion, buildWhatsAppUrl } from '../../lib/whatsapp'
import ProductCard from '../shop/ProductCard'
import AddToCart from '../shop/AddToCart'
import Reveal from '../ui/Reveal'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, InstagramIcon, WhatsAppIcon } from '../ui/icons'
import ProductGallery from './ProductGallery'

const EASE = [0.22, 1, 0.36, 1]

export default function ProductPage({ productId, onShowBrand }) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) return <NotFound />
  // `key` reinicia la galería y el estado al pasar de un producto a otro
  return <ProductView key={product.id} product={product} onShowBrand={onShowBrand} />
}

function ProductView({ product, onShowBrand }) {
  const brand = BRAND_BY_ID[product.brand]
  const { navigate, hasNavigated } = useRouter()
  const { qtyOf, open } = useCart()
  const inCart = qtyOf(product.id) > 0

  // Más de la misma marca; si son pocos, se completa con otras
  const sameBrand = PRODUCTS.filter((p) => p.brand === product.brand && p.id !== product.id)
  const related = [...sameBrand, ...PRODUCTS.filter((p) => p.brand !== product.brand)].slice(0, 4)

  const back = () => (hasNavigated ? history.back() : navigate('/', { scroll: false }).then(() => onShowBrand(product.brand)))

  return (
    <main className="relative pb-28 pt-24 sm:pb-24 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] overflow-hidden">
        <div className="absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full opacity-20 blur-[140px]" style={{ background: brand.accent }} />
      </div>

      <div className="container-x">
        {/* Volver + migas */}
        <nav aria-label="Ubicación" className="flex items-center gap-3 text-sm">
          <button
            onClick={back}
            className="glass group inline-flex h-10 items-center gap-2 rounded-full pl-3 pr-4 font-semibold transition-colors hover:bg-fg/10 active:scale-95"
          >
            <ArrowLeftIcon className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Volver
          </button>
          <ol className="flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap text-subtle">
            <li className="max-sm:hidden">
              <button onClick={() => navigate('/', { scroll: false }).then(() => onShowBrand('all'))} className="hover:text-fg">
                Tienda
              </button>
            </li>
            <li className="max-sm:hidden" aria-hidden>
              /
            </li>
            <li className="min-w-0 truncate">
              <button onClick={() => navigate('/', { scroll: false }).then(() => onShowBrand(brand.id))} className="max-w-full truncate hover:text-fg" style={{ color: brand.text }}>
                {brand.name}
              </button>
            </li>
            <li className="max-sm:hidden" aria-hidden>
              /
            </li>
            <li className="truncate text-fg/80 max-sm:hidden" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* Galería (fija al scrollear en escritorio) */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          {/* Información */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="flex flex-col"
          >
            <a
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-line-strong py-1 pl-1 pr-3 text-xs font-semibold transition-colors hover:bg-fg/5"
            >
              <span className="grid size-6 place-items-center rounded-full text-[10px] font-extrabold text-fg" style={{ background: brand.accent }}>
                {brand.short[0]}
              </span>
              {brand.name}
              <span className="text-subtle">· Embajada oficial</span>
            </a>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-5xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {product.tag && (
                <span className="rounded-full bg-fg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">{product.tag}</span>
              )}
              <span className="rounded-full border border-line-strong px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                {brand.category}
              </span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{product.description}</p>

            <div className="mt-8 rounded-3xl border border-line bg-ink-2/70 p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-xs text-subtle">Precio</span>
                  <p className="text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl">{formatPrice(product.price)}</p>
                </div>
                {product.price == null && (
                  <p className="max-w-[12rem] text-right text-xs leading-snug text-muted">Te pasamos precio y stock por WhatsApp.</p>
                )}
              </div>

              <div className="mt-5 space-y-3">
                <AddToCart productId={product.id} />
                <AnimatePresence>
                  {inCart && (
                    <m.button
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 48 }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={open}
                      className="flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-line-strong text-sm font-semibold transition-colors hover:bg-fg/5"
                    >
                      <CheckIcon className="size-4 text-wa-ink" strokeWidth={2.6} /> En tu carrito · Ver pedido
                    </m.button>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={buildWhatsAppUrl(buildProductQuestion(product, productPath(product.id)))}
                    // Al tocar, se usa el link completo de la página (con dominio) en el mensaje
                    onClick={(e) => (e.currentTarget.href = buildWhatsAppUrl(buildProductQuestion(product, window.location.href)))}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-wa/10 text-sm font-semibold text-wa-ink ring-1 ring-wa/30 transition-colors hover:bg-wa/20"
                  >
                    <WhatsAppIcon className="size-4.5" /> Consultar
                  </a>
                  <ShareButton product={product} />
                </div>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ['Pedido', 'Por WhatsApp, sin registrarte'],
                ['Marca', brand.name],
                ['Precio y stock', 'Confirmados por la marca'],
                // Las marcas "formales" (NG) no mencionan al Enanito
                ...(brand.formal ? [] : [['Embajador', 'El Enanito Ordonieee']]),
              ].map(([k, v]) => (
                <li key={k} className="rounded-2xl border border-line px-4 py-3">
                  <span className="block text-xs text-subtle">{k}</span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>

            {/* La marca */}
            <div className="mt-6 rounded-3xl border border-line p-5" style={{ background: `color-mix(in srgb, ${brand.accent} 6%, transparent)` }}>
              <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: brand.text }}>
                Sobre la marca
              </p>
              <p className="mt-2 font-bold">{brand.tagline}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{brand.alliance}</p>
              {brand.services && (
                <ul className="mt-3 grid gap-1.5">
                  {brand.services.map((service) => (
                    <li key={service} className="flex gap-2 text-sm leading-snug text-fg/85">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: brand.accent }} />
                      {service}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate('/', { scroll: false }).then(() => onShowBrand(brand.id))}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-bold text-ink active:scale-95"
                >
                  Todo de {brand.short} <ArrowRightIcon className="size-4" />
                </button>
                <a
                  href={brand.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-semibold hover:bg-fg/5"
                >
                  <InstagramIcon className="size-4" /> {brand.handle}
                </a>
              </div>
            </div>
          </m.div>
        </div>

        {/* Relacionados */}
        <section className="mt-20 sm:mt-28" aria-labelledby="relacionados">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 id="relacionados" className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              Más de <span style={{ color: brand.text }}>{sameBrand.length ? brand.name : 'las embajadas'}</span>
            </h2>
            <button
              onClick={() => navigate('/', { scroll: false }).then(() => onShowBrand(sameBrand.length ? brand.id : 'all'))}
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg sm:inline-flex"
            >
              Ver todo <ArrowRightIcon className="size-4" />
            </button>
          </Reveal>
          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.06} className="lazy-render">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </section>
      </div>

      {/* Barra fija en celular: precio + agregar al alcance del pulgar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 rounded-t-3xl border-t border-line-strong bg-ink-2/95 px-4 pt-3 shadow-[0_-12px_40px_-12px_rgba(11,19,36,0.18)] backdrop-blur-xl sm:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-subtle">{product.name}</p>
          <p className="font-extrabold tabular-nums">{formatPrice(product.price)}</p>
        </div>
        <div className="w-44">
          <AddToCart productId={product.id} />
        </div>
      </div>
    </main>
  )
}

function ShareButton({ product }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    const data = { title: product.name, text: `${product.name} · El Enanito Ordonieee`, url }
    try {
      if (navigator.share) return await navigator.share(data)
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* el usuario canceló o no hay permiso de portapapeles */
    }
  }

  return (
    <button
      onClick={share}
      className="flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong text-sm font-semibold transition-colors hover:bg-fg/5"
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={copied ? 'ok' : 'share'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <CheckIcon className="size-4 text-wa-ink" strokeWidth={2.6} /> ¡Link copiado!
            </>
          ) : (
            <>
              <ShareIcon className="size-4" /> Compartir
            </>
          )}
        </m.span>
      </AnimatePresence>
    </button>
  )
}

const ShareIcon = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
    <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
  </svg>
)

function NotFound() {
  const { navigate } = useRouter()
  return (
    <main className="container-x flex min-h-[80svh] flex-col items-center justify-center pt-24 text-center">
      <p className="text-7xl font-extrabold tracking-tighter text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold">No encontramos esta página</h1>
      <p className="mt-2 text-muted">Puede que el producto ya no esté disponible o que el link esté mal escrito.</p>
      <button onClick={() => navigate('/')} className="mt-8 h-12 rounded-full bg-fg px-6 text-sm font-bold text-ink active:scale-95">
        Ir a la tienda
      </button>
    </main>
  )
}
