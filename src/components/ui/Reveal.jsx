import { m } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]

/** Aparición suave al entrar en pantalla (una sola vez). */
export default function Reveal({ as = 'div', delay = 0, y = 24, className, children, ...rest }) {
  const Component = m[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Component>
  )
}

export { EASE }
