import { createRoot, hydrateRoot } from 'react-dom/client'
import Root from './Root'
import './index.css'

const container = document.getElementById('root')

// En producción el HTML ya viene pre-renderizado (npm run build): React solo lo "activa".
// En desarrollo el contenedor llega vacío y se renderiza normal.
if (container.hasChildNodes()) hydrateRoot(container, <Root />)
else createRoot(container).render(<Root />)
