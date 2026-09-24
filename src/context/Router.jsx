import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useJumpTo, useScrollTo } from './SmoothScroll'

// ─────────────────────────────────────────────────────────────
//  Router mínimo (sin dependencias):
//    /                  → inicio
//    /producto/<id>/    → página de un producto
//  Usa View Transitions (si el navegador las soporta) para que la foto
//  del producto "viaje" de la tarjeta a la página y de vuelta.
// ─────────────────────────────────────────────────────────────

const RouterContext = createContext(null)

export const productPath = (id) => `/producto/${id}/`
export const matchProduct = (path) => path.match(/^\/producto\/([^/]+)\/?$/)?.[1] ?? null

// Qué producto hace el "morph" en la transición actual (lo leen las tarjetas al renderizar)
let morphId = null
export const getMorphId = () => morphId
export const morphName = (id) => `product-${id}`

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function withTransition(update) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced) {
    flushSync(update)
    return Promise.resolve()
  }
  const vt = document.startViewTransition(() => flushSync(update))
  vt.finished.finally(() => (morphId = null))
  return vt.updateCallbackDone
}

export function RouterProvider({ initialPath, children }) {
  const [path, setPath] = useState(() => initialPath ?? window.location.pathname)
  const [hasNavigated, setHasNavigated] = useState(false)
  const pendingScroll = useRef(null)
  const currentPath = useRef(path)
  currentPath.current = path
  const jumpTo = useJumpTo()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const onPop = (e) => {
      morphId = matchProduct(window.location.pathname) ?? matchProduct(currentPath.current)
      pendingScroll.current = e.state?.scrollY ?? 0
      withTransition(() => {
        setHasNavigated(true)
        setPath(window.location.pathname)
      })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Aplica el scroll pendiente apenas se pinta la nueva página (dentro de la transición)
  useIsoLayoutEffect(() => {
    if (pendingScroll.current == null) return
    jumpTo(pendingScroll.current)
    pendingScroll.current = null
  }, [path])

  /**
   * Navega a `to`. Opciones:
   *  - scroll: número de posición inicial (por defecto arriba de todo) o `false` para no tocarlo
   *  - morph: id del producto cuya foto hace la transición
   */
  const navigate = useCallback((to, { scroll = 0, morph = null } = {}) => {
    if (to === window.location.pathname) return Promise.resolve()
    history.replaceState({ ...history.state, scrollY: window.scrollY }, '')
    history.pushState({ scrollY: 0 }, '', to)
    morphId = morph
    pendingScroll.current = scroll === false ? null : scroll
    return withTransition(() => {
      setHasNavigated(true)
      setPath(to)
    })
  }, [])

  const value = useMemo(
    () => ({ path, navigate, hasNavigated, productId: matchProduct(path), isHome: path === '/' }),
    [path, navigate, hasNavigated],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter debe usarse dentro de <RouterProvider>')
  return ctx
}

/** Ir a una sección del inicio (#tienda, #embajadas…) desde cualquier página. */
export function useGoToSection() {
  const { isHome, navigate } = useRouter()
  const scrollTo = useScrollTo()
  return async (hash) => {
    if (!isHome) {
      await navigate('/')
      // Esperar un frame para que el inicio tenga su altura real
      await new Promise((r) => requestAnimationFrame(r))
    }
    if (hash === 0 || hash === '#inicio') scrollTo(0)
    else scrollTo(hash)
  }
}

/**
 * Props para un link a un producto: respeta ctrl/cmd+click (nueva pestaña)
 * y hace la transición de la foto con la tarjeta que se tocó.
 */
export function useProductLink() {
  const { navigate } = useRouter()
  return (id, getImageEl) => ({
    href: productPath(id),
    onClick: (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      const el = getImageEl?.()
      if (el) el.style.viewTransitionName = morphName(id)
      navigate(productPath(id), { morph: id })
    },
  })
}
