import { Fragment, useMemo, useState } from 'react'
import { MenuMovil, SaltarAlContenido } from './sitio.jsx'
import { useSeccionActiva, wa } from './navegacion.js'
import { CintaPeligro, Esquinas, GuiaMedidas, TituloSeccion } from './piezas.jsx'

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
    sku: 'CEM-4250',
    presentacion: 'Saco de 42.5 kg',
  },
  {
    name: 'Taladro Percutor Pro 750W',
    category: 'Herramientas',
    price: '$68',
    image: '/img/foto-1504148455328c.jpg',
    stock: '18 unidades',
    badge: 'Top',
    sku: 'TAL-750P',
    presentacion: '750 W · mordaza 13 mm',
  },
  {
    name: 'Cable THW #12 por metro',
    category: 'Electricidad',
    price: '$1.20',
    image: '/img/foto-1621905252507b.jpg',
    stock: '1.500 m',
    sku: 'CAB-TW12',
    presentacion: 'Rollos de 100 m',
  },
  {
    name: 'Tubería PVC presión 1/2”',
    category: 'Plomería',
    price: '$3.50',
    image: '/img/foto-1607472586893e.jpg',
    stock: '320 tubos',
    sku: 'PVC-12P',
    presentacion: 'Barra de 6 m',
  },
  {
    name: 'Pintura Acrílica Galón Pro',
    category: 'Pintura',
    price: '$18',
    image: '/img/paint.jpg',
    stock: '74 galones',
    badge: 'Oferta',
    sku: 'PIN-ACR4',
    presentacion: 'Galón de 3.78 L',
  },
  {
    name: 'Kit Seguridad Obra Básico',
    category: 'Seguridad',
    price: '$24',
    image: '/img/safety-kit.jpg',
    stock: '42 kits',
    sku: 'SEG-KIT1',
    presentacion: '6 piezas',
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
  ['Despacho a obra', 'Coordinamos entrega por zona, volumen y horario de recepción. Tarifas: Centro $3, Judibana $6 y Puerta Maraven $5.'],
  ['Atención a contratistas', 'Precios por volumen, facturación y reposición recurrente.'],
  ['Asesoría técnica', 'Te ayudamos a elegir calibre, medida, rendimiento y compatibilidad.'],
]

const cifras = [
  ['3.200+', 'referencias'],
  ['45 min', 'cotización'],
  ['24 h', 'despacho'],
  ['8', 'marcas'],
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
    <div className="min-h-screen bg-obra-bg text-obra-ink antialiased">
      <SaltarAlContenido className="focus:bg-yellow-400 focus:text-[#141613]" />
      <CintaPeligro className="h-3" />

      <header className="sticky top-0 z-50 border-b-4 border-yellow-400 bg-obra-ink text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:px-8">
          <a href="#inicio" className="flex shrink-0 items-center gap-3" aria-label="ObraMax, inicio">
            <span className="grid h-11 w-11 place-items-center bg-yellow-400 font-mono text-lg font-black text-obra-ink sm:h-12 sm:w-12">OM</span>
            <span>
              <span className="block font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-wide sm:text-xl">ObraMax Supply</span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-yellow-300/85">Ferretería industrial</span>
            </span>
          </a>

          <form role="search" onSubmit={buscar} className="hidden flex-1 items-center border border-white/25 bg-white/10 px-3 py-1.5 transition focus-within:border-yellow-400 lg:flex">
            <span aria-hidden="true" className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300">REF.</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              aria-label="Buscar material o herramienta"
              className="w-full bg-transparent px-3 py-1.5 text-sm font-semibold text-white outline-none placeholder:text-white/60"
              placeholder="Buscar cemento, cable, tubería, taladro..."
            />
            <button className="bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-obra-ink transition hover:bg-white">
              Buscar
            </button>
          </form>

          <nav aria-label="Principal" className="hidden items-center gap-1 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white/70 lg:flex">
            {enlaces.map(([id, texto], i) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activa === id ? 'true' : undefined}
                className={`px-3 py-2 transition hover:text-yellow-300 ${activa === id ? 'bg-yellow-400 text-obra-ink' : ''}`}
              >
                <span aria-hidden="true" className="mr-1.5 opacity-60">{String(i + 1).padStart(2, '0')}</span>
                {texto}
              </a>
            ))}
          </nav>

          <a href={wa(mensajeLista)} className="ml-auto hidden shrink-0 bg-yellow-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-obra-ink transition hover:bg-white sm:inline-flex lg:ml-0">
            Cotizar{items.length > 0 && <span className="tabular ml-2 bg-obra-ink px-1.5 text-yellow-300">{items.length}</span>}
          </a>
          <div className="ml-auto sm:ml-0">
            <MenuMovil
              enlaces={enlaces}
              activa={activa}
              cta={{ href: wa(mensajeLista), texto: 'Cotizar por WhatsApp' }}
              tono={{
                boton: 'border-2 border-yellow-400 text-yellow-300',
                panel: 'border-yellow-400 bg-obra-ink text-white',
                activo: 'text-yellow-300',
                cta: 'bg-yellow-400 text-obra-ink',
              }}
            />
          </div>
        </div>
      </header>

      <main id="contenido">
        <section id="inicio" className="relative isolate overflow-hidden bg-obra-ink text-white">
          <img
            src="/img/foto-15043076512543.jpg"
            alt="Estructura de hormigón de una obra en construcción"
            className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover opacity-30 sm:w-3/5"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,#141613_0%,rgba(20,22,19,.97)_45%,rgba(20,22,19,.55)_100%)]" />
          <div aria-hidden="true" className="rejilla-obra absolute inset-0 -z-10" />

          <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/15 pb-5 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-yellow-300/85">
              <span>Manual de suministro</span>
              <span className="hidden sm:inline">Edición 2026</span>
              <span className="hidden md:inline">Nº OM-01</span>
              <span className="text-white/60 sm:ml-auto">Punto Fijo · Falcón</span>
            </div>

            <div className="relative mt-10 max-w-4xl">
              <h1 className="estarcido text-6xl font-bold uppercase sm:text-7xl lg:text-8xl">
                Materiales listos para obra seria
              </h1>
            </div>

            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/70 sm:text-xl">
              Cemento, electricidad, plomería y herramientas con despacho a obra. Envía tu lista por WhatsApp y recibes precio, stock y sustitutos en menos de una hora.
            </p>

            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#catalogo" className="inline-flex items-center justify-center border-2 border-yellow-400 bg-yellow-400 px-8 py-4 text-base font-black uppercase tracking-wide text-obra-ink transition hover:bg-white hover:border-white">
                  Ver catálogo
                </a>
                <a href={wa('Hola, quiero cotizar una lista de materiales. Se la envío en foto.')} className="inline-flex items-center justify-center border border-white/30 px-8 py-4 text-base font-black uppercase tracking-wide text-white transition hover:bg-white/10">
                  Enviar lista
                </a>
              </div>
              <div className="hidden -rotate-6 border-4 border-double border-yellow-400/70 px-5 py-3 text-center font-mono uppercase text-yellow-300/90 lg:ml-auto lg:block">
                <span className="block text-[11px] font-bold tracking-[0.3em]">Existencias</span>
                <span className="block text-xl font-black tracking-[0.18em]">Verificadas</span>
                <span className="block text-[10px] tracking-[0.3em]">2026 · OM-01</span>
              </div>
            </div>

            <dl className="mt-12 grid max-w-4xl grid-cols-2 gap-px border border-white/20 bg-white/20 sm:grid-cols-4">
              {cifras.map(([value, label]) => (
                <div key={label} className="bg-obra-ink/85 px-5 py-4 backdrop-blur-sm">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">{label}</dt>
                  <dd className="tabular mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-yellow-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <CintaPeligro animada className="h-10 sm:h-12" />
        </section>

        <section aria-label="Marcas que trabajamos" className="border-b-2 border-obra-ink bg-obra-bg py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-obra-slate lg:px-8">
            <span className="bg-obra-ink px-2 py-1 text-yellow-300">Marcas</span>
            {brands.map((brand, i) => (
              <Fragment key={brand}>
                {i > 0 && <span aria-hidden="true" className="text-[#a9afa4]">/</span>}
                <span>{brand}</span>
              </Fragment>
            ))}
            <span className="text-obra-amber">8 fabricantes</span>
          </div>
        </section>

        <section id="catalogo" className="rejilla-papel bg-obra-bg py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <GuiaMedidas className="mb-10" />
            <TituloSeccion
              indice="01"
              etiqueta="Catálogo técnico"
              titulo="Compra por rubro de trabajo"
              nota="Precio y existencia de hoy. Arma tu cotización con cantidades y la enviamos lista para aprobar."
            />

            <form role="search" onSubmit={buscar} className="mb-5 lg:hidden">
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                aria-label="Buscar material o herramienta"
                placeholder="Buscar cemento, cable, tubería..."
                className="w-full border-2 border-obra-ink bg-white px-5 py-3 text-sm font-bold outline-none transition placeholder:text-[#6f756c] focus:border-yellow-400"
              />
            </form>

            <div className="mb-10 flex gap-3 overflow-x-auto pb-2" role="group" aria-label="Filtrar por rubro">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 border-2 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] transition ${activeCategory === category ? 'border-obra-ink bg-obra-ink text-yellow-300' : 'border-[#cfd4ca] bg-white text-obra-muted hover:border-yellow-400'}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="border-2 border-dashed border-obra-ink/40 bg-white px-6 py-14 text-center">
                <p className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase">No está en el catálogo web</p>
                <p className="mx-auto mt-3 max-w-md text-sm font-semibold text-obra-muted">En tienda hay más de 3.200 referencias. Pregunta por «{busqueda.trim()}» y te confirmamos existencia.</p>
                <a href={wa(`Hola, ¿tienen ${busqueda.trim()}?`)} className="mt-6 inline-flex bg-obra-ink px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-yellow-400 hover:text-obra-ink">Preguntar existencia</a>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <article key={product.name} className="group relative flex flex-col border-2 border-obra-ink bg-white transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#141613]">
                  <Esquinas />
                  <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-obra-ink/25 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-obra-slate">
                    <span className="text-obra-ink">SKU {product.sku}</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-obra-ink bg-obra-ink">
                    <img src={product.image} alt={`${product.name}, categoría ${product.category}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    {product.badge && (
                      <span className="absolute left-3 top-3 border-2 border-obra-ink bg-yellow-400 px-2.5 py-1 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-obra-ink">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-2xl font-bold uppercase leading-tight">{product.name}</h3>
                    <dl className="mt-4 border-y border-dashed border-obra-ink/30 font-mono text-[10px] uppercase tracking-[0.14em] text-obra-slate">
                      <div className="flex justify-between gap-3 border-b border-dashed border-obra-ink/20 py-2">
                        <dt>Referencia</dt>
                        <dd className="font-bold text-obra-ink">{product.sku}</dd>
                      </div>
                      <div className="flex justify-between gap-3 border-b border-dashed border-obra-ink/20 py-2">
                        <dt>Presentación</dt>
                        <dd className="text-right font-bold text-obra-ink">{product.presentacion}</dd>
                      </div>
                      <div className="flex justify-between gap-3 border-b border-dashed border-obra-ink/20 py-2">
                        <dt>Existencia</dt>
                        <dd className="tabular font-bold text-obra-ink">{product.stock}</dd>
                      </div>
                      <div className="flex justify-between gap-3 py-2">
                        <dt>Entrega</dt>
                        <dd className="font-bold text-obra-ink">24 h</dd>
                      </div>
                    </dl>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <strong className="tabular text-3xl font-black">{product.price}</strong>
                      {lista[product.name] ? (
                        <div className="flex items-center border-2 border-obra-ink" role="group" aria-label={`Cantidad de ${product.name}`}>
                          <button type="button" onClick={() => cambiar(product.name, -1)} aria-label={`Quitar uno de ${product.name}`} className="h-11 w-11 text-xl font-black transition hover:bg-yellow-400">−</button>
                          <span className="tabular w-10 text-center font-black" aria-live="polite">{lista[product.name]}</span>
                          <button type="button" onClick={() => cambiar(product.name, 1)} aria-label={`Agregar uno de ${product.name}`} className="h-11 w-11 text-xl font-black transition hover:bg-yellow-400">+</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => cambiar(product.name, 1)} aria-label={`Agregar ${product.name} a la cotización`} className="bg-obra-ink px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-yellow-400 hover:text-obra-ink active:translate-y-px">
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
            <GuiaMedidas className="mb-10" />
            <TituloSeccion
              indice="02"
              etiqueta="Índice de departamentos"
              titulo="Rutas rápidas para comprar"
              nota="Cada departamento abre el catálogo filtrado con su rubro listo para cotizar."
            />
            <div className="border-t border-obra-ink/20">
              {departments.map(([title, desc, image], i) => (
                <button
                  type="button"
                  key={title}
                  onClick={() => verRubro(title)}
                  className="group flex w-full items-center gap-4 border-b border-obra-ink/20 px-1 py-5 text-left transition hover:bg-obra-ink hover:text-white sm:gap-6 sm:px-3"
                >
                  <span className="font-mono text-xs font-bold tracking-[0.2em] text-obra-amber group-hover:text-yellow-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <img
                    src={image}
                    alt={`Materiales del departamento de ${title}`}
                    className="h-16 w-24 shrink-0 border border-obra-ink/20 object-cover grayscale transition duration-500 group-hover:grayscale-0 sm:h-20 sm:w-32"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-2xl font-bold uppercase leading-none sm:text-3xl">{title}</span>
                    <span className="mt-2 block text-sm font-medium leading-6 text-obra-muted group-hover:text-white/70">{desc}</span>
                  </span>
                  <span aria-hidden="true" className="font-mono text-xl transition group-hover:translate-x-1">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="paquetes" className="bg-obra-ink py-24 text-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <TituloSeccion
              indice="03"
              etiqueta="Paquetes de proyecto"
              titulo="Soluciones armadas por necesidad"
              nota="Listas cerradas por tipo de obra, con material completo y despacho coordinado."
              tono="oscuro"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {projectPacks.map((pack, i) => (
                <article key={pack.title} className="flex flex-col border border-white/15 bg-white/[0.05] transition hover:border-yellow-400/60">
                  <CintaPeligro className="h-3" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300/85">
                      <span>KIT-{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-white/60">Paquete</span>
                    </div>
                    <h3 className="mt-4 text-3xl font-bold uppercase leading-none">{pack.title}</h3>
                    <p className="mt-4 mb-8 text-sm font-medium leading-6 text-white/70">{pack.desc}</p>
                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/15 pt-5">
                      <strong className="tabular text-2xl font-black text-yellow-300">{pack.price}</strong>
                      <a href={wa(`Hola, quiero el ${pack.title} (${pack.price.toLowerCase()}).`)} aria-label={`Pedir ${pack.title}`} className="bg-yellow-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-obra-ink transition hover:bg-white">
                        Pedir
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="servicios" className="rejilla-papel bg-obra-bg py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <GuiaMedidas className="mb-10" />
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <p className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-obra-amber">
                  <span className="border border-current px-2 py-1">04</span>
                  <span>Servicio B2B</span>
                </p>
                <h2 className="estarcido mt-5 text-5xl font-bold uppercase sm:text-6xl">Más que vender: resolvemos la compra</h2>
                <p className="mt-6 max-w-md text-base font-medium leading-7 text-obra-muted">
                  El mismo trato para una remodelación que para una obra completa: lista, precio y entrega en un solo mensaje.
                </p>
              </div>

              <div className="border-2 border-obra-ink bg-white">
                <div className="flex items-center justify-between border-b-2 border-obra-ink bg-obra-ink px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300">
                  <span>Checklist de obra</span>
                  <span>4 puntos</span>
                </div>
                <ul>
                  {services.map(([title, desc], i) => (
                    <li key={title} className="flex gap-4 border-b border-dashed border-obra-ink/25 p-5 last:border-b-0 sm:gap-5 sm:p-6">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border-2 border-obra-ink bg-yellow-400">
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="#141613" strokeWidth="3" aria-hidden="true">
                          <path d="m4 10.5 4 4 8-9" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-obra-amber">{String(i + 1).padStart(2, '0')}</span>
                          <h3 className="text-xl font-bold uppercase">{title}</h3>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-6 text-obra-muted">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t-2 border-dashed border-obra-ink/30 px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-obra-slate sm:px-6">
                  Atención de lunes a sábado · Punto Fijo
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-yellow-400 text-obra-ink">
          <CintaPeligro className="h-4" />
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-16 md:flex-row md:items-center lg:px-8">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.3em]">Orden de compra</p>
              <h2 className="estarcido mt-4 max-w-3xl text-5xl font-bold uppercase sm:text-6xl">¿Tienes una lista de materiales?</h2>
              <p className="mt-4 max-w-xl text-base font-bold text-obra-ink/80">Mándala por WhatsApp y convertimos tu lista en presupuesto organizado.</p>
            </div>
            <a href={wa('Hola, les envío mi lista de materiales para cotizar.')} className="shrink-0 border-2 border-obra-ink bg-obra-ink px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-obra-ink">
              Enviar lista
            </a>
          </div>
          <CintaPeligro className="h-4" />
        </section>
      </main>

      <footer className="bg-obra-ink text-white">
        <CintaPeligro className="h-4" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center bg-yellow-400 font-mono text-sm font-black text-obra-ink">OM</span>
              <div>
                <span className="block text-lg font-black uppercase">ObraMax Supply</span>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/60">Ferretería industrial</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/60">Materiales de obra, electricidad, plomería y herramientas con despacho coordinado y cotización por WhatsApp.</p>
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Catálogo</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-white/60">
              <li><a href="#catalogo" className="hover:text-yellow-300">Construcción</a></li>
              <li><a href="#catalogo" className="hover:text-yellow-300">Electricidad</a></li>
              <li><a href="#catalogo" className="hover:text-yellow-300">Herramientas</a></li>
              <li><a href="#paquetes" className="hover:text-yellow-300">Paquetes</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-white/60">
              <li>Punto Fijo, Falcón</li>
              <li><a href={wa()} className="hover:text-yellow-300">WhatsApp: +58 412-000-0000</a></li>
              <li>Lun-Sáb: 7:30 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-white/15 px-5 py-7 text-center text-xs font-semibold text-white/60 lg:px-8">
          © 2026 ObraMax Supply. Demo creada por Carlos Avila - Developer 🇻🇪 ·{' '}
          <a href="/privacidad/" className="underline underline-offset-2 hover:text-white">Privacidad</a>
        </div>
      </footer>

      <aside
        aria-label="Tu cotización"
        className={`fixed inset-x-3 bottom-3 z-40 mx-auto max-w-xl border-2 border-obra-ink bg-yellow-400 text-obra-ink shadow-2xl shadow-black/30 transition duration-300 ${items.length ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
      >
        {verLista && (
          <ul id="lista-cotizacion" className="max-h-64 divide-y divide-obra-ink/15 overflow-y-auto border-b-2 border-obra-ink bg-white px-4">
            {items.map(([nombre, cantidad]) => (
              <li key={nombre} className="flex items-center justify-between gap-3 py-3 text-sm font-bold">
                <span className="min-w-0 truncate">{nombre}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => cambiar(nombre, -1)} aria-label={`Quitar uno de ${nombre}`} className="grid h-8 w-8 place-items-center border border-obra-ink/30 font-black hover:bg-yellow-400">−</button>
                  <span className="tabular w-8 text-center font-black">{cantidad}</span>
                  <button type="button" onClick={() => cambiar(nombre, 1)} aria-label={`Agregar uno de ${nombre}`} className="grid h-8 w-8 place-items-center border border-obra-ink/30 font-black hover:bg-yellow-400">+</button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-3 p-3 pl-4">
          <button type="button" onClick={() => setVerLista((v) => !v)} aria-expanded={verLista} aria-controls="lista-cotizacion" className="min-w-0 flex-1 text-left">
            <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.18em]">Tu cotización · <span className="tabular">{items.length}</span> {items.length === 1 ? 'producto' : 'productos'}</span>
            <span className="block text-sm font-semibold underline underline-offset-4">{verLista ? 'Ocultar lista' : 'Ver y ajustar cantidades'}</span>
          </button>
          <a href={wa(mensajeLista)} className="shrink-0 bg-obra-ink px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-obra-ink active:translate-y-px">
            Enviar
          </a>
        </div>
      </aside>
    </div>
  )
}

export default App
