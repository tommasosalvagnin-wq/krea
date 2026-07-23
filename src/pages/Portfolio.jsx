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
  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-header">
        <p className="portfolio-label">I nostri lavori</p>
        <h2 className="portfolio-title">Progetti realizzati</h2>
        <p className="portfolio-sub">Dalla strategia al lancio — ogni progetto costruito per convertire.</p>
      </div>

      <div className="portfolio-dock-wrap">
        <div className="portfolio-dock">
          {projects.map((p, i) => (
            <a
              className="dock-card"
              key={p.id}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--accent': p.color, textDecoration: 'none' }}
            >
              <div className="dock-card-img">
                {p.img
                  ? <img src={p.img} alt={p.title} />
                  : <div className="dock-card-placeholder" style={{ background: `radial-gradient(ellipse at 30% 40%, ${p.color}22 0%, transparent 70%)` }}>
                      <span className="dock-card-num">0{i + 1}</span>
                    </div>
                }
              </div>
              <div className="dock-card-body">
                <span className="dock-card-tag">{p.tag}</span>
                <h3 className="dock-card-title">{p.title}</h3>
                <p className="dock-card-desc">{p.desc}</p>
                <span className="dock-card-btn">Vedi progetto →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
