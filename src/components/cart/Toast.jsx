import { AnimatePresence, m } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { CheckIcon } from '../ui/icons'
import { thumb } from '../../lib/image'

/** Confirmación breve al agregar un producto. */
export default function Toast() {
  const { toast, isOpen, open } = useCart()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] grid justify-items-center px-4 sm:top-24" aria-live="polite">
      <AnimatePresence initial={false}>
        {toast && !isOpen && (
          <m.div
            key={toast.key}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass pointer-events-auto col-start-1 row-start-1 flex items-center gap-3 rounded-2xl py-2 pl-2 pr-2 shadow-2xl shadow-black/50"
          >
            <img src={thumb(toast.product.images[0])} alt="" className="size-11 rounded-xl object-cover object-top" />
            <div className="min-w-0 pr-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-wa">
                <CheckIcon className="size-3.5" strokeWidth={2.6} /> Agregado al carrito
              </p>
              <p className="max-w-52 truncate text-sm font-semibold">{toast.product.name}</p>
            </div>
            <button onClick={open} className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-ink transition-transform active:scale-95">
              Ver
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
