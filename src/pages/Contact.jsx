import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        zIndex: 20,
        background: '#0a0a0f',
        padding: '120px 40px',
        borderTop: '1px solid rgba(192,200,212,0.06)',
      }}
    >
      <div className="contact-inner" style={{ maxWidth: 620, margin: '0 auto', opacity: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ color: '#C0C8D4', fontSize: 11, fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
            Inizia ora
          </p>
          <h2 className="text-glow-title" style={{ fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1, fontFamily: 'Syne, sans-serif' }}>
            Iniziamo il tuo progetto
          </h2>
          <p className="text-glow-body" style={{ fontSize: 15, margin: 0, lineHeight: 1.7 }}>
            Raccontaci la tua idea. Ti risponderemo in 24 ore.
          </p>
        </div>

        <div style={{
          padding: '44px 40px',
          borderRadius: 8,
          border: '1px solid rgba(192,200,212,0.08)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <ContactForm />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 24, textAlign: 'center' }}>
          {[
            { icon: '📧', label: 'Email', val: 'info@krea.digital' },
            { icon: '📱', label: 'WhatsApp', val: '+39 ...' },
            { icon: '🌐', label: 'Web', val: 'krea.digital' },
          ].map(({ icon, label, val }) => (
            <div key={label} style={{
              padding: '16px 12px', borderRadius: 8,
              border: '1px solid rgba(192,200,212,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 11, color: '#6B7A8D', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#C0C8D4', fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
