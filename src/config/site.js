// ─────────────────────────────────────────────────────────────
//  Configuración general del sitio. Todo lo editable está acá.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'El Enanito Ordonieee',
  handle: '@elenanito.ordonieee',
  instagram: 'https://www.instagram.com/elenanito.ordonieee/',
  region: 'Reconquista, Santa Fe',

  // Número de WhatsApp que recibe los pedidos: código de país + área + número,
  // sin "+", espacios ni guiones. Ej. Argentina: 549 + 342 + 5551234 → "5493425551234".
  // También se puede definir con la variable de entorno VITE_WHATSAPP_NUMBER (.env.local).
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '5493425293397', // +54 9 3425 29-3397

  currency: 'ARS',

  credits: {
    label: 'zek.webs',
    url: 'https://www.instagram.com/zek.webs/',
  },
}
