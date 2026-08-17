import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WavyLine from '../components/WavyLine'
import './WhatWeDo.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    num: '01',
    name: 'SITO WEB 3D',
    tag: 'Design & Dev',
    desc: 'Siti interattivi con animazioni 3D, scroll effects avanzati e mouse tracking. Il tuo brand vive davvero online.',
    price: 'da €690',
    keywords: ['WebGL', 'GSAP', 'Three.js'],
  },
  {
    num: '02',
    name: 'VIDEO AI',
    tag: 'Motion & Content',
    desc: 'Video hyperrealistici, Reels e contenuti social generati con intelligenza artificiale. Produzione di alto livello, costi ridotti.',
    price: 'da €290',
    keywords: ['Reels', 'TikTok', 'YouTube'],
  },
  {
    num: '03',
    name: 'MENU DIGITALE',
    tag: 'Restaurant Tech',
    desc: 'Menu QR interattivi con aggiornamenti in tempo reale, galleria piatti e design personalizzato sul tuo brand.',
    price: 'su richiesta',
    keywords: ['QR Code', 'Real-time', 'Mobile'],
  },
  {
    num: '04',
    name: 'BUNDLE',
    tag: 'Best Value',
    desc: 'Sito web + video in un unico pacchetto scontato. La combinazione perfetta per un lancio completo.',
    price: 'da €790',
    keywords: ['Tutto incluso', 'Risparmio', 'Lancio'],
  },
]

export default function WhatWeDo() {
  const [active, setActive] = useState(null)
  const listRef = useRef(null)
  // Ogni linea si registra qui: un solo ascoltatore le muove tutte, e le
  // vicine si incurvano un po' anche loro
  const linee = useRef([])

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const onMove = (e) => linee.current.forEach(fn => fn && fn(e.clientX, e.clientY))
    const onLeave = () => linee.current.forEach(fn => fn && fn(null, null))
    list.addEventListener('pointermove', onMove, { passive: true })
    list.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      list.removeEventListener('pointermove', onMove)
      list.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Le righe entrano una dopo l'altra quando la lista arriva in vista
  useEffect(() => {
    if (!listRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.wwd-row', {
        opacity: 0,
        y: 34,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: listRef.current, start: 'top 82%' },
      })
    }, listRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" className="wwd-section">
      <div className="wwd-header">
        <p className="wwd-label">Cosa facciamo</p>
        <h2 className="wwd-title">
          <span className="wwd-title-outline">I NOSTRI</span>
          <span className="wwd-title-solid">SERVIZI</span>
        </h2>
      </div>

      <div className="wwd-list" ref={listRef}>
        {services.map((s, i) => (
          <div
            key={s.num}
            className={`wwd-row${active === i ? ' is-active' : ''}`}
            onClick={() => setActive(active === i ? null : i)}
            role="button"
            tabIndex={0}
            aria-expanded={active === i}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(active === i ? null : i) }
            }}
          >
            <WavyLine registro={linee} indice={i} attiva={active === i} />
            {i === services.length - 1 && (
              <WavyLine registro={linee} indice={services.length} fondo />
            )}
            <div className="wwd-row-top">
              <span className="wwd-num">{s.num}</span>
              <span className="wwd-name">{s.name}</span>
              <span className="wwd-tag">{s.tag}</span>
              <span className="wwd-price">{s.price}</span>
              {/* Il segno è disegnato in CSS: ruotando, il "+" diventa "×" */}
              <span className="wwd-chevron" aria-hidden="true" />
            </div>
            <div className="wwd-row-body">
              <div className="wwd-body-inner">
                <p className="wwd-desc">{s.desc}</p>
                <div className="wwd-keywords">
                  {s.keywords.map(k => (
                    <span key={k} className="wwd-kw">{k}</span>
                  ))}
                </div>
                <button className="wwd-cta" onClick={e => { e.stopPropagation(); scrollToContact() }}>
                  Inizia ora <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
