import { useState, useRef, useEffect } from 'react'

/* ─── DATA ─────────────────────────────────────────────── */

const TABS = [
  { id: 'web',    label: 'Siti Web' },
  { id: 'video',  label: 'Video AI' },
  { id: 'bundle', label: 'Bundle' },
]

const WEB_CARDS = [
  {
    id: 'classico',
    name: 'STARTER',
    desc: 'Design moderno, senza 3D',
    price: 690,
    features: [
      'Sito 1-3 pagine',
      'Design moderno responsive',
      'Animazioni base',
      'Form contatti',
      '1 revisione inclusa',
      'Consegna in massimo 7 giorni',
      'Supporto 30 giorni',
    ],
    cta: 'Scegli Starter',
    featured: false,
  },
  {
    id: 'pro3d',
    name: 'PRO',
    desc: 'Il nostro servizio di punta',
    price: 1290,
    features: [
      'Sito 3D interattivo completo',
      'Animazioni GSAP avanzate',
      'Mouse tracking + scroll effects',
      'Fino a 5 sezioni',
      'Form contatti intelligente',
      '3 revisioni incluse',
      'Consegna in massimo 15 giorni',
      'Supporto 2 mesi',
    ],
    cta: 'Scegli Pro',
    featured: true,
    badge: 'CONSIGLIATO',
  },
  {
    id: 'elite3d',
    name: 'ELITE',
    desc: 'Massima personalizzazione',
    price: 2490,
    features: [
      'Sito 3D su misura, illimitato',
      'Modelli 3D custom (se necessario)',
      'Animazioni premium avanzate',
      'Sezioni illimitate',
      'Form + integrazione CRM',
      'Revisioni illimitate',
      'Consegna in massimo 21 giorni',
      'Supporto continuativo',
    ],
    cta: 'Scegli Elite',
    featured: false,
  },
]

const VIDEO_CARDS = [
  {
    id: 'reel',
    name: 'REEL SINGOLO',
    desc: 'Per iniziare a testare',
    price: 290,
    features: [
      '1 video 15-30 secondi',
      'Stile: UGC, storytelling o product',
      '1 formato (Reels/TikTok)',
      'Musica royalty-free',
      '1 revisione',
      'Consegna in 3 giorni',
    ],
    cta: 'Scegli Reel',
    featured: false,
  },
  {
    id: 'campaign',
    name: 'CAMPAIGN',
    desc: 'Per una presenza costante',
    price: 690,
    features: [
      '3 video (15/30/60 secondi)',
      'Mix di stili: UGC + storytelling + product',
      '3 formati (+ YouTube Shorts)',
      'Musica personalizzata',
      '2 revisioni per video',
      'Consegna in 5 giorni',
    ],
    cta: 'Scegli Campaign',
    featured: true,
    badge: 'PIÙ SCELTO',
  },
  {
    id: 'brand',
    name: 'BRAND CONTENT',
    desc: 'Contenuti per tutto il mese',
    price: 1290,
    features: [
      '6 video, formati misti',
      'Tutti gli stili disponibili',
      'Tutti i formati (+ LinkedIn)',
      'Musica custom + sound design',
      '3 revisioni per video',
      'Consegna in 10 giorni',
    ],
    cta: 'Scegli Brand Content',
    featured: false,
  },
]

const BUNDLE_CARDS = [
  {
    id: 'start',
    name: 'BUNDLE START',
    desc: 'Sito Classico + primi contenuti social',
    price: 790,
    originalPrice: 980,
    saving: 190,
    features: [
      'Sito Classico completo',
      '1 Video Reel',
    ],
    cta: 'Scegli Bundle Start',
    featured: false,
  },
  {
    id: 'complete',
    name: 'BUNDLE COMPLETE',
    desc: 'Sito 3D Pro + Campaign completa',
    price: 1990,
    originalPrice: 2380,
    saving: 390,
    features: [
      'Sito 3D Pro completo',
      '3 Video Campaign',
    ],
    cta: 'Scegli Bundle Complete',
    featured: true,
    badge: 'MIGLIOR VALORE',
  },
]

/* ─── COMPONENTS ────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M1 5L5 9L13 1" stroke="#C0C8D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PricingCard({ card, scrollToContact }) {
  const { name, desc, price, originalPrice, saving, features, cta, featured, badge } = card

  return (
    <div
      className={`pricing-card${featured ? ' is-pro' : ''}`}
      style={{
        position: 'relative',
        background: featured ? undefined : 'rgba(255,255,255,0.02)',
        border: featured ? undefined : '1px solid rgba(192,200,212,0.1)',
        borderRadius: 8,
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: '#C0C8D4', color: '#0a0a0f',
          fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
          padding: '6px 16px', borderRadius: 4, textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {badge}
        </div>
      )}

      <p className="text-glow-title" style={{ fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' }}>
        {name}
      </p>
      <p className="text-glow-body" style={{ fontSize: 14, fontWeight: 500, margin: '0 0 24px' }}>{desc}</p>

      {originalPrice && (
        <p style={{ fontSize: 18, color: '#445566', textDecoration: 'line-through', margin: '0 0 4px' }}>
          € {originalPrice.toLocaleString('it-IT')}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: saving ? 8 : 28 }}>
        <span style={{ fontSize: 44, fontWeight: 700, color: '#E8ECF0', lineHeight: 1, fontFamily: 'Syne, sans-serif' }}>
          € {price.toLocaleString('it-IT')}
        </span>
      </div>
      {saving && (
        <span style={{
          display: 'inline-block', marginBottom: 28,
          fontSize: 12, color: '#C0C8D4', background: 'rgba(192,200,212,0.08)',
          border: '1px solid rgba(192,200,212,0.2)', borderRadius: 4,
          padding: '4px 12px', fontWeight: 600,
        }}>
          Risparmi € {saving}
        </span>
      )}

      <div style={{ flex: 1 }}>
        {features.map(f => (
          <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <CheckIcon />
            <span className="text-glow-body" style={{ fontSize: 14, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      <button
        onClick={scrollToContact}
        style={{
          marginTop: 32, width: '100%',
          padding: '13px 24px', borderRadius: 4,
          background: featured ? '#C0C8D4' : 'transparent',
          color: featured ? '#0a0a0f' : '#C0C8D4',
          border: featured ? 'none' : '1px solid rgba(192,200,212,0.4)',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.5px',
          transition: 'all 0.2s', fontFamily: 'Space Grotesk, sans-serif',
        }}
        onMouseEnter={e => {
          if (featured) {
            e.currentTarget.style.background = '#D8DFE8'
            e.currentTarget.style.transform = 'translateY(-1px)'
          } else {
            e.currentTarget.style.borderColor = '#C0C8D4'
            e.currentTarget.style.background = 'rgba(192,200,212,0.06)'
          }
        }}
        onMouseLeave={e => {
          if (featured) {
            e.currentTarget.style.background = '#C0C8D4'
            e.currentTarget.style.transform = 'none'
          } else {
            e.currentTarget.style.borderColor = 'rgba(192,200,212,0.4)'
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        {cta}
      </button>
    </div>
  )
}

function TabContent({ activeTab, scrollToContact }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(12px)'
    const t = setTimeout(() => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 20)
    return () => clearTimeout(t)
  }, [activeTab])

  if (activeTab === 'web') {
    return (
      <div ref={containerRef}>
        <div className="pricing-cards-wrapper">
          {WEB_CARDS.map(c => <PricingCard key={c.id} card={c} scrollToContact={scrollToContact} />)}
        </div>
      </div>
    )
  }

  if (activeTab === 'video') {
    return (
      <div ref={containerRef}>
        <div className="pricing-cards-wrapper">
          {VIDEO_CARDS.map(c => <PricingCard key={c.id} card={c} scrollToContact={scrollToContact} />)}
        </div>
      </div>
    )
  }

  if (activeTab === 'bundle') {
    return (
      <div ref={containerRef}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 860, margin: '0 auto', alignItems: 'stretch' }}>
          {BUNDLE_CARDS.map(c => <PricingCard key={c.id} card={c} scrollToContact={scrollToContact} />)}
        </div>
        {/* Custom box */}
        <div style={{
          marginTop: 32, padding: '28px 36px', borderRadius: 8, textAlign: 'center',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,200,212,0.08)',
        }}>
          <p style={{ margin: '0 0 16px', fontSize: 15, color: '#8A9BB0', lineHeight: 1.7 }}>
            Hai esigenze diverse? Creiamo un pacchetto su misura per te.
          </p>
          <button
            onClick={scrollToContact}
            style={{
              padding: '12px 28px', borderRadius: 4,
              background: 'transparent', color: '#C0C8D4',
              border: '1px solid rgba(192,200,212,0.4)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              transition: 'all 0.2s', fontFamily: 'Space Grotesk, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C8D4'; e.currentTarget.style.background = 'rgba(192,200,212,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(192,200,212,0.4)'; e.currentTarget.style.background = 'transparent' }}
          >
            Richiedi Preventivo Custom →
          </button>
        </div>
      </div>
    )
  }

  return null
}

/* ─── MAIN ──────────────────────────────────────────────── */

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('web')

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="pricing" style={{
      position: 'relative', zIndex: 20,
      background: '#0a0a0f',
      padding: '0 40px 120px',
      borderTop: '1px solid rgba(192,200,212,0.06)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '72px 0 48px' }}>
        <p style={{ fontSize: 11, color: '#C0C8D4', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>
          I nostri servizi
        </p>
        <>
          <style>{`
            .hover-title {
              --border-right: 6px;
              --text-stroke-color: rgba(240,242,245,0.7);
              --animation-color: #C0C8D4;
              position: relative;
              display: inline-block;
              letter-spacing: 1px;
              text-transform: none;
              color: transparent;
              filter: drop-shadow(0 2px 12px rgba(192,200,212,0.35));
              -webkit-text-stroke: 1px var(--text-stroke-color);
              font-size: clamp(36px, 5vw, 56px);
              font-weight: 800;
              font-family: 'Syne', sans-serif;
              line-height: 1.1;
              cursor: default;
              margin: 0 0 16px;
            }
            .hover-title .hover-text {
              position: absolute;
              box-sizing: border-box;
              color: var(--animation-color);
              width: 0%;
              inset: 0;
              border-right: var(--border-right) solid var(--animation-color);
              overflow: hidden;
              transition: 0.5s;
              -webkit-text-stroke: 1px var(--animation-color);
              white-space: nowrap;
            }
            .hover-title:hover .hover-text {
              width: 100%;
              filter: drop-shadow(0 0 23px var(--animation-color));
            }
            @media (hover: none) {
              .hover-title {
                color: var(--animation-color);
                -webkit-text-stroke: 0;
              }
              .hover-title .hover-text { display: none; }
            }
          `}</style>
          <h2
            className="hover-title"
            data-text="Scegli il Servizio Giusto per Te"
          >
            Scegli il Servizio Giusto per Te
            <span className="hover-text" aria-hidden="true">
              Scegli il Servizio Giusto per Te
            </span>
          </h2>
        </>
      </div>

      {/* Tab Navigation */}
      <style>{`
        /* ── Tab buttons — ripple fill effect ── */
        .tab-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 32px;
          min-width: 140px;
          overflow: hidden;
          border-radius: 4px;
          border: 1px solid rgba(192,200,212,0.12);
          background: rgba(192,200,212,0.03);
          color: #6B7A8D;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.5px;
          font-family: 'Space Grotesk', sans-serif;
          cursor: pointer;
          transition: color 0.4s ease, border-color 0.4s ease;
          user-select: none;
        }
        .tab-btn.is-active {
          border-color: rgba(192,200,212,0.45);
          background: rgba(192,200,212,0.08);
          color: #E8ECF0;
        }
        /* SVG decorative blob, bottom-left */
        .tab-btn .tab-blob {
          position: absolute;
          bottom: 0;
          left: 0;
          width: auto;
          height: 100%;
          opacity: 0.06;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .tab-btn:hover .tab-blob,
        .tab-btn.is-active .tab-blob {
          opacity: 0.12;
        }
        /* Expanding circle */
        .tab-btn .tab-ripple {
          position: absolute;
          width: 0;
          height: 0;
          background: #C0C8D4;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.55s cubic-bezier(0.4,0,0.2,1),
                      height 0.55s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.55s ease;
          opacity: 0;
          pointer-events: none;
        }
        .tab-btn:hover .tab-ripple {
          width: 260px;
          height: 260px;
          opacity: 1;
        }
        /* Text sits above ripple */
        .tab-btn .tab-label {
          position: relative;
          z-index: 2;
          transition: color 0.4s ease;
        }
        .tab-btn:hover .tab-label {
          color: #0a0a0f;
        }
        /* Active tab: keep text light even without hover */
        .tab-btn.is-active .tab-label {
          color: #E8ECF0;
        }
        .tab-btn.is-active:hover .tab-label {
          color: #0a0a0f;
        }

        /* ── Pricing cards hover expansion ── */
        .pricing-cards-wrapper {
          display: flex;
          gap: 16px;
          align-items: stretch;
        }
        .pricing-card {
          flex: 1;
          transition:
            transform 0.5s cubic-bezier(0.4,0,0.2,1),
            opacity   0.5s ease,
            box-shadow 0.5s ease;
          transform: scale(1);
          opacity: 1;
          position: relative;
        }
        .pricing-cards-wrapper:hover .pricing-card:not(:hover) {
          transform: scale(0.96);
          opacity: 0.65;
        }
        .pricing-card:hover {
          transform: scale(1.04) !important;
          z-index: 10;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          opacity: 1 !important;
        }
        /* Pro card — sempre in evidenza */
        .pricing-card.is-pro {
          transform: scale(1.05);
          z-index: 5;
          border: 1.5px solid #C0C8D4 !important;
          background: linear-gradient(180deg, rgba(192,200,212,0.08) 0%, rgba(192,200,212,0.02) 100%) !important;
          box-shadow:
            0 0 0 1px rgba(192,200,212,0.15),
            0 25px 70px rgba(192,200,212,0.15),
            0 0 40px rgba(192,200,212,0.1);
        }
        .pricing-card.is-pro:hover {
          transform: scale(1.08) !important;
          box-shadow:
            0 0 0 1px rgba(192,200,212,0.3),
            0 30px 90px rgba(192,200,212,0.25),
            0 0 60px rgba(192,200,212,0.2) !important;
        }
        .pricing-cards-wrapper:hover .pricing-card.is-pro:not(:hover) {
          transform: scale(1.02) !important;
          opacity: 0.9 !important;
        }
        /* Mobile: disabilita effetto reciproco */
        @media (max-width: 768px) {
          .pricing-cards-wrapper {
            flex-direction: column;
            gap: 20px;
          }
          .pricing-cards-wrapper:hover .pricing-card:not(:hover) {
            transform: scale(1) !important;
            opacity: 1 !important;
          }
          .pricing-card:hover {
            transform: scale(1) !important;
          }
          .pricing-card.is-pro {
            transform: scale(1) !important;
          }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 56, flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <svg className="tab-blob" viewBox="0 0 487 487" xmlns="http://www.w3.org/2000/svg">
              <path fillOpacity=".08" fillRule="nonzero" fill="#FFF"
                d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6C322.3 242.7 329 296 314.7 338.8c-14.3 42.8-49.6 74.9-97.2 94.2C170 452.3 109.8 458.9 54.5 447.3 -5.6 433.8 -18 390.5-18 348.8c0-41.7 12-82 12-122.6C-6 185.6-33.8 145.7-33.8 105.8 -33.8 65.9-11.2 32.6 0 16.3Z"
              />
            </svg>
            <span className="tab-ripple" />
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <TabContent activeTab={activeTab} scrollToContact={scrollToContact} />
      </div>

      {/* Altri Servizi */}
      <div style={{
        maxWidth: 1060, margin: '64px auto 0',
        padding: '32px 40px', borderRadius: 8,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,200,212,0.1)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <div style={{ maxWidth: 620 }}>
          <p style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600, color: '#E8ECF0' }}>
            🏠 Virtual Tour 3D & Soluzioni Custom
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#6B7A8D', lineHeight: 1.7 }}>
            Offriamo anche tour virtuali 3D di spazi e ambienti, e soluzioni personalizzate per aziende
            con esigenze specifiche di catalogazione prodotti (showroom, concessionari, retail).
            Ogni progetto è diverso: parliamone insieme.
          </p>
        </div>
        <button
          onClick={scrollToContact}
          style={{
            flexShrink: 0, padding: '12px 28px', borderRadius: 4,
            background: 'transparent', color: '#C0C8D4',
            border: '1px solid rgba(192,200,212,0.4)',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            transition: 'all 0.2s', fontFamily: 'Space Grotesk, sans-serif',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C8D4'; e.currentTarget.style.background = 'rgba(192,200,212,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(192,200,212,0.4)'; e.currentTarget.style.background = 'transparent' }}
        >
          Richiedi Consulenza Gratuita →
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#445566' }}>
        Tutti i prezzi IVA esclusa · 50% anticipo, 50% alla consegna
      </p>
    </section>
  )
}
