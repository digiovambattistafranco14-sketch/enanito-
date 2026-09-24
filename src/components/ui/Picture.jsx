import { m } from 'motion/react'
import { avifSrcSet, responsive } from '../../lib/image'

/**
 * Foto responsive con AVIF (más liviano) y WebP de respaldo.
 *  - `className` va al <picture>. Por defecto es `contents` (no genera caja), así las clases
 *    de posición de `imgClassName` funcionan igual que en un <img> suelto.
 *  - `motion`: usa <m.picture> para animarla (entonces `className` debe darle una caja).
 */
export default function Picture({
  src,
  sizes,
  alt = '',
  className = 'contents',
  imgClassName,
  imgRef,
  motion = false,
  loading,
  fetchPriority,
  width,
  height,
  ...rest
}) {
  const Tag = motion ? m.picture : 'picture'
  return (
    <Tag className={className} {...rest}>
      <source type="image/avif" srcSet={avifSrcSet(src)} sizes={sizes} />
      <img
        ref={imgRef}
        {...responsive(src, sizes)}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
        decoding="async"
        draggable={false}
        className={imgClassName}
      />
    </Tag>
  )
}
