import { AnimatePresence, m } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { BagIcon } from '../ui/icons'

/** Botón flotante del carrito: aparece cuando hay productos. */
export default function CartFab() {
  const { count, totalLabel, isOpen, open } = useCart()
  const summary = totalLabel === 'A consultar' ? `${count} ${count === 1 ? 'producto' : 'productos'}` : totalLabel

  return (
    <AnimatePresence>
      {count > 0 && !isOpen && (
        <m.button
          onClick={open}
          aria-label={`Ver carrito: ${count} productos, total ${totalLabel}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 items-center gap-3 rounded-full bg-accent pl-2 pr-5 text-white shadow-[0_18px_50px_-12px] shadow-accent/80 transition-transform hover:scale-[1.03] active:scale-95 sm:right-6 sm:bottom-6"
        >
          <m.span
            key={count}
            initial={{ scale: 0.7, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="relative grid size-10 place-items-center rounded-full bg-white text-ink"
          >
            <BagIcon className="size-4.5" />
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold leading-5 text-white ring-2 ring-accent tabular-nums">
              {count}
            </span>
          </m.span>
          <span className="text-left leading-tight">
            <span className="block text-[11px] font-medium text-white/75">Ver pedido</span>
            <span className="block text-sm font-extrabold tabular-nums">{summary}</span>
          </span>
        </m.button>
      )}
    </AnimatePresence>
  )
}
