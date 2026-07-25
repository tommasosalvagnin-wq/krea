import { useState } from 'react'
import './Portfolio.css'

const projects = [
  {
    id: 'motoutlet',
    title: 'MotOutlet',
    tag: 'Automotive',
    desc: 'Sito per concessionaria moto multimarca. Catalogo, filtri e schede tecniche.',
    color: '#C0A882',
    img: `${import.meta.env.BASE_URL}images/motoutlet.jpg`,
    link: 'https://motoutlet-pordenone-demo.netlify.app/',
  },
  {
    id: 'monolocale',
    title: 'Monolocale Padova',
    tag: 'Immobiliare',
    desc: 'Sito per affitti brevi con booking integrato. 4.95 stelle, 83 recensioni.',
    color: '#8A9BB0',
    img: `${import.meta.env.BASE_URL}images/monolocale.jpg`,
    link: 'https://monolocale-padova-2026.netlify.app/',
  },
  {
    id: 'bisson',
    title: 'Bisson Auto',
    tag: 'Automotive',
    desc: 'Sito vetrina per concessionaria Mazda con video hero e form contatti.',
    color: '#9BB08A',
    img: `${import.meta.env.BASE_URL}images/bisson.jpg`,
    link: 'https://bisson-auto.netlify.app/',
  },
]

export default function Portfolio() {
  const [open, setOpen] = useState(false)

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-header">
        <p className="portfolio-label">I nostri lavori</p>
        <h2 className="portfolio-title">Progetti realizzati</h2>
        <p className="portfolio-sub">Dalla strategia al lancio — ogni progetto costruito per convertire.</p>
      </div>

      <div className="pf-center">
        <div
          className={`pf-folder${open ? ' is-open' : ''}`}
          onClick={() => setOpen(o => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
          aria-label={open ? 'Chiudi cartella progetti' : 'Apri cartella progetti'}
        >
          <div className="pf-container">

            {/* Folder body — contains project list when open */}
            <div className="pf-back">
              <div className="pf-inner-info">
                {projects.map((p) => (
                  <a
                    key={p.id}
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-row"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="pf-row-left">
                      <span className="pf-row-tag" style={{ color: p.color }}>{p.tag}</span>
                      <span className="pf-row-title">{p.title}</span>
                      <span className="pf-row-desc">{p.desc}</span>
                    </div>
                    <span className="pf-row-link" style={{ color: p.color }}>→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 3 project files that fan out */}
            <div className="pf-file pf-f3">
              <img src={projects[2].img} alt={projects[2].title} />
            </div>
            <div className="pf-file pf-f2">
              <img src={projects[1].img} alt={projects[1].title} />
            </div>
            <div className="pf-file pf-f1">
              <img src={projects[0].img} alt={projects[0].title} />
              <div className="pf-shine" />
            </div>

            {/* Folder lid — copertina con titolo */}
            <div className="pf-lid">
              <div className="pf-lid-cover">
                <span className="pf-lid-label">I nostri</span>
                <span className="pf-lid-name">Progetti</span>
              </div>
              <div className="pf-lid-line" />
            </div>

            {/* Hint */}
            <div className="pf-hint"><span>tocca</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
