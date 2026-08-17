import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/* Linea di separazione che si incurva verso il cursore e torna dritta
   con un rimbalzo elastico.
   viewBox 0..1000 in orizzontale con preserveAspectRatio="none": la X si
   allunga con la riga, mentre l'altezza resta 40px reali, così lo
   scostamento verticale è in pixel veri e non si deforma. */
const H = 40          // altezza della fascia
const MID = H / 2     // quota della linea a riposo
const RAGGIO = 190    // entro quanti px il cursore fa effetto
const MAX = 13        // scostamento massimo

const traccia = (cx, dy) => `M 0 ${MID} Q ${cx} ${MID + dy * 2} 1000 ${MID}`

export default function WavyLine({ registro, indice, attiva = false, fondo = false }) {
  const wrapRef = useRef(null)
  const pathRef = useRef(null)
  const statoRef = useRef({ cx: 500, dy: 0 })

  useEffect(() => {
    const path = pathRef.current
    const wrap = wrapRef.current
    if (!path || !wrap || !registro) return

    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ritorno = null

    const aggiorna = (mx, my) => {
      if (ridotto) return
      const r = wrap.getBoundingClientRect()
      if (!r.width) return

      // Fuori dalla lista: torna dritta
      if (mx == null) return rilascia()

      const yLinea = r.top + MID
      const dist = Math.abs(my - yLinea)
      if (dist > RAGGIO) return rilascia()

      if (ritorno) { ritorno.kill(); ritorno = null }

      // Più il cursore è vicino, più la linea lo segue
      const vicinanza = 1 - dist / RAGGIO
      const dy = Math.max(-MAX, Math.min(MAX, (my - yLinea) * vicinanza))
      const cx = ((mx - r.left) / r.width) * 1000

      statoRef.current = { cx, dy }
      path.setAttribute('d', traccia(cx, dy))
    }

    const rilascia = () => {
      if (ritorno || Math.abs(statoRef.current.dy) < 0.4) return
      ritorno = gsap.to(statoRef.current, {
        dy: 0,
        duration: 1.1,
        ease: 'elastic.out(1, 0.32)',
        onUpdate: () => path.setAttribute('d', traccia(statoRef.current.cx, statoRef.current.dy)),
        onComplete: () => { ritorno = null },
      })
    }

    const elenco = registro.current
    elenco[indice] = aggiorna
    return () => {
      if (ritorno) ritorno.kill()
      elenco[indice] = null
    }
  }, [registro, indice])

  return (
    <svg
      ref={wrapRef}
      className={`wwd-line${fondo ? ' wwd-line--fondo' : ''}${attiva ? ' is-active' : ''}`}
      viewBox={`0 0 1000 ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path ref={pathRef} d={traccia(500, 0)} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
