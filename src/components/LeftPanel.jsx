export default function LeftPanel({ mobile = false }) {
  return (
    <div className="hero-left" style={{
      padding: mobile ? '0 20px' : 'clamp(20px, 5vw, 64px) clamp(16px, 4vw, 48px)',
      opacity: mobile ? 1 : 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      height: mobile ? 'auto' : '100%',
    }}>
      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 999,
        border: '1px solid rgba(192,200,212,0.2)',
        background: 'rgba(192,200,212,0.04)',
        width: 'fit-content', marginBottom: mobile ? 14 : 28,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: '#C0C8D4',
          boxShadow: '0 0 6px #C0C8D4', display: 'inline-block',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
        <span style={{ color: '#C0C8D4', fontSize: 11, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Premium Digital Agency
        </span>
      </div>

      {/* Title */}
      <h1 className="text-glow-title" style={{
        fontSize: 'clamp(48px, 14vw, 72px)', fontWeight: 900, lineHeight: 1,
        margin: 0, marginBottom: 20,
        letterSpacing: '-2px', fontFamily: 'Syne, sans-serif',
      }}>
        KREA
      </h1>

      {/* Subtitle label */}
      <p className="text-glow-body" style={{
        fontSize: 13, fontWeight: 600, color: '#C0C8D4',
        marginBottom: 24, letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>
        Web 3D · Video Hyperealistici · Menu Digitali
      </p>

      {/* Description */}
      <p className="text-glow-body" style={{
        fontSize: 15, lineHeight: 1.7, fontWeight: 450,
        marginBottom: mobile ? 20 : 36, maxWidth: 340,
      }}>
        Trasformiamo i tuoi servizi in clienti reali. Soluzioni
        innovative, moderne e accessibili — senza spendere una fortuna.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            padding: '12px 26px', borderRadius: 4,
            background: '#C0C8D4', color: '#0a0a0f',
            fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            transition: 'all 0.2s', fontFamily: 'Space Grotesk, sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#D8DFE8'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#C0C8D4'; e.currentTarget.style.transform = 'none' }}
        >
          Scopri i pacchetti
        </button>
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            padding: '12px 26px', borderRadius: 4,
            background: 'transparent', color: '#C0C8D4',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            border: '1px solid rgba(192,200,212,0.4)',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            transition: 'all 0.2s', fontFamily: 'Space Grotesk, sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C8D4'; e.currentTarget.style.background = 'rgba(192,200,212,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(192,200,212,0.4)'; e.currentTarget.style.background = 'transparent' }}
        >
          Contattaci
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: mobile ? 'none' : 'flex', gap: 'clamp(20px, 6vw, 48px)', marginTop: 'clamp(28px, 5vw, 56px)',
        paddingTop: 24, borderTop: '1px solid rgba(192,200,212,0.1)',
      }}>
        {[['60+', 'Progetti'], ['99%', 'Soddisfazione'], ['3', 'Esperti']].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#C0C8D4', fontFamily: 'Syne, sans-serif' }}>{v}</div>
            <div className="text-glow-body" style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4, whiteSpace: 'nowrap' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
