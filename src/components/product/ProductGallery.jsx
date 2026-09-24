import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { morphName } from '../../context/Router'
import { SIZES, thumb } from '../../lib/image'
import Picture from '../ui/Picture'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Galería del producto:
 *  - foto completa (object-contain) para que se lean los flyers
 *  - zoom con el mouse en escritorio, deslizar para cambiar en celular
 *  - miniaturas y puntitos de posición
 */
export default function ProductGallery({ product }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(null) // { x, y } en % cuando el mouse está encima
  const images = product.images
  const many = images.length > 1
  const go = (dir) => setActive((i) => (i + dir + images.length) % images.length)

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      <div
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
        className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] border border-line bg-ink-2 sm:aspect-[4/5] lg:flex-1 lg:cursor-zoom-in"
        style={{ viewTransitionName: morphName(product.id) }}
      >
        {/* El zoom va en un contenedor aparte para no pisar la animación de la foto */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        >
        <AnimatePresence mode="popLayout" initial={false}>
          <Picture
            motion
            key={images[active]}
            src={images[active]}
            sizes={SIZES.gallery}
            alt={`${product.name}${many ? ` (foto ${active + 1} de ${images.length})` : ''}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            drag={many ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1)
              else if (info.offset.x > 60) go(-1)
            }}
            className="absolute inset-0 block"
            imgClassName="size-full select-none object-contain p-2 sm:p-4"
          />
        </AnimatePresence>
        </div>

        {many && (
          <>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden" aria-hidden>
              {images.map((src, i) => (
                <span key={src} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
            <span className="glass absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums">
              {active + 1}/{images.length}
            </span>
          </>
        )}
        {!zoom && (
          <span className="glass pointer-events-none absolute bottom-3 right-3 hidden rounded-full px-3 py-1.5 text-[11px] font-semibold text-fg/80 lg:block">
            Pasá el mouse para hacer zoom
          </span>
        )}
      </div>

      {many && (
        <div className="flex gap-2 lg:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === active}
              className={`size-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 sm:size-20 ${
                i === active ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={thumb(src)} alt="" decoding="async" fetchPriority="low" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
