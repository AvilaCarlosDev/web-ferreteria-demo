export function CintaPeligro({ animada = false, className = '' }) {
  return <div aria-hidden="true" className={`cinta-peligro ${animada ? 'cinta-animada' : ''} ${className}`} />
}

export function GuiaMedidas({ className = '' }) {
  return (
    <div aria-hidden="true" className={`flex items-end gap-3 text-[#141613]/45 ${className}`}>
      <div className="flex h-8 flex-1 items-end border-b border-current">
        {Array.from({ length: 41 }, (_, i) => (
          <span key={i} className={`flex-1 border-l border-current ${i % 5 === 0 ? 'h-5' : 'h-2'}`} />
        ))}
      </div>
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
