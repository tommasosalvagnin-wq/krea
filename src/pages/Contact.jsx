import ContactForm from '../components/ContactForm'
import CursorGrid from '../components/CursorGrid'

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        zIndex: 20,
        background: '#0a0a0f',
        padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 40px)',
        borderTop: '1px solid rgba(192,200,212,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Griglia che si accende attorno al cursore, nel grigio-azzurro del sito
          invece del fucsia di serie. Niente pointerEvents:none qui: il
          componente deve ricevere il movimento del mouse */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden="true">
        <CursorGrid
          cellSize={64}
          color="#C0C8D4"
          radius={170}
          lineWidth={1}
          maxOpacity={0.5}
          gridOpacity={0.05}
        />
      </div>

      {/* Il modulo resta leggibile: la griglia si smorza verso il centro */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 52%, rgba(10,10,15,0.88) 0%, rgba(10,10,15,0.55) 42%, transparent 78%)',
      }} aria-hidden="true" />

      <div className="contact-inner" style={{ position: 'relative', zIndex: 2, maxWidth: 620, margin: '0 auto', opacity: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 52px)' }}>
          <p style={{ color: '#C0C8D4', fontSize: 11, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
            Inizia ora
          </p>
          <h2 className="text-glow-title" style={{ fontSize: 'clamp(40px, 5vw, 58px)', fontWeight: 600, margin: '0 0 16px', lineHeight: 1.15, fontFamily: "'Cormorant Garant', Georgia, serif", letterSpacing: '0.01em' }}>
            Iniziamo il tuo progetto
          </h2>
          <p className="text-glow-body" style={{ fontSize: 15, margin: 0, lineHeight: 1.7 }}>
            Raccontaci la tua idea. Ti risponderemo in 24 ore.
          </p>
        </div>

        {/* Senza cornice né fondo: restano solo i campi, e la griglia si vede
            passare dietro */}
        <div style={{ padding: '0 clamp(4px, 2vw, 16px)' }}>
          <ContactForm />
        </div>

      </div>
    </section>
  )
}
