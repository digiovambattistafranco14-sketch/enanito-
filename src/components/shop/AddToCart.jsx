import { AnimatePresence, m } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { MinusIcon, PlusIcon } from '../ui/icons'

const swap = {
  initial: { opacity: 0, scale: 0.85, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.85, filter: 'blur(4px)' },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
}

/**
 * Botón "Agregar" que se transforma en contador cuando el producto ya está en el carrito.
 * `compact`: versión de tarjeta (ancho completo en celular, chico en escritorio).
 */
export default function AddToCart({ productId, compact = false, onAdded }) {
  const { qtyOf, add, inc, dec } = useCart()
  const qty = qtyOf(productId)

  const height = compact ? 'h-10 sm:h-9' : 'h-12'
  const square = compact ? 'size-10 sm:size-9' : 'size-12'
  const width = compact ? 'w-full sm:w-auto' : 'w-full'

  return (
    <div className={`relative ${height} ${width}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {qty === 0 ? (
          <m.button
            key="add"
            {...swap}
            onClick={() => {
              add(productId)
              onAdded?.()
            }}
            className={`${height} ${width} inline-flex items-center justify-center gap-1.5 rounded-full bg-white font-bold text-ink transition-colors duration-300 hover:bg-accent hover:text-white active:scale-95 ${
              compact ? 'px-3.5 text-xs' : 'px-6 text-sm'
            }`}
          >
            <PlusIcon className="size-3.5" strokeWidth={2.6} />
            Agregar
          </m.button>
        ) : (
          <m.div
            key="stepper"
            {...swap}
            className={`${height} ${width} inline-flex items-center justify-between rounded-full bg-accent text-white`}
          >
            <button onClick={() => dec(productId)} aria-label="Restar uno" className={`${square} grid shrink-0 place-items-center rounded-full transition-colors hover:bg-black/15 active:scale-90`}>
              <MinusIcon className="size-3.5" strokeWidth={2.6} />
            </button>
            <m.span
              key={qty}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`min-w-5 text-center font-bold tabular-nums ${compact ? 'text-xs' : 'text-sm'}`}
              aria-live="polite"
            >
              {qty}
            </m.span>
            <button onClick={() => inc(productId)} aria-label="Sumar uno" className={`${square} grid shrink-0 place-items-center rounded-full transition-colors hover:bg-black/15 active:scale-90`}>
              <PlusIcon className="size-3.5" strokeWidth={2.6} />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
