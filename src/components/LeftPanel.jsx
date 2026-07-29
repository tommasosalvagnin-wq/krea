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
        border: '1px solid rgba(192,200,212,0.18)',
        background: 'rgba(192,200,212,0.04)',
        width: 'fit-content', marginBottom: mobile ? 16 : 24,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: '#34d399',
          boxShadow: '0 0 8px #34d399', display: 'inline-block',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
        <span style={{ color: '#C0C8D4', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
          Premium Digital Agency
        </span>
      </div>

      {/* Editorial stacked title */}
      <div style={{ marginBottom: mobile ? 20 : 28, lineHeight: 0.92 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 900,
          letterSpacing: '-2px',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(192,200,212,0.3)',
          fontSize: mobile ? 'clamp(52px, 18vw, 72px)' : 'clamp(52px, 10vw, 88px)',
          display: 'block',
          lineHeight: 0.95,
        }}>
          WEB
        </div>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 900,
          letterSpacing: '-2px',
          color: '#E8ECF0',
          fontSize: mobile ? 'clamp(52px, 18vw, 72px)' : 'clamp(52px, 10vw, 88px)',
          display: 'block',
          lineHeight: 0.95,
          textShadow: '0 2px 20px rgba(192,200,212,0.15)',
        }}>
          3D.
        </div>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 900,
          letterSpacing: '-2px',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(192,200,212,0.2)',
          fontSize: mobile ? 'clamp(52px, 18vw, 72px)' : 'clamp(52px, 10vw, 88px)',
          display: 'block',
          lineHeight: 0.95,
        }}>
          KREA
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-glow-body" style={{
        fontSize: 14, lineHeight: 1.75, fontWeight: 450,
        marginBottom: mobile ? 20 : 32, maxWidth: 340,
      }}>
        Trasformiamo i tuoi servizi in clienti reali. Soluzioni
        innovative, moderne e accessibili.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'nowrap', flexDirection: mobile ? 'column' : 'row' }}>
        <button
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            padding: '13px 18px', borderRadius: 3,
            background: '#C0C8D4', color: '#0a0a0f',
            fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            width: mobile ? '100%' : undefined,
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
            padding: '13px 18px', borderRadius: 3,
            background: 'transparent', color: '#C0C8D4',
            fontWeight: 600, fontSize: 11, cursor: 'pointer',
            border: '1px solid rgba(192,200,212,0.35)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            width: mobile ? '100%' : undefined,
            transition: 'all 0.2s', fontFamily: 'Space Grotesk, sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C8D4'; e.currentTarget.style.background = 'rgba(192,200,212,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(192,200,212,0.35)'; e.currentTarget.style.background = 'transparent' }}
        >
          Contattaci
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: mobile ? 'none' : 'flex', gap: 'clamp(20px, 6vw, 48px)', marginTop: 'clamp(28px, 5vw, 48px)',
        paddingTop: 20, borderTop: '1px solid rgba(192,200,212,0.08)',
      }}>
        {[['60+', 'Progetti'], ['99%', 'Soddisfazione'], ['3', 'Esperti']].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#C0C8D4', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>{v}</div>
            <div className="text-glow-body" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 4, whiteSpace: 'nowrap' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
