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
