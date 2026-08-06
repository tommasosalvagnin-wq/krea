import { useEffect, useRef } from 'react'
import './Portfolio.css'

const projects = [
  {
    id: 'motoutlet',
    title: 'MotOutlet',
    tag: 'Automotive',
    year: '2025',
    desc: 'Showroom 3D interattivo per concessionaria moto.',
    color: '#C0A882',
    img: `${import.meta.env.BASE_URL}images/motoutlet.jpg`,
    link: 'https://motoutlet-pordenone-demo.netlify.app/',
    num: '01',
    angle: 0,
    yOffset: -340,
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
    num: '02',
    angle: 90,
    yOffset: -110,
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
    num: '03',
    angle: 180,
    yOffset: 110,
  },
  {
    id: 'mediacasa',
    title: 'MediaCasa Immobiliare',
    tag: 'Immobiliare',
    year: '2025',
    desc: 'Redesign editoriale con tour virtuali AI e calcolatore mutuo.',
    color: '#CAE8E8',
    img: `${import.meta.env.BASE_URL}images/mediacasa.jpg`,
    link: 'https://mediacasaimmobiliare.com',
    num: '04',
    angle: 270,
    yOffset: 340,
  },
]

const RADIUS = 300

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

function Card({ p }) {
  const cardRef = useRef(null)
  use3DTilt(cardRef)
  const baseTransform = `rotateY(${p.angle}deg) translateZ(${RADIUS}px) translateY(${p.yOffset}px)`

  return (
    <div className="pf-slot" style={{ '--angle': `${p.angle}deg`, '--y': `${p.yOffset}px` }}>
      <div
        ref={cardRef}
        className="pf-card"
        data-base-transform={baseTransform}
        data-angle={p.angle}
        style={{ transform: baseTransform }}
        onClick={() => window.open(p.link, '_blank', 'noopener,noreferrer')}
        role="link"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && window.open(p.link, '_blank', 'noopener,noreferrer')}
        aria-label={`Apri ${p.title}`}
      >
        <div className="pf-card-face">
          <img className="pf-card-img" src={p.img} alt={p.title} />
          <div className="pf-card-overlay" />
          <div className="pf-card-top">
            <span className="pf-card-num">{p.num}</span>
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
  const sectionRef  = useRef(null)
  const cylinderRef = useRef(null)
  const rotorRef    = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const wrap    = cylinderRef.current
    const rotor   = rotorRef.current
    if (!section || !wrap || !rotor) return

    const Y_START =  340
    const Y_END   = -340

    const onScroll = () => {
      const rect      = section.getBoundingClientRect()
      const maxScroll = section.offsetHeight - window.innerHeight
      const scrolled  = Math.max(0, -rect.top)
      const progress  = Math.min(1, scrolled / maxScroll)

      wrap.style.transform  = `translateY(${Y_START + progress * (Y_END - Y_START)}px)`
      rotor.style.transform = `rotateY(${-progress * 720}deg)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
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
            <div className="pf-cylinder-wrap" ref={cylinderRef}>
              <div className="pf-cylinder" ref={rotorRef}>
                {projects.map(p => <Card key={p.id} p={p} />)}
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
