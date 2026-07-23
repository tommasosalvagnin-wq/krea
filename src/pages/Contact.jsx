import ContactForm from '../components/ContactForm'

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
      }}
    >
      <div className="contact-inner" style={{ maxWidth: 620, margin: '0 auto', opacity: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
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

        <div style={{
          padding: 'clamp(24px, 5vw, 44px) clamp(16px, 5vw, 40px)',
          borderRadius: 8,
          border: '1px solid rgba(192,200,212,0.08)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <ContactForm />
        </div>

      </div>
    </section>
  )
}
