import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { BRAND_BY_ID } from '../../data/brands'
import { formatPrice } from '../../lib/format'
import useOverlay, { useIsTouch } from '../ui/useOverlay'
import { thumb } from '../../lib/image'
import { ArrowLeftIcon, ArrowRightIcon, BagIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from '../ui/icons'
import Checkout from './Checkout'

const EASE = [0.22, 1, 0.36, 1]

export default function CartDrawer() {
  const cart = useCart()
  const [step, setStep] = useState('cart') // 'cart' | 'checkout'
  const isTouch = useIsTouch()
  useOverlay(cart.isOpen, cart.close)

  // Al cerrar, la próxima vez vuelve a abrir en la lista
  useEffect(() => {
    if (!cart.isOpen) setStep('cart')
  }, [cart.isOpen])

  // Si se vacía el carrito estando en checkout, volver
  useEffect(() => {
    if (cart.count === 0 && step === 'checkout') setStep('cart')
  }, [cart.count, step])

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de compras">
          <m.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cart.close}
          />
          <m.aside
            data-lenis-prevent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: EASE }}
            // En celular se cierra deslizando hacia la derecha
            drag={isTouch ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.7 }}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              if (info.offset.x > 110 || info.velocity.x > 600) cart.close()
            }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line-strong bg-ink-2 sm:inset-y-3 sm:right-3 sm:rounded-[2rem] sm:border sm:bg-ink-2/95 sm:backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait" initial={false}>
                  {step === 'checkout' ? (
                    <m.button
                      key="back"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      onClick={() => setStep('cart')}
                      aria-label="Volver al carrito"
                      className="grid size-9 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                    >
                      <ArrowLeftIcon className="size-4" />
                    </m.button>
                  ) : (
                    <m.span key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid size-9 place-items-center rounded-full bg-accent text-white">
                      <BagIcon className="size-4" />
                    </m.span>
                  )}
                </AnimatePresence>
                <div>
                  <h2 className="font-bold leading-tight">{step === 'cart' ? 'Tu pedido' : 'Tus datos'}</h2>
                  <p className="text-xs text-subtle">
                    {cart.count} {cart.count === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
              <button onClick={cart.close} aria-label="Cerrar carrito" className="grid size-9 place-items-center rounded-full transition-all hover:rotate-90 hover:bg-white/5">
                <CloseIcon className="size-4.5" />
              </button>
            </header>

            <AnimatePresence mode="wait" initial={false}>
              {step === 'cart' ? (
                <m.div
                  key="cart"
                  className="flex min-h-0 flex-1 flex-col"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {cart.count === 0 ? <EmptyCart onClose={cart.close} /> : <CartItems onCheckout={() => setStep('checkout')} />}
                </m.div>
              ) : (
                <m.div
                  key="checkout"
                  className="flex min-h-0 flex-1 flex-col"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <Checkout />
                </m.div>
              )}
            </AnimatePresence>
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

function EmptyCart({ onClose }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="grid size-20 place-items-center rounded-full border border-dashed border-line-strong text-subtle">
        <BagIcon className="size-8" />
      </div>
      <p className="mt-5 font-bold">Tu carrito está vacío</p>
      <p className="mt-1.5 text-sm text-muted">Sumá productos de cualquiera de las embajadas y armá tu pedido.</p>
      <button onClick={onClose} className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition-transform active:scale-95">
        Seguir mirando
      </button>
    </div>
  )
}

function CartItems({ onCheckout }) {
  const { lines, totalLabel, inc, dec, remove, clear } = useCart()
  const hasQuotes = lines.some((l) => l.product.price == null)

  return (
    <>
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4">
        <AnimatePresence initial={false}>
          {lines.map(({ product, qty }) => {
            const brand = BRAND_BY_ID[product.brand]
            return (
              <m.li
                key={product.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 rounded-2xl border border-line bg-ink/60 p-2.5">
                  <img src={thumb(product.images[0])} alt="" width="80" height="80" decoding="async" className="size-20 shrink-0 rounded-xl object-cover object-top" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-subtle">
                          <span className="size-1.5 rounded-full" style={{ background: brand.accent }} />
                          {brand.name}
                        </span>
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                      </div>
                      <button onClick={() => remove(product.id)} aria-label={`Quitar ${product.name}`} className="shrink-0 rounded-full p-1.5 text-subtle transition-colors hover:bg-accent/15 hover:text-accent">
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line-strong">
                        <button onClick={() => dec(product.id)} aria-label="Restar uno" className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/5">
                          <MinusIcon className="size-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold tabular-nums">{qty}</span>
                        <button onClick={() => inc(product.id)} aria-label="Sumar uno" className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/5">
                          <PlusIcon className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold tabular-nums">{formatPrice(product.price == null ? null : product.price * qty)}</span>
                    </div>
                  </div>
                </div>
              </m.li>
            )
          })}
        </AnimatePresence>
      </ul>

      <footer className="pb-safe border-t border-line p-5 sm:p-6">
        <div className="flex items-center justify-between text-sm">
          <button onClick={clear} className="font-medium text-subtle underline-offset-4 transition-colors hover:text-accent hover:underline">
            Vaciar carrito
          </button>
          <span className="text-muted">Total</span>
        </div>
        <div className="mt-1 flex items-baseline justify-end gap-2">
          <m.span key={totalLabel} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-right text-3xl font-extrabold tracking-tight tabular-nums">
            {totalLabel}
          </m.span>
        </div>
        {hasQuotes && <p className="mt-1 text-right text-xs text-subtle">Te pasamos el precio por WhatsApp</p>}
        <button
          onClick={onCheckout}
          className="group mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-bold text-ink transition-all duration-300 hover:gap-3 active:scale-[0.98]"
        >
          Continuar con el pedido
          <ArrowRightIcon className="size-4" />
        </button>
      </footer>
    </>
  )
}
