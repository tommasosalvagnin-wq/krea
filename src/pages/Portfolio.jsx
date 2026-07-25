import { useState } from 'react'
import './Portfolio.css'

const projects = [
  {
    id: 'motoutlet',
    title: 'MotOutlet',
    tag: 'Automotive',
    color: '#C0A882',
    img: `${import.meta.env.BASE_URL}images/motoutlet.jpg`,
    link: 'https://motoutlet-pordenone-demo.netlify.app/',
  },
  {
    id: 'monolocale',
    title: 'Monolocale Padova',
    tag: 'Immobiliare',
    color: '#8A9BB0',
    img: `${import.meta.env.BASE_URL}images/monolocale.jpg`,
    link: 'https://monolocale-padova-2026.netlify.app/',
  },
  {
    id: 'bisson',
    title: 'Bisson Auto',
    tag: 'Automotive',
    color: '#9BB08A',
    img: `${import.meta.env.BASE_URL}images/bisson.jpg`,
    link: 'https://bisson-auto.netlify.app/',
  },
]

export default function Portfolio() {
  const [open, setOpen] = useState(false)

  const handleFileClick = (e, link) => {
    if (open) {
      e.stopPropagation()
      window.open(link, '_blank', 'noopener,noreferrer')
    }
    // se chiuso, il click si propaga al parent che apre la cartella
  }

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

            {/* Folder body */}
            <div className="pf-back">
              {open && (
                <div className="pf-close-hint">
                  <span>tocca qui per chiudere</span>
                </div>
              )}
            </div>

            {/* 3 file cliccabili — apre il link quando aperta */}
            {projects.map((p, i) => (
              <div
                key={p.id}
                className={`pf-file pf-f${3 - i}`}
                onClick={e => handleFileClick(e, p.link)}
                role={open ? 'link' : undefined}
                aria-label={open ? `Apri ${p.title}` : undefined}
              >
                <img src={p.img} alt={p.title} />
                {open && (
                  <div className="pf-file-label">
                    <span className="pf-file-tag" style={{ color: p.color }}>{p.tag}</span>
                    <span className="pf-file-name">{p.title}</span>
                    <span className="pf-file-arrow" style={{ color: p.color }}>apri →</span>
                  </div>
                )}
              </div>
            ))}

            {/* Folder lid — copertina con titolo */}
            <div className="pf-lid">
              <div className="pf-lid-cover">
                <span className="pf-lid-label">I nostri</span>
                <span className="pf-lid-name">Progetti</span>
              </div>
              <div className="pf-lid-line" />
            </div>

            {/* Hint chiuso */}
            <div className="pf-hint"><span>tocca</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
