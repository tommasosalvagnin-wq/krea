import './Testimonials.css'

const quotes = [
  {
    text: 'Il sito 3D che hanno creato per noi ha completamente trasformato come i clienti ci percepiscono. Ordini aumentati del 40% nel primo mese.',
    author: 'Marco V.',
    role: 'Titolare',
    company: 'MotOutlet Pordenone',
  },
  {
    text: 'Professionalità fuori dal comune. In meno di 10 giorni avevamo un sito che sembra costato il triplo. I video AI sono impressionanti.',
    author: 'Sara B.',
    role: 'Proprietaria',
    company: 'Monolocale Padova',
  },
  {
    text: 'Pensavamo che certi risultati fossero solo per i grandi brand. KREA ci ha dimostrato il contrario — e in tempi record.',
    author: 'Luca B.',
    role: 'Responsabile Marketing',
    company: 'Bisson Auto',
  },
]

export default function Testimonials() {
  return (
    <section className="tst-section">
      <div className="tst-header">
        <p className="tst-label">Cosa dicono i clienti</p>
        <h2 className="tst-title">
          <span className="tst-outline">WHAT</span>
          <span className="tst-solid">THEY SAID</span>
        </h2>
      </div>

      <div className="tst-list">
        {quotes.map((q, i) => (
          <div key={i} className="tst-row">
            <span className="tst-index">0{i + 1}</span>
            <div className="tst-body">
              <p className="tst-quote">&ldquo;{q.text}&rdquo;</p>
              <div className="tst-attribution">
                <span className="tst-author">{q.author}</span>
                <span className="tst-sep">—</span>
                <span className="tst-role">{q.role}, {q.company}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
