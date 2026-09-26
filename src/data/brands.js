// Las 4 embajadas. `id` coincide con la carpeta /public/products/<id>/
// `accent` tiñe fondos, puntos, bordes y brillos de cada marca.
// `text`   es el mismo color en versión oscura, legible como texto sobre fondo claro.
// `story`  es la historia que aparece en el inicio (foto vertical + frase corta).
// `services` (opcional) se muestra como lista en la tarjeta de la marca.
// `formal` (opcional) quita las menciones al Enanito en los textos de esa marca.

const img = (brand, file) => `/products/${brand}/${file}.webp`

export const BRANDS = [
  {
    id: 'zoe',
    name: 'Zoe Importaciones',
    short: 'Zoe',
    instagram: 'https://www.instagram.com/zoeee.impotaciones/',
    handle: '@zoeee.impotaciones',
    category: 'Artículos importados',
    accent: '#ff4fa3',
    text: '#c01a72',
    // Varias fotos → se muestran en mosaico
    cover: [img('zoe', 'samsung-galaxy-a26'), img('zoe', 'nike-cortez'), img('zoe', 'camara-wifi-smart')],
    tagline: 'Del exterior a la puerta de tu casa.',
    description:
      'Artículos importados: celulares, cámaras de seguridad, zapatillas originales, bebidas premium y mucho más. Zoe trae del exterior lo que cuesta conseguir y te lo lleva a la puerta de tu casa, con atención directa.',
    alliance:
      'El Enanito prueba y muestra cada ingreso antes que nadie: si pasa por sus manos, es porque vale la pena.',
    story: { image: img('zoe', 'nike-cortez'), caption: 'Artículos importados, del exterior a la puerta de tu casa.' },
  },
  {
    id: 'ng',
    name: 'NG Consultora',
    short: 'NG',
    instagram: 'https://www.instagram.com/ng.consultora.hys/',
    handle: '@ng.consultora.hys',
    category: 'Seguridad e Higiene Laboral',
    accent: '#5b7fe8',
    text: '#1e3fa8',
    formal: true,
    cover: img('ng', 'equipo-en-accion'),
    tagline: 'Tu empresa segura, tu equipo protegido.',
    description:
      'Asesoramiento y servicios de Seguridad e Higiene Laboral: mediciones de iluminación y ruido, planes de evacuación, capacitaciones, investigación de accidentes y cursos de RCP. Cumplimos la normativa y prevenimos riesgos.',
    allianceLabel: 'A cargo',
    alliance:
      'Emanuel acompaña a cada empresa con compromiso, profesionalismo y experiencia para cumplir la normativa y prevenir riesgos.',
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
    text: '#8a6a00',
    cover: img('reco', 'stand-tactika'),
    tagline: 'Confort y resistencia para el servicio.',
    description:
      'Borceguíes Rocky, camperas tipo M1 Alpha, softshell y Gore-Tex, uniformes BDU, chalecos, pantalones cargo y accesorios de supervivencia. Equipamiento táctico para fuerzas de seguridad, outdoor y uso urbano.',
    alliance:
      'Equipo que aguanta todo, igual que el Enanito. Lo usa en la calle, en el campo y en cada aventura que comparte.',
    story: { image: img('reco', 'botas-rocky-negras'), caption: 'Borceguíes Rocky, camperas M1 Alpha y equipo táctico.' },
  },
  {
    id: 'apache',
    name: 'Apache Indumentaria',
    short: 'Apache',
    instagram: 'https://www.instagram.com/apacheindumentaria_/reels/',
    handle: '@apacheindumentaria_',
    website: 'https://www.actitudapache.com/',
    category: 'Camisetas, conjuntos y sublimación',
    accent: '#74acdf',
    text: '#1f6aa8',
    cover: img('apache', 'showroom'),
    tagline: 'Ropa con actitud, para vos y para tu equipo.',
    description:
      'Camisetas de la Selección Argentina y de otras selecciones, y de equipos nacionales e internacionales, en todas las categorías. Además, banderas personalizadas, conjuntos para tu equipo y sublimación de remeras.',
    services: [
      'Camisetas de selecciones y de equipos nacionales e internacionales, todas las categorías',
      'Banderas personalizadas',
      'Conjuntos de pantalón y camiseta para fútbol, básquet, vóley y más',
      'Estampado y sublimación de remeras para empresas y eventos',
    ],
    alliance:
      'Nadie alienta más fuerte que el Enanito. Apache viste su pasión celeste y blanca, y la de todo tu equipo.',
    story: { image: img('apache', 'camiseta-faa'), caption: 'Camisetas de selecciones y clubes, conjuntos y sublimación.' },
  },
]

export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b]))
