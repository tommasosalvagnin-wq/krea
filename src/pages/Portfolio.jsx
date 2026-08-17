import { useEffect, useRef, useState } from 'react'
import './Portfolio.css'

// L'ordine di questo elenco è l'ordine in cui si incontrano scorrendo:
// numero, angolo sul cilindro e sfalsamento si ricalcolano da soli
const projects = [
  {
    id: 'mediacasa',
    title: 'MediaCasa Immobiliare',
    tag: 'Immobiliare',
    year: '2025',
    desc: 'Redesign editoriale con tour virtuali AI e calcolatore mutuo.',
    color: '#CAE8E8',
    img: `${import.meta.env.BASE_URL}images/mediacasa.jpg`,
    link: 'https://mediacasa-sito.vercel.app/',
  },
  {
    id: 'tabula-rasa',
    title: 'Tabula Rasa',
    tag: 'Associazione',
    year: '2026',
    desc: 'Piattaforma tesseramento soci con form multi-step.',
    color: '#D8C08A',
    // Nessuna anteprima ancora: la card mostra la targa col colore del
    // progetto. Per usare uno screenshot basta metterlo in public/images
    // e aggiungere qui img: `${import.meta.env.BASE_URL}images/tabula-rasa.jpg`
    link: 'https://tabula-rasa-theta-ebon.vercel.app/',
  },
  {
    id: 'sordato',
    title: 'Sordato',
    tag: 'Industria',
    year: '2026',
    desc: 'Concept termocamera per impiantistica enologica, scroll orizzontale.',
    color: '#009FE3',
    img: `${import.meta.env.BASE_URL}images/sordato.jpg`,
    link: 'https://sordato-concept.vercel.app',
  },
  {
    id: 'motoutlet',
    title: 'MotOutlet',
    tag: 'Automotive',
    year: '2025',
    desc: 'Showroom 3D interattivo per concessionaria moto.',
    color: '#C0A882',
    img: `${import.meta.env.BASE_URL}images/motoutlet.jpg`,
    link: 'https://motoutlet-pordenone-demo.netlify.app/',
  },
  {
    id: 'monolocale',
    title: 'Monolocale Padova',
    tag: 'Immobiliare',
    year: '2025',
    desc: 'Sito affitto con rendering 3D e booking integrato.',
    color: '#8A9BB0',
    img: `${import.meta.env.BASE_URL}images/monolocale.jpg`,
    link: 'https://monolocale-padova-2026.netlify.app/',
  },
  {
    id: 'bisson',
    title: 'Bisson Auto',
    tag: 'Automotive',
    year: '2025',
    desc: 'Concessionaria multi-brand con configuratore veicoli.',
    color: '#9BB08A',
    img: `${import.meta.env.BASE_URL}images/bisson.jpg`,
    link: 'https://bisson-auto.netlify.app/',
  },
]

// Giro completo distribuito sul numero di progetti: aggiungerne uno
// non richiede di ritoccare angoli o rotazione a mano
const STEP = 360 / projects.length

function use3DTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const base = el.dataset.baseTransform || ''
    const onMove = (e) => {
      const r  = el.getBoundingClientRect()
      const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2)
      const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2)
      el.style.transform = `${base} rotateX(${-dy * 8}deg) rotateY(${dx * 10}deg) scale(1.04)`
      el.style.transition = 'transform 0.05s linear'
    }
    const onLeave = () => {
      el.style.transform = base
      el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])
}

function Card({ p, index }) {
  const cardRef = useRef(null)
  const [imgFailed, setImgFailed] = useState(false)
  use3DTilt(cardRef)

  const angle = index * STEP
  // Una sopra e una sotto, alternate: sfalsate danno profondità al cilindro,
  // allineate sembrano un listino
  const verso = index % 2 === 0 ? -1 : 1
  // Raggio e sfalsamento vivono in CSS (dipendono dalla larghezza della card,
  // che è responsive): così la disposizione resta coerente a ogni viewport
  const baseTransform =
    `rotateY(${angle}deg) translateZ(var(--pf-radius)) translateY(calc(var(--pf-stagger) * ${verso}))`
  const num = String(index + 1).padStart(2, '0')
  const initials = p.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const open = () => window.open(p.link, '_blank', 'noopener,noreferrer')

  return (
    <div className="pf-slot">
      <div
        ref={cardRef}
        className="pf-card"
        data-base-transform={baseTransform}
        style={{ transform: baseTransform, '--pf-accent': p.color }}
        onClick={open}
        role="link"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && open()}
        aria-label={`Apri ${p.title}`}
      >
        <div className="pf-card-face">
          {(!p.img || imgFailed) ? (
            // Nessuna anteprima: targa col colore del progetto. Vale sia per chi
            // non ha ancora un'immagine sia per un file mancante o rotto.
            <div className="pf-card-plate" aria-hidden="true"><span>{initials}</span></div>
          ) : (
            <img
              className="pf-card-img"
              src={p.img}
              alt={p.title}
              onError={() => setImgFailed(true)}
            />
          )}
          <div className="pf-card-overlay" />
          <div className="pf-card-top">
            <span className="pf-card-num">{num}</span>
            <span className="pf-card-tag" style={{ color: p.color }}>{p.tag}</span>
            <span className="pf-card-year">{p.year}</span>
          </div>
          <div className="pf-card-bottom">
            <h3 className="pf-card-title">{p.title}</h3>
            <p className="pf-card-desc">{p.desc}</p>
            <span className="pf-card-cta">Visita il sito <span className="pf-cta-arrow">→</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const sectionRef = useRef(null)
  const rotorRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const rotor   = rotorRef.current
    if (!section || !rotor) return

    let ticking = false

    const update = () => {
      ticking = false
      const rect      = section.getBoundingClientRect()
      const maxScroll = section.offsetHeight - window.innerHeight
      // Se la sezione non è più alta del viewport non c'è corsa da mappare:
      // senza questa guardia la divisione produce un progresso negativo o NaN
      if (maxScroll <= 0) { rotor.style.transform = 'rotateY(0deg)' ; return }
      const scrolled = Math.min(Math.max(0, -rect.top), maxScroll)
      const progress = scrolled / maxScroll
      rotor.style.transform = `rotateY(${-progress * 360}deg)`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="portfolio" className="pf-section" ref={sectionRef}>
      <div className="pf-sticky">

        {/* Header */}
        <div className="pf-header">
          <span className="pf-label">I nostri lavori</span>
          <h2 className="pf-title">
            <span className="pf-title-outline">PROGETTI</span>
            <span className="pf-title-solid">REALIZZATI</span>
          </h2>
        </div>

        {/* Dots */}
        <div className="pf-dots" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} className="pf-dot" style={{
              left: `${(i * 37.3 + 11) % 100}%`,
              top:  `${(i * 53.7 + 7)  % 100}%`,
              animationDelay:    `${(i * 0.37) % 3}s`,
              animationDuration: `${2.4 + (i % 5) * 0.4}s`,
            }} />
          ))}
        </div>

        {/* 3-D scene */}
        <div className="pf-scene-wrap">
          <div className="pf-krea-bg" aria-hidden="true">KREA</div>
          <div className="pf-scene">
            <div className="pf-cylinder-wrap">
              <div className="pf-cylinder" ref={rotorRef}>
                {projects.map((p, i) => <Card key={p.id} p={p} index={i} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pf-scroll-cue" aria-hidden="true">
          <div className="pf-scroll-bar" />
          <span className="pf-scroll-label">scorri</span>
        </div>

      </div>
    </section>
  )
}
