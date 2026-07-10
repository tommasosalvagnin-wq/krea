const features = [
  {
    title: 'SITI 3D INTERATTIVI',
    desc: 'Laptop, prodotti, ambienti in 3D che seguono il mouse. I tuoi visitatori rimangono incollati allo schermo.',
  },
  {
    title: 'VIDEO HYPEREALISTICI',
    desc: "Video animati che sembrano veri. Perfetti per Instagram, TikTok, YouTube. Che catturano l'attenzione in 3 secondi.",
  },
  {
    title: 'MENU DIGITALI MULTILINGUE',
    desc: 'Menu per ristoranti in 5+ lingue. QR code, design bellissimo, facile da aggiornare.',
  },
  {
    title: 'INNOVAZIONE A COSTI BASSI',
    desc: 'Le migliori tecnologie senza spendere una fortuna. Siamo giovani, siamo veloci, siamo convenienti.',
  },
]

export default function RightPanel() {
  return (
    <div className="hero-right" style={{
      padding: '0 40px 0 32px',
      opacity: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      height: '100%',
    }}>
      <style>{`
        .feature-card-outer {
          padding: 1px;
          border-radius: 12px;
          background: rgba(192,200,212,0.12);
          transition: background 0.35s ease, box-shadow 0.35s ease;
          position: relative;
        }
        .feature-card-outer:hover {
          background: linear-gradient(
            135deg,
            rgba(110,80,200,0.7) 0%,
            rgba(60,100,200,0.55) 60%,
            rgba(192,200,212,0.25) 100%
          );
          box-shadow:
            0 0 28px rgba(100,80,220,0.28),
            0 0 8px rgba(192,200,212,0.1);
        }
        .feature-card-inner {
          width: 100%;
          height: 100%;
          background: rgba(10,10,20,0.82);
          border-radius: 11px;
          padding: 16px 20px;
          transition: background 0.35s ease, transform 0.2s ease;
          cursor: default;
          backdrop-filter: blur(4px);
        }
        .feature-card-outer:hover .feature-card-inner {
          background: rgba(14,12,30,0.88);
          transform: scale(0.985);
        }
        .feat-title {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-title);
          text-shadow: 0 2px 12px var(--text-glow);
          margin: 0 0 6px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.3s, text-shadow 0.3s;
        }
        .feature-card-outer:hover .feat-title {
          color: #ffffff;
          text-shadow: 0 0 18px rgba(160,130,255,0.6);
        }
        .feat-desc {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-body);
          text-shadow: 0 1px 6px rgba(192,200,212,0.15);
          margin: 0;
          line-height: 1.65;
          transition: color 0.3s;
        }
        .feature-card-outer:hover .feat-desc {
          color: #D4DAE8;
        }
      `}</style>

      <p style={{ color: '#C0C8D4', fontSize: 11, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12 }}>
        I nostri servizi
      </p>
      <h2 className="text-glow-title" style={{ fontSize: 30, fontWeight: 800, margin: 0, marginBottom: 28, lineHeight: 1.2, fontFamily: 'Syne, sans-serif' }}>
        Perché <span style={{ color: '#C0C8D4' }}>KREA</span>?
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map(({ title, desc }) => (
          <div key={title} className="feature-card-outer">
            <div className="feature-card-inner">
              <h3 className="feat-title">{title}</h3>
              <p className="feat-desc">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 16, padding: '12px 16px', borderRadius: 8,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,200,212,0.08)',
      }}>
        <p style={{ margin: 0, fontSize: 12, color: '#B8C2CC', lineHeight: 1.6 }}>
          <strong style={{ color: '#C0C8D4' }}>3</strong> developer creativi basati a <strong style={{ color: '#E8ECF0' }}>Padova</strong> — lavoriamo in tutta Italia
        </p>
      </div>
    </div>
  )
}
