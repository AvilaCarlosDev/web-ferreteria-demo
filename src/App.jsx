import { useMemo, useState } from 'react'
import { MenuMovil, SaltarAlContenido } from './sitio.jsx'
import { useSeccionActiva, wa } from './navegacion.js'

const enlaces = [
  ['catalogo', 'Catálogo'],
  ['departamentos', 'Departamentos'],
  ['paquetes', 'Paquetes'],
  ['servicios', 'Servicios'],
]

const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const categories = ['Todos', 'Construcción', 'Electricidad', 'Plomería', 'Herramientas', 'Pintura', 'Seguridad']

const products = [
  {
    name: 'Cemento UltraMix 42.5kg',
    category: 'Construcción',
    price: '$12.50',
    image: '/img/foto-1503387762592d.jpg',
    stock: '280 sacos',
    badge: 'Obra',
  },
  {
    name: 'Taladro Percutor Pro 750W',
    category: 'Herramientas',
    price: '$68',
    image: '/img/foto-1504148455328c.jpg',
    stock: '18 unidades',
    badge: 'Top',
  },
  {
    name: 'Cable THW #12 por metro',
    category: 'Electricidad',
    price: '$1.20',
    image: '/img/foto-1621905252507b.jpg',
    stock: '1.500 m',
  },
  {
    name: 'Tubería PVC presión 1/2”',
    category: 'Plomería',
    price: '$3.50',
    image: '/img/foto-1607472586893e.jpg',
    stock: '320 tubos',
  },
  {
    name: 'Pintura Acrílica Galón Pro',
    category: 'Pintura',
    price: '$18',
    image: '/img/paint.jpg',
    stock: '74 galones',
    badge: 'Oferta',
  },
  {
    name: 'Kit Seguridad Obra Básico',
    category: 'Seguridad',
    price: '$24',
    image: '/img/safety-kit.jpg',
    stock: '42 kits',
  },
]

const departments = [
  ['Construcción', 'Cemento, arena, cabillas, bloques y químicos para obra.', '/img/foto-15043076512543.jpg'],
  ['Electricidad', 'Cables, breakers, canaletas, luminarias y tableros.', '/img/foto-1621905252507b.jpg'],
  ['Plomería', 'PVC, grifería, conexiones, bombas y tanques.', '/img/foto-1607472586893e.jpg'],
  ['Herramientas', 'Manual, eléctrica, medición, corte y accesorios.', '/img/tools.jpg'],
]

const projectPacks = [
  {
    title: 'Kit Remodelación Baño',
    desc: 'Tuberías, pega, grifería base, silicón, pintura antihongos y accesorios.',
    price: 'Desde $89',
  },
  {
    title: 'Kit Electricista Residencial',
    desc: 'Cableado, breakers, tomas, canaletas, cinta, tester y consumibles.',
    price: 'Desde $64',
  },
  {
    title: 'Kit Obra Gris 20m²',
    desc: 'Cemento, cabilla, arena, discos, guantes y despacho coordinado.',
    price: 'Cotizar',
  },
]

const brands = ['Truper', 'DeWalt', 'Stanley', 'Pavco', 'Sika', '3M', 'Bticino', 'Sherwin']

const services = [
  ['Cotización por lista', 'Envía tu lista de materiales y te devolvemos precio, stock y alternativas.'],
  ['Despacho a obra', 'Coordinamos entrega por zona, volumen y horario de recepción.'],
  ['Atención a contratistas', 'Precios por volumen, facturación y reposición recurrente.'],
  ['Asesoría técnica', 'Te ayudamos a elegir calibre, medida, rendimiento y compatibilidad.'],
]

function App() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [lista, setLista] = useState({})
  const [verLista, setVerLista] = useState(false)
  const activa = useSeccionActiva(enlaces.map(([id]) => id))

  const filteredProducts = useMemo(() => {
    const q = normalizar(busqueda.trim())
    return products.filter(
      (product) =>
        (activeCategory === 'Todos' || product.category === activeCategory) &&
        (!q || normalizar(`${product.name} ${product.category}`).includes(q)),
    )
  }, [activeCategory, busqueda])

  const items = Object.entries(lista)
  const cambiar = (nombre, delta) =>
    setLista((actual) => {
      const cantidad = (actual[nombre] ?? 0) + delta
      const siguiente = { ...actual }
      if (cantidad > 0) siguiente[nombre] = cantidad
      else delete siguiente[nombre]
      return siguiente
    })

  const mensajeLista = items.length
    ? `Hola, quiero cotizar esta lista:\n${items.map(([nombre, cantidad]) => `• ${cantidad} × ${nombre}`).join('\n')}`
    : 'Hola, quiero cotizar una lista de materiales.'

  const verRubro = (rubro) => {
    setActiveCategory(rubro)
    setBusqueda('')
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const buscar = (event) => {
    event.preventDefault()
    setActiveCategory('Todos')
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#eef0ed] text-[#141613] antialiased">
      <SaltarAlContenido className="focus:bg-yellow-400 focus:text-[#141613]" />
      <div className="bg-[#141613] text-[11px] font-black uppercase tracking-[0.18em] text-yellow-300/85">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-8 px-5 py-2.5 md:justify-between">
          <span>Materiales para obra y mantenimiento</span>
          <span className="hidden md:inline">Despacho local coordinado</span>
          <span className="hidden md:inline">Cotizaciones por WhatsApp</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b-4 border-yellow-400 bg-[#eef0ed]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:px-8">
          <a href="#inicio" className="flex shrink-0 items-center gap-3" aria-label="ObraMax inicio">
            <span className="grid h-11 w-11 place-items-center sm:h-12 sm:w-12 bg-[#141613] text-lg font-black text-yellow-300 shadow-xl shadow-black/10">OM</span>
            <span>
              <span className="block font-[family-name:var(--font-display)] text-xl font-bold uppercase">ObraMax Supply</span>
              <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#6b7068]">Ferretería industrial</span>
            </span>
          </a>

          <form role="search" onSubmit={buscar} className="hidden flex-1 items-center border-2 border-[#d7dbd2] bg-white px-4 py-1.5 transition focus-within:border-yellow-400 lg:flex">
            <span aria-hidden="true" className="text-[#6b7068]">⌕</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              aria-label="Buscar material o herramienta"
              className="w-full bg-transparent px-3 py-1 text-sm font-bold outline-none placeholder:text-[#899085]"
              placeholder="Buscar cemento, cable, tubería, taladro..."
            />
            <button className="bg-[#141613] px-5 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-yellow-400 hover:text-[#141613] active:translate-y-px">
              Buscar
            </button>
          </form>

          <nav aria-label="Principal" className="hidden items-center gap-1 text-sm font-black text-[#555b52] lg:flex">
            {enlaces.map(([id, texto]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activa === id ? 'true' : undefined}
                className={`px-3 py-2 transition hover:text-[#141613] ${activa === id ? 'bg-yellow-400 text-[#141613]' : ''}`}
              >
                {texto}
              </a>
            ))}
          </nav>

          <a href={wa(mensajeLista)} className="ml-auto hidden shrink-0 bg-[#141613] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-yellow-400 hover:text-[#141613] sm:inline-flex lg:ml-0">
            Cotizar{items.length > 0 && <span className="tabular ml-2 bg-yellow-400 px-1.5 text-[#141613]">{items.length}</span>}
          </a>
          <div className="ml-auto sm:ml-0">
            <MenuMovil
              enlaces={enlaces}
              activa={activa}
              cta={{ href: wa(mensajeLista), texto: 'Cotizar por WhatsApp' }}
              tono={{
                boton: 'border-2 border-[#141613] text-[#141613]',
                panel: 'border-yellow-400 bg-[#eef0ed] text-[#141613]',
                activo: 'text-[#8a6900]',
                cta: 'bg-yellow-400 text-[#141613]',
              }}
            />
          </div>
        </div>
      </header>

      <main id="contenido">
        <section id="inicio" className="relative isolate overflow-hidden bg-[#141613] text-white">
          <img
            src="/img/foto-15043076512543.jpg"
            alt="Construcción e industria"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,#141613_0%,rgba(20,22,19,.96)_46%,rgba(20,22,19,.42)_100%)]" />
          <div className="absolute right-0 top-0 hidden h-full w-1/3 bg-[repeating-linear-gradient(135deg,rgba(250,204,21,.22)_0_14px,transparent_14px_28px)] lg:block" />

          <div className="mx-auto grid min-h-[740px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
            <div className="max-w-3xl pt-8">
              <div className="mb-7 inline-flex border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
                Proveedor técnico · Punto Fijo
              </div>
              <h1 className="text-6xl font-bold uppercase leading-[0.95] sm:text-7xl lg:text-8xl">
                Materiales listos para obra seria
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62 sm:text-xl">
                Cemento, electricidad, plomería y herramientas con despacho a obra. Mándanos tu lista y te respondemos con precio, stock y sustitutos en menos de una hora.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#catalogo" className="inline-flex items-center justify-center bg-yellow-400 px-8 py-4 text-base font-black uppercase tracking-wide text-[#141613] transition hover:bg-white">
                  Ver catálogo
                </a>
                <a href={wa('Hola, quiero cotizar una lista de materiales. Se la envío en foto.')} className="inline-flex items-center justify-center border border-white/20 bg-white/5 px-8 py-4 text-base font-black uppercase tracking-wide text-white transition hover:bg-white/10">
                  Enviar lista
                </a>
              </div>
              <div className="mt-12 grid max-w-xl grid-cols-3 border border-white/10 bg-white/[0.04]">
                {[
                  ['3.200+', 'productos'],
                  ['45min', 'cotización'],
                  ['24h', 'despacho'],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-white/10 p-5 last:border-r-0">
                    <strong className="tabular block font-[family-name:var(--font-display)] text-3xl font-bold text-yellow-300">{value}</strong>
                    <span className="text-[11px] font-black uppercase tracking-wide text-white/42">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
              <div className="space-y-4 pt-20">
                <div className="bg-yellow-400 p-7 text-[#141613] shadow-2xl shadow-black/30">
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Cotización rápida</p>
                  <h2 className="mt-3 text-4xl font-bold uppercase leading-none">Lista de obra</h2>
                  <p className="mt-4 text-sm font-bold leading-6 opacity-70">Envía una foto o archivo por WhatsApp. Respondemos con disponibilidad y sustitutos.</p>
                </div>
                <div className="border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Despacho hoy</p>
                  <div className="mt-4 space-y-3 text-sm font-bold text-white/60">
                    <div className="tabular flex justify-between"><span>Centro</span><span>$3</span></div>
                    <div className="tabular flex justify-between"><span>Judibana</span><span>$6</span></div>
                    <div className="tabular flex justify-between"><span>Puerta Maraven</span><span>$5</span></div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden border-8 border-white bg-white shadow-2xl shadow-black/30">
                <img src="/img/safety-kit.jpg" alt="Equipo de seguridad industrial" className="h-[520px] w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Marcas que trabajamos" className="bg-yellow-400 py-6 text-[#141613]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 text-sm font-black uppercase tracking-wide lg:px-8">
            {brands.map((brand) => <span key={brand}>{brand}</span>)}
          </div>
        </section>

        <section id="catalogo" className="bg-[#eef0ed] py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#8a6900]">Catálogo técnico</p>
                <h2 className="mt-3 max-w-3xl text-5xl font-bold uppercase sm:text-6xl">Compra por rubro de trabajo</h2>
              </div>
              <p className="max-w-md text-base font-medium leading-7 text-[#555b52]">Precio y existencia de hoy. Arma tu cotización con cantidades y la enviamos lista para aprobar.</p>
            </div>

            <form role="search" onSubmit={buscar} className="mb-4 lg:hidden">
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                aria-label="Buscar material o herramienta"
                placeholder="⌕  Buscar cemento, cable, tubería..."
                className="w-full border-2 border-[#cfd4ca] bg-white px-5 py-3 text-sm font-bold outline-none transition placeholder:text-[#899085] focus:border-yellow-400"
              />
            </form>
            <div className="mb-10 flex gap-3 overflow-x-auto pb-2" role="group" aria-label="Filtrar por rubro">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 border-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide transition ${activeCategory === category ? 'border-[#141613] bg-[#141613] text-white' : 'border-[#cfd4ca] bg-white text-[#555b52] hover:border-yellow-400'}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="border-2 border-dashed border-[#cfd4ca] bg-white px-6 py-14 text-center">
                <p className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase">No está en el catálogo web</p>
                <p className="mx-auto mt-3 max-w-md text-sm font-semibold text-[#555b52]">En tienda hay más de 3.200 referencias. Pregunta por «{busqueda.trim()}» y te confirmamos existencia.</p>
                <a href={wa(`Hola, ¿tienen ${busqueda.trim()}?`)} className="mt-6 inline-flex bg-[#141613] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-yellow-400 hover:text-[#141613]">Preguntar existencia</a>
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <article key={product.name} className="group flex flex-col overflow-hidden border border-[#cfd4ca] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#141613]">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" />
                    {product.badge && <span className="absolute left-4 top-4 bg-yellow-400 px-3 py-1.5 text-xs font-black uppercase text-[#141613]">{product.badge}</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.18em] text-[#6b7068]">
                      <span>{product.category}</span>
                      <span>{product.stock}</span>
                    </div>
                    <h3 className="mt-3 mb-6 text-2xl font-bold uppercase leading-tight">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#e0e4dc] pt-5">
                      <strong className="tabular text-3xl font-black">{product.price}</strong>
                      {lista[product.name] ? (
                        <div className="flex items-center border-2 border-[#141613]" role="group" aria-label={`Cantidad de ${product.name}`}>
                          <button type="button" onClick={() => cambiar(product.name, -1)} aria-label={`Quitar uno de ${product.name}`} className="h-11 w-11 text-xl font-black transition hover:bg-yellow-400">−</button>
                          <span className="tabular w-10 text-center font-black" aria-live="polite">{lista[product.name]}</span>
                          <button type="button" onClick={() => cambiar(product.name, 1)} aria-label={`Agregar uno de ${product.name}`} className="h-11 w-11 text-xl font-black transition hover:bg-yellow-400">+</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => cambiar(product.name, 1)} aria-label={`Agregar ${product.name} a la cotización`} className="bg-[#141613] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-yellow-400 hover:text-[#141613] active:translate-y-px">
                          + Cotizar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="departamentos" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#8a6900]">Departamentos</p>
              <h2 className="mt-3 text-5xl font-bold uppercase sm:text-6xl">Rutas rápidas para comprar</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-4">
              {departments.map(([title, desc, image]) => (
                <button type="button" key={title} onClick={() => verRubro(title)} className="group relative min-h-[300px] overflow-hidden bg-[#141613] text-left md:min-h-[360px]">
                  <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141613] via-[#141613]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="text-3xl font-bold uppercase">{title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white/58">{desc}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-300 transition group-hover:gap-3">Ver productos <span aria-hidden="true">→</span></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="paquetes" className="bg-[#141613] py-24 text-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-300">Paquetes de proyecto</p>
              <h2 className="mt-3 text-5xl font-bold uppercase sm:text-6xl">Soluciones armadas por necesidad</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {projectPacks.map((pack) => (
                <article key={pack.title} className="flex flex-col border border-white/10 bg-white/[0.04] p-7 transition hover:border-yellow-400/60 hover:bg-white/[0.07]">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Pack</p>
                  <h3 className="mt-3 text-3xl font-bold uppercase">{pack.title}</h3>
                  <p className="mt-4 mb-8 text-sm font-semibold leading-6 text-white/55">{pack.desc}</p>
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <strong className="tabular text-2xl font-black text-yellow-300">{pack.price}</strong>
                    <a href={wa(`Hola, quiero el ${pack.title} (${pack.price.toLowerCase()}).`)} aria-label={`Pedir ${pack.title}`} className="bg-yellow-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-[#141613] transition hover:bg-white">
                      Pedir
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="servicios" className="bg-[#eef0ed] py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#8a6900]">Servicio B2B</p>
                <h2 className="mt-3 text-5xl font-bold uppercase">Más que vender: resolvemos la compra</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {services.map(([title, desc]) => (
                  <article key={title} className="border border-[#cfd4ca] bg-white p-6">
                    <h3 className="text-xl font-bold uppercase">{title}</h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-[#555b52]">{desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-yellow-400 px-5 py-20 text-[#141613] lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] opacity-70">Cotización especial</p>
              <h2 className="mt-3 max-w-3xl text-5xl font-bold uppercase leading-none">¿Tienes una lista de materiales?</h2>
              <p className="mt-4 max-w-xl text-base font-bold opacity-70">Mándala por WhatsApp y convertimos tu lista en presupuesto organizado.</p>
            </div>
            <a href={wa('Hola, les envío mi lista de materiales para cotizar.')} className="shrink-0 bg-[#141613] px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-[#141613]">
              Enviar lista
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[#141613] py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center bg-yellow-400 text-sm font-black text-[#141613]">OM</span>
              <div>
                <span className="block text-lg font-black uppercase">ObraMax Supply</span>
                <span className="text-xs font-semibold text-white/45">Ferretería industrial</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/50">Materiales de obra, electricidad, plomería y herramientas con despacho coordinado y cotización por WhatsApp.</p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide">Catálogo</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-white/50">
              <li><a href="#catalogo" className="hover:text-yellow-300">Construcción</a></li>
              <li><a href="#catalogo" className="hover:text-yellow-300">Electricidad</a></li>
              <li><a href="#catalogo" className="hover:text-yellow-300">Herramientas</a></li>
              <li><a href="#paquetes" className="hover:text-yellow-300">Paquetes</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-white/50">
              <li>Punto Fijo, Falcón</li>
              <li><a href={wa()} className="hover:text-yellow-300">WhatsApp: +58 412-000-0000</a></li>
              <li>Lun-Sáb: 7:30 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-5 pt-7 text-center text-xs font-semibold text-white/30 lg:px-8">
          © 2026 ObraMax Supply. Demo creada por Carlos Avila - Developer 🇻🇪 ·{' '}
          <a href="/privacidad/" className="underline underline-offset-2 hover:text-white/60">Privacidad</a>
        </div>
      </footer>

      <aside
        aria-label="Tu cotización"
        className={`fixed inset-x-3 bottom-3 z-40 mx-auto max-w-xl border-2 border-[#141613] bg-yellow-400 text-[#141613] shadow-2xl shadow-black/30 transition duration-300 ${items.length ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
      >
        {verLista && (
          <ul id="lista-cotizacion" className="max-h-64 divide-y divide-[#141613]/15 overflow-y-auto border-b-2 border-[#141613] bg-white px-4">
            {items.map(([nombre, cantidad]) => (
              <li key={nombre} className="flex items-center justify-between gap-3 py-3 text-sm font-bold">
                <span className="min-w-0 truncate">{nombre}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => cambiar(nombre, -1)} aria-label={`Quitar uno de ${nombre}`} className="grid h-8 w-8 place-items-center border border-[#cfd4ca] font-black hover:bg-yellow-400">−</button>
                  <span className="tabular w-8 text-center font-black">{cantidad}</span>
                  <button type="button" onClick={() => cambiar(nombre, 1)} aria-label={`Agregar uno de ${nombre}`} className="grid h-8 w-8 place-items-center border border-[#cfd4ca] font-black hover:bg-yellow-400">+</button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-3 p-3 pl-4">
          <button type="button" onClick={() => setVerLista((v) => !v)} aria-expanded={verLista} aria-controls="lista-cotizacion" className="min-w-0 flex-1 text-left">
            <span className="block text-xs font-black uppercase tracking-[0.18em]">Tu cotización · <span className="tabular">{items.length}</span> {items.length === 1 ? 'producto' : 'productos'}</span>
            <span className="block text-sm font-semibold underline underline-offset-4">{verLista ? 'Ocultar lista' : 'Ver y ajustar cantidades'}</span>
          </button>
          <a href={wa(mensajeLista)} className="shrink-0 bg-[#141613] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-[#141613] active:translate-y-px">
            Enviar
          </a>
        </div>
      </aside>
    </div>
  )
}

export default App
