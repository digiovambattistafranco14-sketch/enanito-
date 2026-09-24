import { SITE } from '../config/site'
import { BRAND_BY_ID } from '../data/brands'
import { formatPrice, formatTotal } from './format'

const DIVIDER = '—————————————————'

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
    `👤 *${customer.name.trim()}*`,
    `📞 *${customer.phone.trim()}*`,
    DIVIDER,
    '*PEDIDO:*',
    ...items,
    DIVIDER,
    `💰 *Total: ${formatTotal(lines, total)}*`,
  ].join('\n')
}

/** api.whatsapp.com conserva mejor los emojis que wa.me en algunos navegadores. */
export function buildWhatsAppUrl(message, number = SITE.whatsappNumber) {
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`
}
