import { useEffect, useRef, useState } from 'react'

const consultaMovimiento = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

export function useMovimientoReducido() {
  const [reducido, setReducido] = useState(consultaMovimiento)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cambiar = (evento) => setReducido(evento.matches)
    consulta.addEventListener('change', cambiar)
    return () => consulta.removeEventListener('change', cambiar)
  }, [])

  return reducido
}

const tareas = new Set()
let escuchando = false
let pendiente = false

const fotograma = () => {
  pendiente = false
  for (const tarea of Array.from(tareas)) tarea()
}

const programar = () => {
  if (pendiente) return
  pendiente = true
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fotograma)
  else setTimeout(fotograma, 16)
}

const encender = () => {
  if (escuchando) return
  escuchando = true
  window.addEventListener('scroll', programar, { passive: true })
  window.addEventListener('resize', programar, { passive: true })
}

const apagar = () => {
  if (!escuchando) return
  escuchando = false
  window.removeEventListener('scroll', programar)
  window.removeEventListener('resize', programar)
}

export function useScroll(actualizar, activo = true) {
  const referencia = useRef(actualizar)

  useEffect(() => {
    referencia.current = actualizar
  })

  useEffect(() => {
    if (!activo) return undefined
    const tarea = () => referencia.current()
    tareas.add(tarea)
    encender()
    programar()
    return () => {
      tareas.delete(tarea)
      if (tareas.size === 0) apagar()
    }
  }, [activo])
}

export function useEnViewport({ umbral = 0.12, margen = '0px 0px -40px 0px' } = {}) {
  const referencia = useRef(null)
  const reducido = useMovimientoReducido()
  const [sinObservador] = useState(() => typeof IntersectionObserver === 'undefined')
  const [entrado, setEntrado] = useState(false)
  const visto = entrado || reducido || sinObservador

  useEffect(() => {
    if (visto) return undefined
    const elemento = referencia.current
    if (!elemento) return undefined
    const observador = new IntersectionObserver(
      (entradas) => {
        const cruzada = entradas.some((entrada) => entrada.isIntersecting || entrada.boundingClientRect.top < 0)
        if (cruzada) {
          setEntrado(true)
          observador.disconnect()
        }
      },
      { threshold: umbral, rootMargin: margen },
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [visto, umbral, margen])

  useScroll(() => {
    const elemento = referencia.current
    if (!elemento) return
    if (elemento.getBoundingClientRect().bottom < 0) setEntrado(true)
  }, !visto)

  return [referencia, visto]
}

export const programarCuadro = (paso) =>
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame(paso) : setTimeout(() => paso(Date.now()), 16)

export const cancelarCuadro = (id) => {
  if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id)
  else clearTimeout(id)
}

export function useParallax(referencia, factor = 0.06) {
  const reducido = useMovimientoReducido()

  useScroll(() => {
    const elemento = referencia.current
    if (!elemento || !elemento.parentElement) return
    const rect = elemento.parentElement.getBoundingClientRect()
    if (rect.bottom < -240 || rect.top > window.innerHeight + 240) return
    const centro = rect.top + rect.height / 2 - window.innerHeight / 2
    elemento.style.setProperty('--desplazamiento-parallax', `${(-centro * factor).toFixed(1)}px`)
  }, !reducido)
}
