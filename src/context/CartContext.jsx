import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { PRODUCTS } from '../data/products'
import { formatTotal } from '../lib/format'

const STORAGE_KEY = 'enanito-cart-v1'
const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

const CartContext = createContext(null)

// Estado: { [productId]: cantidad }
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, [action.id]: (state[action.id] ?? 0) + (action.qty ?? 1) }
    case 'dec': {
      const qty = (state[action.id] ?? 0) - 1
      if (qty > 0) return { ...state, [action.id]: qty }
      const { [action.id]: _, ...rest } = state
      return rest
    }
    case 'remove': {
      const { [action.id]: _, ...rest } = state
      return rest
    }
    case 'clear':
      return {}
    case 'hydrate':
      return action.items
    default:
      return state
  }
}

function loadInitial() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    // Descarta productos que ya no existen en el catálogo
    return Object.fromEntries(
      Object.entries(saved).filter(([id, qty]) => PRODUCT_BY_ID[id] && Number.isInteger(qty) && qty > 0),
    )
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  // Arranca vacío (igual que el HTML pre-renderizado) y recupera lo guardado al montar
  const [items, dispatch] = useReducer(reducer, {})
  const [isOpen, setOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()
  const restored = useRef(false)

  useEffect(() => {
    dispatch({ type: 'hydrate', items: loadInitial() })
  }, [])

  useEffect(() => {
    // No pisar lo guardado antes de haberlo leído
    if (!restored.current) {
      restored.current = true
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* almacenamiento no disponible: el carrito vive solo en memoria */
    }
  }, [items])

  const add = useCallback((id) => {
    dispatch({ type: 'add', id })
    clearTimeout(toastTimer.current)
    setToast({ key: Date.now(), product: PRODUCT_BY_ID[id] })
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const value = useMemo(() => {
    const lines = Object.entries(items).map(([id, qty]) => ({ product: PRODUCT_BY_ID[id], qty }))
    const total = lines.reduce((sum, l) => sum + (l.product.price ?? 0) * l.qty, 0)
    return {
      items,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total,
      totalLabel: formatTotal(lines, total),
      qtyOf: (id) => items[id] ?? 0,
      add,
      inc: (id) => dispatch({ type: 'add', id }),
      dec: (id) => dispatch({ type: 'dec', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      toast,
    }
  }, [items, isOpen, toast, add])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
