import { useMemo, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { useCart } from '../../context/CartContext'
import { buildOrderMessage, buildWhatsAppUrl } from '../../lib/whatsapp'
import { CheckIcon, WhatsAppIcon } from '../ui/icons'

const CUSTOMER_KEY = 'enanito-customer-v1'

function loadCustomer() {
  try {
    const c = JSON.parse(localStorage.getItem(CUSTOMER_KEY) ?? '{}')
    return { name: c.name ?? '', phone: c.phone ?? '' }
  } catch {
    return { name: '', phone: '' }
  }
}

function validate({ name, phone }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Ingresá tu nombre.'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) errors.phone = 'Ingresá un número válido (con código de área).'
  return errors
}

export default function Checkout() {
  const { lines, total, totalLabel, clear, close } = useCart()
  const [customer, setCustomer] = useState(loadCustomer)
  const [touched, setTouched] = useState({})
  const [sentUrl, setSentUrl] = useState(null)

  const errors = validate(customer)
  const isValid = Object.keys(errors).length === 0
  const message = useMemo(() => buildOrderMessage(customer, lines, total), [customer, lines, total])

  const update = (field) => (e) => setCustomer((c) => ({ ...c, [field]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setTouched({ name: true, phone: true })
    if (!isValid) return
    try {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer))
    } catch {
      /* no pasa nada si no se puede guardar */
    }
    const url = buildWhatsAppUrl(message)
    window.open(url, '_blank', 'noopener')
    setSentUrl(url)
  }

  if (sentUrl) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <m.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="grid size-20 place-items-center rounded-full bg-wa text-ink"
        >
          <CheckIcon className="size-9" strokeWidth={2.6} />
        </m.div>
        <p className="mt-6 text-xl font-extrabold">¡Pedido listo para enviar!</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Se abrió WhatsApp con tu pedido. Solo tocá <b className="text-fg">Enviar</b> y te respondemos con precios y stock.
        </p>
        <a href={sentUrl} target="_blank" rel="noreferrer" className="mt-5 text-sm font-semibold text-wa underline-offset-4 hover:underline">
          ¿No se abrió? Tocá acá
        </a>
        <button
          onClick={() => {
            clear()
            close()
          }}
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition-transform active:scale-95"
        >
          Vaciar carrito y terminar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-muted">
          Solo necesitamos dos datos. Al confirmar se abre WhatsApp con el pedido armado, listo para enviar.
        </p>

        <Field
          label="Nombre"
          id="name"
          autoComplete="name"
          placeholder="Ej: Juan Pérez"
          value={customer.name}
          onChange={update('name')}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={touched.name && errors.name}
        />
        <Field
          label="Teléfono / WhatsApp"
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Ej: 3482 123456"
          value={customer.phone}
          onChange={update('phone')}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          error={touched.phone && errors.phone}
        />

        <details className="group rounded-2xl border border-line bg-ink/60">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Vista previa del mensaje
            <span className="text-subtle transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <pre className="whitespace-pre-wrap break-words border-t border-line px-4 py-3 font-sans text-[13px] leading-relaxed text-fg/85">{message}</pre>
        </details>
      </div>

      <footer className="pb-safe border-t border-line p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Total del pedido</span>
          <span className="text-2xl font-extrabold tracking-tight tabular-nums">{totalLabel}</span>
        </div>
        <button
          type="submit"
          className="group mt-4 flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-wa text-sm font-bold text-ink shadow-[0_10px_40px_-12px] shadow-wa/70 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
          Enviar pedido por WhatsApp
        </button>
      </footer>
    </form>
  )
}

function Field({ label, id, error, ...input }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full rounded-xl border bg-ink px-4 text-base outline-none transition-all duration-300 placeholder:text-subtle focus:bg-ink-3 ${
          error ? 'border-accent' : 'border-line-strong focus:border-white/40'
        }`}
        {...input}
      />
      <AnimatePresence>
        {error && (
          <m.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs font-medium text-accent-soft"
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}
