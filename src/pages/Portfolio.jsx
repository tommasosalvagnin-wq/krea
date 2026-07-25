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

function FolderCard({ project }) {
  const [open, setOpen] = useState(false)
  const c = project.color

  return (
    <div className="pf-card">
      <div
        className={`pf-folder${open ? ' is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
        aria-label={`${open ? 'Chiudi' : 'Apri'} progetto ${project.title}`}
      >
        <div className="pf-container">
          {/* Folder body */}
          <div className="pf-back" />

          {/* Files that fan out on open */}
          <div className="pf-file pf-f3" style={{ background: c + '18' }} />
          <div className="pf-file pf-f2" style={{ background: c + '30' }} />
          <div className="pf-file pf-f1">
            {project.img && <img src={project.img} alt={project.title} />}
            <div className="pf-shine" />
          </div>

          {/* Folder lid */}
          <div className="pf-lid">
            <div className="pf-lid-line" />
          </div>

          {/* Badge — visible when open */}
          <div className="pf-badge" style={{ background: c + 'dd' }}>
            <span className="pf-dot" />
            <span className="pf-badge-label">{project.tag}</span>
          </div>

          {/* Hint — visible when closed */}
          <div className="pf-hint">
            <span>tocca</span>
          </div>
        </div>
      </div>

      {/* Info below */}
      <div className="pf-info">
        <span className="pf-tag" style={{ color: c }}>{project.tag}</span>
        <h3 className="pf-title">{project.title}</h3>
        <p className="pf-desc">{project.desc}</p>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="pf-link"
          style={{ color: c }}
          onClick={e => e.stopPropagation()}
        >
          Vedi progetto →
        </a>
      </div>
    </div>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-header">
        <p className="portfolio-label">I nostri lavori</p>
        <h2 className="portfolio-title">Progetti realizzati</h2>
        <p className="portfolio-sub">Dalla strategia al lancio — ogni progetto costruito per convertire.</p>
      </div>

      <div className="pf-scroll-wrap">
        <div className="pf-track">
          {projects.map(p => <FolderCard key={p.id} project={p} />)}
        </div>
      </div>
    </section>
  )
}
