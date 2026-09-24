import { memo, useRef } from 'react'
import { BRAND_BY_ID } from '../../data/brands'
import { formatPrice } from '../../lib/format'
import { responsive, SIZES } from '../../lib/image'
import { flyToCart } from '../../lib/flyToCart'
import AddToCart from './AddToCart'

function ProductCard({ product, onOpen }) {
  const brand = BRAND_BY_ID[product.brand]
  const [cover, hover] = product.images
  const imgRef = useRef(null)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-ink-2 transition-[border-color,box-shadow,transform] duration-500 ease-out-quint hover:-translate-y-1 hover:border-line-strong hover:shadow-2xl hover:shadow-black/50 sm:rounded-3xl">
      <button
        onClick={onOpen}
        aria-label={`Ver detalle de ${product.name}`}
        className="relative block aspect-[4/5] overflow-hidden bg-ink-3"
      >
        <img
          ref={imgRef}
          {...responsive(cover, SIZES.card)}
          alt={product.name}
          width="640"
          height="800"
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 size-full object-cover object-top transition-[opacity,transform] duration-700 ease-out-quint group-hover:scale-[1.05] ${hover ? 'group-hover:opacity-0' : ''}`}
        />
        {hover && (
          <img
            {...responsive(hover, SIZES.card)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 hidden size-full scale-[1.05] object-cover object-top opacity-0 transition-[opacity,transform] duration-700 ease-out-quint group-hover:scale-100 group-hover:opacity-100 [@media(hover:hover)]:block"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

        {product.tag && (
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-ink sm:left-3 sm:top-3 sm:px-2.5 sm:text-[10px]">
            {product.tag}
          </span>
        )}
        {product.images.length > 1 && (
          <span className="absolute bottom-2 left-2 flex gap-1 sm:hidden" aria-hidden>
            {product.images.map((src) => (
              <span key={src} className="h-1 w-3 rounded-full bg-white/70 first:bg-white" />
            ))}
          </span>
        )}
        <span className="glass absolute bottom-2.5 right-2.5 hidden translate-y-2 rounded-full px-3 py-1.5 text-[11px] font-semibold opacity-0 transition-all duration-500 ease-out-quint group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          Ver detalle
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-subtle sm:text-[11px]">
          <span className="size-1.5 shrink-0 rounded-full" style={{ background: brand.accent }} />
          <span className="truncate">{brand.name}</span>
        </span>
        <h3 className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-snug sm:text-base">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted max-sm:hidden">{product.description}</p>

        <div className="mt-auto flex flex-col gap-2.5 pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <span className={`font-extrabold tracking-tight tabular-nums ${product.price == null ? 'text-xs text-muted sm:text-sm' : 'text-base sm:text-lg'}`}>
            {formatPrice(product.price)}
          </span>
          <AddToCart productId={product.id} compact onAdded={() => flyToCart(imgRef.current)} />
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)
