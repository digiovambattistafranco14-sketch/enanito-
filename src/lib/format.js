const ars = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

/** 25000 → "25.000" */
export const formatNumber = (n) => ars.format(n)

/** 25000 → "$25.000" · null → "Consultar" */
export const formatPrice = (n) => (n == null ? 'Consultar' : `$${formatNumber(n)}`)

/**
 * Texto del total según qué productos tienen precio:
 *  - todos con precio   → "$944.998"
 *  - ninguno con precio → "A consultar"
 *  - mezcla             → "$25.000 + a consultar"
 */
export function formatTotal(lines, total) {
  const priced = lines.some(({ product }) => product.price != null)
  const pending = lines.some(({ product }) => product.price == null)
  if (!priced) return 'A consultar'
  return pending ? `${formatPrice(total)} + a consultar` : formatPrice(total)
}
