// Las 4 embajadas. `id` coincide con la carpeta /public/products/<id>/
// `accent` tiñe chips, bordes y brillos de cada marca.
// `story` es la historia que aparece en el inicio (foto vertical + frase corta).

const img = (brand, file) => `/products/${brand}/${file}.webp`

export const BRANDS = [
  {
    id: 'zoe',
    name: 'Zoe Importaciones',
    short: 'Zoe',
    instagram: 'https://www.instagram.com/zoeee.impotaciones/',
    handle: '@zoeee.impotaciones',
    category: 'Importados · Tecnología · Moda',
    accent: '#ff4fa3',
    // Varias fotos → se muestran en mosaico
    cover: [img('zoe', 'samsung-galaxy-a26'), img('zoe', 'nike-cortez'), img('zoe', 'camara-wifi-smart')],
    tagline: 'Lo que buscás, traído de afuera.',
    description:
      'Celulares, cámaras de seguridad, zapatillas originales y bebidas premium importadas. Zoe acerca productos que cuesta conseguir, a precio de importador y con atención directa.',
    alliance:
      'El Enanito prueba y muestra cada ingreso antes que nadie: si pasa por sus manos, es porque vale la pena.',
    story: { image: img('zoe', 'nike-cortez'), caption: 'Zapatillas, celulares y tecnología importada.' },
  },
  {
    id: 'ng',
    name: 'NG Consultora',
    short: 'NG',
    instagram: 'https://www.instagram.com/ng.consultora.hys/',
    handle: '@ng.consultora.hys',
    category: 'Seguridad e Higiene Laboral',
    accent: '#4f7bff',
    cover: img('ng', 'equipo-en-accion'),
    tagline: 'Tu empresa segura, tu equipo protegido.',
    description:
      'Asesoramiento y servicios de Seguridad e Higiene Laboral: mediciones de iluminación y ruido, planes de evacuación, capacitaciones, investigación de accidentes y cursos de RCP. Cumplen la normativa y previenen riesgos.',
    alliance:
      'Prevenir hoy, proteger siempre. El Enanito lleva el mensaje de la prevención a eventos, empresas y a toda la comunidad.',
    story: { image: img('ng', 'equipo-en-accion'), caption: 'Seguridad laboral y capacitaciones para tu empresa.' },
  },
  {
    id: 'reco',
    name: 'Reco.tactika',
    short: 'Reco',
    instagram: 'https://www.instagram.com/reco.tactika/',
    handle: '@reco.tactika',
    category: 'Indumentaria & Accesorios Tácticos',
    accent: '#f5c518',
    cover: img('reco', 'stand-tactika'),
    tagline: 'Confort y resistencia para el servicio.',
    description:
      'Botas Rocky, camperas softshell y Gore-Tex, uniformes BDU, chalecos, pantalones cargo y accesorios de supervivencia. Equipamiento táctico pensado para fuerzas de seguridad, outdoor y uso urbano.',
    alliance:
      'Equipo que aguanta todo, igual que el Enanito. Lo usa en la calle, en el campo y en cada aventura que comparte.',
    story: { image: img('reco', 'botas-rocky-negras'), caption: 'Botas Rocky, camperas y equipo táctico.' },
  },
  {
    id: 'apache',
    name: 'Apache Indumentaria',
    short: 'Apache',
    instagram: 'https://www.instagram.com/apacheindumentaria_/reels/',
    handle: '@apacheindumentaria_',
    website: 'https://www.actitudapache.com/',
    category: 'Camisetas & Bordados personalizados',
    accent: '#74acdf',
    cover: img('apache', 'showroom'),
    tagline: 'Ropa con actitud. Y con tres estrellas.',
    description:
      'Camisetas de la Selección con parches de campeón del mundo, dorsales y bordados a medida: escudos, banderas, insignias de la Fuerza Aérea y lo que se te ocurra.',
    alliance:
      'Nadie alienta más fuerte que el Enanito. Apache viste su pasión celeste y blanca, bordada a medida.',
    story: { image: img('apache', 'camiseta-faa'), caption: 'Camisetas de la Selección bordadas a medida.' },
  },
]

export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b]))
