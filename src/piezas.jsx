import { useEffect, useRef, useState } from 'react'
import { cancelarCuadro, programarCuadro, useEnViewport, useMovimientoReducido, useScroll } from './motion.js'

const CICLO_CINTA = 50.9117

const RUTA_BASE = 'M0 31.5 H400'

const RUTA_MARCAS = Array.from(
  { length: 41 },
  (_, i) => `M${i * 10} 31.5 V${i % 5 === 0 ? 11.5 : 23.5}`,
).join(' ')

const agrupar = (numero) => String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export function CintaPeligro({ animada = false, className = '' }) {
  const referencia = useRef(null)
  const reducido = useMovimientoReducido()
  const corriendo = animada && !reducido

  useScroll(() => {
    const cinta = referencia.current
    if (!cinta) return
    const rect = cinta.getBoundingClientRect()
    const alto = window.innerHeight || 0
    if (rect.bottom < -120 || rect.top > alto + 120) return
    const recorrido = (alto - rect.top) * 0.4
    cinta.style.setProperty('--cinta-x', `${(recorrido % CICLO_CINTA).toFixed(2)}px`)
  }, corriendo)

  return (
    <div
      ref={referencia}
      aria-hidden="true"
      className={`cinta-peligro ${animada ? 'cinta-animada' : ''} ${corriendo ? 'cinta-corriendo' : ''} ${className}`}
    />
  )
}

export function Contador({ destino, sufijo = '', duracion = 1400, className = '' }) {
  const [referencia, visto] = useEnViewport({ umbral: 0.5 })
  const reducido = useMovimientoReducido()
  const [texto, setTexto] = useState(() => agrupar(destino))
  const [corriendo, setCorriendo] = useState(false)

  useEffect(() => {
    if (!visto || reducido) return undefined
    let cuadro = 0
    let inicio = 0
    const paso = (ahora) => {
      if (!inicio) {
        inicio = ahora
        setTexto(agrupar(0))
        setCorriendo(true)
      }
      const avance = Math.min(1, (ahora - inicio) / duracion)
      setTexto(agrupar(Math.round(destino * (1 - (1 - avance) ** 3))))
      if (avance < 1) cuadro = programarCuadro(paso)
    }
    cuadro = programarCuadro(paso)
    return () => cancelarCuadro(cuadro)
  }, [visto, reducido, destino, duracion])

  const oculto = !reducido && !corriendo

  return (
    <span ref={referencia} className={`contador tabular font-mono ${oculto ? 'contador-oculto' : ''} ${className}`}>
      {texto}
      {sufijo}
    </span>
  )
}

export function Aparece({ children, indice = 0, className = '' }) {
  const [referencia, visto] = useEnViewport()

  return (
    <div
      ref={referencia}
      className={`aparece ${visto ? 'visto' : ''} ${className}`}
      style={{ transitionDelay: `${indice * 90}ms` }}
    >
      {children}
    </div>
  )
}

export function GuiaMedidas({ className = '' }) {
  const [referencia, visto] = useEnViewport({ umbral: 0.4, margen: '0px 0px -20px 0px' })
  const reducido = useMovimientoReducido()

  return (
    <div ref={referencia} aria-hidden="true" className={`flex items-end gap-3 text-[#141613]/45 ${className}`}>
      <svg
        viewBox="0 0 400 32"
        preserveAspectRatio="none"
        className={`regla-svg h-8 flex-1 ${reducido ? '' : 'animar'} ${visto ? 'dibujada' : ''}`}
      >
        <path className="trazo linea" d={RUTA_BASE} pathLength="1" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path className="trazo marcas" d={RUTA_MARCAS} pathLength="1" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]">cm</span>
    </div>
  )
}

export function TituloSeccion({ indice, etiqueta, titulo, nota, tono = 'claro' }) {
  const oscuro = tono === 'oscuro'
  return (
    <div className="mb-11 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className={`flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] ${oscuro ? 'text-yellow-300' : 'text-obra-amber'}`}>
          <span className={`border px-2 py-1 ${oscuro ? 'border-yellow-400/60' : 'border-current'}`}>{indice}</span>
          <span>{etiqueta}</span>
        </p>
        <h2 className={`estarcido mt-5 max-w-3xl text-5xl font-bold uppercase sm:text-6xl ${oscuro ? 'text-white' : 'text-[#141613]'}`}>
          {titulo}
        </h2>
      </div>
      {nota && (
        <p className={`max-w-md text-base font-medium leading-7 ${oscuro ? 'text-white/70' : 'text-obra-muted'}`}>{nota}</p>
      )}
    </div>
  )
}

const PIN_D = 'M12 0C5.373 0 0 5.373 0 12c0 8.25 12 22 12 22s12-13.75 12-22c0-6.627-5.373-12-12-12z'

const VERTICALES = [40, 130, 220, 310, 400, 490, 580]

const HORIZONTALES = [40, 100, 300, 360, 410]

const EDIFICIOS = [
  [64, 59, 58, 34],
  [154, 122, 58, 48],
  [334, 126, 56, 44],
  [64, 230, 56, 58],
  [424, 228, 56, 60],
  [234, 319, 64, 32],
  [514, 319, 56, 32],
  [424, 378, 54, 26],
]

const RUTA_LLEGADA = 'M20 416 H300 Q318 416 318 398 V130'

const anchoEtiqueta = (texto, tam) => Math.round(texto.length * tam * 0.66) + 20

function PinMapa({ x, y, escala = 1, principal = false, rebotar = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <ellipse cx="0" cy="2" rx="7" ry="2.4" fill="#141613" opacity="0.25" />
      <g className={`mapa-entra mapa-pin-principal ${principal && rebotar ? 'rebota' : ''}`}>
        <g transform="translate(-12 -34)">
          <path d={PIN_D} fill="#ea4335" />
          <circle cx="12" cy="12" r="4.6" fill="#ffffff" />
        </g>
      </g>
    </g>
  )
}

function EtiquetaMapa({ x, y, texto, tam = 14, anclaje = 'middle' }) {
  const baseX = Number(x)
  const baseY = Number(y)
  const ancho = anchoEtiqueta(texto, tam)
  const inicio = anclaje === 'start' ? baseX : baseX - ancho / 2
  return (
    <g>
      <rect x={inicio + 1} y={baseY + 2} width={ancho} height="26" rx="3" fill="#141613" opacity="0.14" />
      <rect x={inicio} y={baseY} width={ancho} height="26" rx="3" fill="#ffffff" stroke="#dadce0" />
      <text
        x={inicio + ancho / 2}
        y={baseY + 18}
        textAnchor="middle"
        fontSize={tam}
        fontWeight="700"
        letterSpacing="1"
        fill="#1f1f1f"
        className="font-mono"
      >
        {texto}
      </text>
    </g>
  )
}

export function MapaUbicacion({ className = '' }) {
  const [referencia, visto] = useEnViewport({ umbral: 0.2, margen: '0px 0px -60px 0px' })
  const reducido = useMovimientoReducido()

  return (
    <figure
      ref={referencia}
      className={`border-4 border-yellow-400 bg-obra-ink p-2 shadow-[10px_10px_0_0_rgba(20,22,19,0.2)] ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-yellow-300">
        <span>REF. MAPA · OM-01</span>
        <span className="text-white/45">Punto Fijo · Falcón</span>
      </div>

      <div className="overflow-hidden border-2 border-yellow-400/30 bg-[#e8eaed]">
        <svg
          viewBox="0 0 640 430"
          role="img"
          aria-labelledby="mapa-titulo mapa-descripcion"
          className={`mapa-svg block h-auto w-full ${reducido ? '' : 'animar'} ${visto ? 'dibujada' : ''}`}
        >
          <title id="mapa-titulo">Mapa de ubicación de ObraMax Supply</title>
          <desc id="mapa-descripcion">
            Plano esquemático de Punto Fijo con la sucursal ObraMax Supply y las zonas de despacho Centro, Judibana y Puerta Maraven.
          </desc>

          <rect x="0" y="0" width="640" height="430" fill="#e8eaed" />

          {EDIFICIOS.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="2" fill="#dadce0" opacity="0.55" />
          ))}

          {VERTICALES.map((x) => (
            <rect key={`v-${x}`} x={x} y="0" width="16" height="430" fill="#ffffff" stroke="#dadce0" />
          ))}

          {HORIZONTALES.map((y) => (
            <rect key={`h-${y}`} x="0" y={y} width="640" height="13" fill="#ffffff" stroke="#dadce0" />
          ))}

          <rect x="0" y="180" width="640" height="38" fill="#ffffff" stroke="#dadce0" />
          <path d="M0 199 H640" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="16 14" />

          <path className="ruta-mapa" d={RUTA_LLEGADA} pathLength="1" fill="none" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ruta-mapa" d={RUTA_LLEGADA} pathLength="1" fill="none" stroke="#1a73e8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="416" r="7" fill="#1a73e8" stroke="#ffffff" strokeWidth="3" />

          <g className="mapa-entra">
            <EtiquetaMapa x="338" y="96" texto="ObraMax · Sucursal" tam="16" anclaje="start" />
            <EtiquetaMapa x="138" y="378" texto="Centro · $3" />
            <EtiquetaMapa x="498" y="286" texto="Judibana · $6" />
            <EtiquetaMapa x="408" y="378" texto="Puerta Maraven · $5" />
          </g>

          <PinMapa x="318" y="130" principal rebotar={!reducido} />
          <PinMapa x="138" y="366" escala="0.62" />
          <PinMapa x="498" y="274" escala="0.62" />
          <PinMapa x="408" y="366" escala="0.62" />

          <g>
            <text x="570" y="390" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="1" fill="#5f645c" className="font-mono">
              250 m
            </text>
            <path d="M536 400 H604 M536 395 V405 M604 395 V405 M570 397 V403" fill="none" stroke="#5f645c" strokeWidth="2" />
          </g>
        </svg>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 px-2 pb-1 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 34" className="h-4 w-3 shrink-0" aria-hidden="true">
            <path d={PIN_D} fill="#ea4335" />
            <circle cx="12" cy="12" r="4.6" fill="#ffffff" />
          </svg>
          ObraMax · Sucursal
        </span>
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 34" className="h-3 w-2 shrink-0" aria-hidden="true">
            <path d={PIN_D} fill="#ea4335" />
            <circle cx="12" cy="12" r="4.6" fill="#ffffff" />
          </svg>
          Centro · $3
        </span>
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 34" className="h-3 w-2 shrink-0" aria-hidden="true">
            <path d={PIN_D} fill="#ea4335" />
            <circle cx="12" cy="12" r="4.6" fill="#ffffff" />
          </svg>
          Judibana · $6
        </span>
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 24 34" className="h-3 w-2 shrink-0" aria-hidden="true">
            <path d={PIN_D} fill="#ea4335" />
            <circle cx="12" cy="12" r="4.6" fill="#ffffff" />
          </svg>
          Puerta Maraven · $5
        </span>
      </figcaption>
    </figure>
  )
}

export function Esquinas() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-yellow-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M0 10 V0 H10" vectorEffect="non-scaling-stroke" />
      <path d="M90 0 H100 V10" vectorEffect="non-scaling-stroke" />
      <path d="M100 90 V100 H90" vectorEffect="non-scaling-stroke" />
      <path d="M10 100 H0 V90" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
