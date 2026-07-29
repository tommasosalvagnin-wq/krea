import { useState } from 'react'
import './WhatWeDo.css'

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

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="services" className="wwd-section">
      <div className="wwd-header">
        <p className="wwd-label">Cosa facciamo</p>
        <h2 className="wwd-title">
          <span className="wwd-title-outline">I NOSTRI</span>
          <span className="wwd-title-solid">SERVIZI</span>
        </h2>
      </div>

      <div className="wwd-list">
        {services.map((s, i) => (
          <div
            key={s.num}
            className={`wwd-row${active === i ? ' is-active' : ''}`}
            onClick={() => setActive(active === i ? null : i)}
          >
            <div className="wwd-row-top">
              <span className="wwd-num">{s.num}</span>
              <span className="wwd-name">{s.name}</span>
              <span className="wwd-tag">{s.tag}</span>
              <span className="wwd-price">{s.price}</span>
              <span className="wwd-chevron" aria-hidden="true">
                {active === i ? '−' : '+'}
              </span>
            </div>
            <div className="wwd-row-body">
              <p className="wwd-desc">{s.desc}</p>
              <div className="wwd-keywords">
                {s.keywords.map(k => (
                  <span key={k} className="wwd-kw">{k}</span>
                ))}
              </div>
              <button className="wwd-cta" onClick={e => { e.stopPropagation(); scrollToContact() }}>
                Inizia ora →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
