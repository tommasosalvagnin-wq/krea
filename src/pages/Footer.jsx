const lnk = {
  color: 'rgba(224,231,255,0.45)', textDecoration: 'none', fontSize: 13,
  transition: 'color 0.2s', display: 'block', marginBottom: 10,
}

export default function Footer() {
  return (
    <footer style={{
      position: 'relative', zIndex: 20,
      background: '#0a0a0f',
      borderTop: '1px solid rgba(192,200,212,0.06)',
      padding: '80px 40px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span className="text-glow-title" style={{ fontSize: 22, fontWeight: 900, color: '#C0C8D4', letterSpacing: '-1px', fontFamily: 'Syne, sans-serif' }}>KREA</span>
              <span style={{ fontSize: 11, color: '#6B7A8D', letterSpacing: '0.15em', textTransform: 'uppercase' }}>AGENCY</span>
            </div>
            <p className="text-glow-body" style={{ fontSize: 13, lineHeight: 1.8, margin: '0 0 24px' }}>
              Team di 3 developer/creative che amano innovare. Siti 3D, video animati e soluzioni digitali che funzionano.
              <br /><br />Basati a Padova, lavoriamo in tutta Italia.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              {['Instagram', 'TikTok', 'LinkedIn'].map(s => (
                <a key={s} href="#" style={{ ...lnk, fontSize: 12, color: 'rgba(192,200,212,0.5)', marginBottom: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C0C8D4'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(192,200,212,0.5)'}>{s}</a>
              ))}
            </div>
          </div>

          {/* Servizi */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#C0C8D4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, marginTop: 0 }}>Servizi</h4>
            {['Sito 3D', 'Video 3D', 'Menu Digitale', 'Portfolio', 'Blog'].map(l => (
              <a key={l} href="#" style={lnk}
                onMouseEnter={e => e.currentTarget.style.color = '#C0C8D4'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(224,231,255,0.45)'}>{l}</a>
            ))}
          </div>

          {/* Contatti */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#C0C8D4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, marginTop: 0 }}>Contatti</h4>
            {[
              { icon: '📧', text: 'info@krea.digital' },
              { icon: '📱', text: 'WhatsApp: +39 ...' },
              { icon: '🌐', text: 'www.krea.digital' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <span>{icon}</span>
                <span style={{ fontSize: 13, color: '#6B7A8D', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Pacchetti */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#C0C8D4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, marginTop: 0 }}>Pacchetti</h4>
            {['Sito Web — €799', 'Sito Web 3D — €1.499', 'Video AI / mese'].map(l => (
              <a key={l} href="#pricing" style={{ ...lnk }}
                onMouseEnter={e => e.currentTarget.style.color = '#C0C8D4'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(224,231,255,0.45)'}>{l}</a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: 32, borderTop: '1px solid rgba(192,200,212,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ margin: 0, fontSize: 12, color: '#445566' }}>© 2025 KREA Agency. Tutti i diritti riservati.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms & Conditions'].map(l => (
              <a key={l} href="#" style={{ ...lnk, fontSize: 12, marginBottom: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = '#C0C8D4'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(224,231,255,0.45)'}>{l}</a>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#445566' }}>Made with ❤️ in Padova</p>
        </div>
      </div>
    </footer>
  )
}
