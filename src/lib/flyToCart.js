/**
 * Animación "vuela al carrito": clona la foto del producto y la lleva en arco
 * hasta el botón del carrito. Usa Web Animations API (sin re-renders de React).
 */
export function flyToCart(fromEl) {
  if (!fromEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const target = document.querySelector('[data-cart-target]')
  if (!target) return

  const a = fromEl.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  if (!a.width || a.bottom < 0 || a.top > window.innerHeight) return

  const size = Math.min(a.width, a.height, 180)
  const clone = document.createElement('img')
  clone.src = fromEl.currentSrc || fromEl.src
  clone.alt = ''
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover',
    borderRadius: '24px',
    zIndex: 80,
    pointerEvents: 'none',
    boxShadow: '0 20px 50px -10px rgba(0,0,0,.6)',
    willChange: 'transform, opacity',
  })
  document.body.appendChild(clone)

  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)

  const flight = clone.animate(
    [
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 90}px) scale(0.62) rotate(-8deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.1) rotate(10deg)`, opacity: 0.5, borderRadius: '50%' },
    ],
    { duration: 780, easing: 'cubic-bezier(0.55, 0, 0.3, 1)', fill: 'forwards' },
  )

  flight.onfinish = () => {
    clone.remove()
    target.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'ease-out' },
    )
  }
}
