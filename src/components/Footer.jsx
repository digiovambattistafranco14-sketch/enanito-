import { SITE } from '../config/site'
import { BRANDS } from '../data/brands'
import { useScrollTo } from '../context/SmoothScroll'
import Reveal from './ui/Reveal'
import { ArrowUpRightIcon, InstagramIcon } from './ui/icons'

export default function Footer() {
  const scrollTo = useScrollTo()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]" />

      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">
              <span className="h-px w-8 bg-accent" /> Seguilo
            </span>
            <p className="mt-4 max-w-md text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              Contenido, sorteos y novedades de las embajadas, todos los días en Instagram.
            </p>
          </div>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-14 items-center gap-3 rounded-full bg-white pl-2 pr-6 font-bold text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
              <InstagramIcon className="size-5" />
            </span>
            {SITE.handle}
            <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold">Embajadas oficiales</p>
            <ul className="mt-4 grid gap-2.5">
              {BRANDS.map((b) => (
                <li key={b.id}>
                  <a href={b.instagram} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-fg">
                    <span className="size-2 rounded-full transition-transform duration-300 group-hover:scale-150" style={{ background: b.accent }} />
                    {b.name}
                    <span className="text-subtle">{b.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Navegación</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted">
              {[
                ['#embajadas', 'Embajadas'],
                ['#como-comprar', 'Cómo comprar'],
                ['#tienda', 'Tienda'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollTo(href)
                    }}
                    className="transition-colors hover:text-fg"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Pedidos</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Armá tu carrito en la tienda y envialo por WhatsApp. Te respondemos con precios y stock de cada marca.
            </p>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="mt-16 select-none whitespace-nowrap text-center text-[clamp(3rem,15vw,15rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.09)]"
      >
        Ordoni<span className="[-webkit-text-stroke:1px_var(--color-accent)]">eee</span>
      </p>

      <div className="container-x relative flex flex-col gap-2 border-t border-line py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {SITE.name}. Todos los derechos reservados.
        </p>
        <p>
          Diseño y desarrollo por{' '}
          <a href={SITE.credits.url} target="_blank" rel="noreferrer" className="font-semibold text-fg/80 transition-colors hover:text-accent">
            {SITE.credits.label}
          </a>
        </p>
      </div>
    </footer>
  )
}
