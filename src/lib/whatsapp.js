import { SITE } from '../config/site'
import { BRAND_BY_ID } from '../data/brands'
import { formatPrice, formatTotal } from './format'

const DIVIDER = '—————————————————'

// Saca los símbolos de formato de WhatsApp (* _ ~ `) para que no rompan las negritas
const clean = (text) => text.replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim()

/**
 * Arma el mensaje del pedido con el formato exacto pedido por la marca.
 * @param {{ name: string, phone: string }} customer
 * @param {Array<{ product: object, qty: number }>} lines
 * @param {number} total
 */
export function buildOrderMessage(customer, lines, total) {
  const items = lines.map(({ product, qty }) => {
    const brand = BRAND_BY_ID[product.brand]?.name ?? product.brand
    const subtotal = product.price == null ? null : product.price * qty
    return `• ${qty} x ${product.name} (${brand}) - ${formatPrice(subtotal)}`
  })

  return [
    '🛒 *NUEVO PEDIDO - WEB*',
    '🔴🔴 *ENANITO ORDONIEEE* 🔴🔴',
    DIVIDER,
    `👤 *${clean(customer.name)}*`,
    `📞 *${clean(customer.phone)}*`,
    DIVIDER,
    '*PEDIDO:*',
    ...items,
    DIVIDER,
    `💰 *Total: ${formatTotal(lines, total)}*`,
  ].join('\n')
}

/** Consulta rápida por un solo producto (botón "Consultar por WhatsApp" de la página del producto). */
export function buildProductQuestion(product, url) {
  const brand = BRAND_BY_ID[product.brand]?.name ?? product.brand
  return ['Hola! 👋 Quiero consultar por este producto:', `• *${product.name}* (${brand})`, '', url].join('\n')
}

/** api.whatsapp.com conserva mejor los emojis que wa.me en algunos navegadores. */
export function buildWhatsAppUrl(message, number = SITE.whatsappNumber) {
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`
}
