# El Enanito Ordonieee · Portal oficial

Landing + tienda con carrito y pedido directo por WhatsApp para **@elenanito.ordonieee**, embajador de Zoe Importaciones, NG Consultora, Reco.tactika y Apache Indumentaria.

**Stack:** Vite · React 19 · Tailwind CSS 4 · Motion (Framer Motion) · Lenis (scroll suave)

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist listo para subir (Vercel, Netlify, Hostinger, etc.)
npm run preview  # prueba el build de producción en local
```

## Rendimiento

- **Pre-render:** `npm run build` genera el HTML completo de la página (con el CSS en línea), así el contenido se ve apenas llega, sin esperar al JavaScript. Después React lo "activa" por bloques.
- **Imágenes responsive:** cada foto tiene 4 tamaños (360 / 640 / 1000 / 1400 px) y el navegador baja solo el que necesita.
- **Carga diferida:** el carrito, la vista de producto y el motor de animaciones se cargan aparte, después de la primera pintura.
- **Fuente auto-alojada** (`public/fonts`, solo latín) con precarga.
- Lighthouse móvil (throttling real): **Performance ~90 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100**.

## Lo primero que hay que configurar

| Qué | Dónde |
| --- | --- |
| **Número de WhatsApp** que recibe los pedidos (hoy: +54 9 3425 29-3397) | `src/config/site.js` → `whatsappNumber` (o `VITE_WHATSAPP_NUMBER` en `.env.local`) |
| **Precios** (hoy todos en "Consultar") | `src/data/products.js` |
| Textos, colores e Instagram de cada marca | `src/data/brands.js` |
| Créditos del footer, región | `src/config/site.js` |

Formato del número: código de país + área + número, sin `+` ni espacios. Ej.: `5493425551234`.

## Agregar productos

1. Copiá la foto en `public/products/<zoe|ng|reco|apache>/nombre-del-producto.jpg`
2. Corré `npm run optimize` → la convierte a `.webp` y genera los 4 tamaños
3. Sumá el producto en `src/data/products.js`:

```js
{
  id: 'reco-gorra-tactica',        // único
  brand: 'reco',                   // zoe | ng | reco | apache
  name: 'Gorra Táctica',
  description: 'Descripción corta.',
  price: null,                     // null = "Consultar" · o un número: 19999
  tag: 'Nuevo',                    // opcional
  images: img('reco', 'gorra-tactica', 'gorra-tactica-2'), // la 2ª aparece al pasar el mouse
},
```

## Estructura

```
public/products/{zoe,ng,reco,apache}/   Fotos por marca (.webp)
src/
  config/site.js          WhatsApp, Instagram, créditos
  data/brands.js          Las 4 embajadas (copys, colores, links)
  data/products.js        Catálogo
  lib/whatsapp.js         Arma el mensaje del pedido y el link de WhatsApp
  context/CartContext     Estado del carrito (persistente en el navegador)
  context/SmoothScroll    Scroll suave (Lenis) + bloqueo de scroll en modales
  lib/image.js            srcset responsive de las fotos
  lib/flyToCart.js        Animación del producto "volando" al carrito
  lib/lazy.js             Carga diferida del carrito y la vista de producto
  Root.jsx / entry-server Árbol de la app + pre-render del build
  components/             Navbar, Hero, Brands, HowItWorks, Shop, Footer
  components/shop/        ProductCard, ProductModal, AddToCart
  components/cart/        CartDrawer, Checkout, CartFab, Toast
```

## Mensaje que llega por WhatsApp

```
🛒 *NUEVO PEDIDO - WEB*
🔴🔴 *ENANITO ORDONIEEE* 🔴🔴
—————————————————
👤 *Juan Pérez*
📞 *3482 123456*
—————————————————
*PEDIDO:*
• 2 x Samsung Galaxy A26 5G (Zoe Importaciones) - Consultar
• 1 x Botas Rocky con Cierre Lateral (Reco.tactika) - Consultar
—————————————————
💰 *Total: A consultar*
```

Si más adelante cargás precios, cada línea muestra su subtotal (`$919.998`) y el total se suma solo. Si hay mezcla, el total queda como `$25.000 + a consultar`.
