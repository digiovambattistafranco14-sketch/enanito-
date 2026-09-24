import { useEffect, useState } from 'react'
import { AnimatePresence, m, useDragControls } from 'motion/react'
import { BRAND_BY_ID } from '../../data/brands'
import { formatPrice } from '../../lib/format'
import { useCart } from '../../context/CartContext'
import useOverlay from '../ui/useOverlay'
import { responsive, thumb } from '../../lib/image'
import { CloseIcon, InstagramIcon } from '../ui/icons'
import AddToCart from './AddToCart'

const EASE = [0.22, 1, 0.36, 1]

export default function ProductModal({ product, onClose }) {
  useOverlay(Boolean(product), onClose)
  const dragControls = useDragControls()

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
          <m.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            // Celular: se cierra arrastrando la manija hacia abajo
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
            className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[2rem] border border-line-strong bg-ink-2 sm:rounded-[2rem] md:grid-cols-[1.1fr_1fr] md:overflow-hidden"
          >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="sticky top-0 z-20 -mb-6 flex h-6 cursor-grab touch-none justify-center pt-2.5 md:hidden"
              aria-hidden
            >
              <span className="h-1.5 w-10 rounded-full bg-white/30" />
            </div>
            <ModalContent product={product} onClose={onClose} />
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ModalContent({ product, onClose }) {
  const brand = BRAND_BY_ID[product.brand]
  const [active, setActive] = useState(0)
  const { qtyOf, open } = useCart()

  const many = product.images.length > 1
  const go = (dir) => setActive((i) => (i + dir + product.images.length) % product.images.length)

  useEffect(() => setActive(0), [product.id])

  return (
    <>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="glass absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full transition-transform hover:rotate-90"
      >
        <CloseIcon className="size-4.5" />
      </button>

      {/* Galería: la imagen completa (object-contain) para que se lean los flyers */}
      <div className="relative flex flex-col bg-ink p-3 sm:p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink-3 sm:aspect-[4/5] md:aspect-auto md:h-[min(78dvh,680px)]">
          <AnimatePresence mode="wait" initial={false}>
            <m.img
              key={product.images[active]}
              {...responsive(product.images[active], '(min-width: 768px) 55vw, 100vw')}
              alt={product.name}
              decoding="async"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              // Deslizar la foto para ver la siguiente
              drag={many ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1)
                else if (info.offset.x > 60) go(-1)
              }}
              draggable={false}
              className="absolute inset-0 size-full object-contain"
            />
          </AnimatePresence>
          {many && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
              {product.images.map((src, i) => (
                <span key={src} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={`size-16 overflow-hidden rounded-xl border-2 transition-all ${i === active ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={thumb(src)} alt="" decoding="async" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pb-safe flex flex-col p-6 sm:p-9 md:overflow-y-auto" data-lenis-prevent>
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: brand.accent }}>
          <span className="size-2 rounded-full" style={{ background: brand.accent }} />
          {brand.name}
        </span>
        <h3 className="mt-3 pr-10 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h3>
        {product.tag && (
          <span className="mt-4 w-fit rounded-full border border-line-strong px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-fg/80">
            {product.tag}
          </span>
        )}
        <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

        <div className="mt-8 border-t border-line pt-6">
          <span className="text-xs text-subtle">Precio</span>
          <p className="text-4xl font-extrabold tracking-tight tabular-nums">{formatPrice(product.price)}</p>
          {product.price == null && (
            <p className="mt-2 text-sm text-muted">Sumalo al pedido y te pasamos precio y disponibilidad por WhatsApp.</p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <AddToCart productId={product.id} />
          {qtyOf(product.id) > 0 && (
            <m.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                onClose()
                open()
              }}
              className="h-12 w-full rounded-full border border-line-strong text-sm font-semibold transition-colors hover:bg-white/5"
            >
              Ir al carrito
            </m.button>
          )}
        </div>

        <a
          href={brand.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-2 pt-8 text-sm text-muted transition-colors hover:text-fg"
        >
          <InstagramIcon className="size-4" /> Más de {brand.name} en {brand.handle}
        </a>
      </div>
    </>
  )
}
