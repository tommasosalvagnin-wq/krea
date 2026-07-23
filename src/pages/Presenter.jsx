import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PhoneVideoShowcase from '../components/PhoneVideoShowcase'
import { useWindowSize } from '../hooks/useWindowSize'

gsap.registerPlugin(ScrollTrigger)

const checkItems = [
  'Chi siamo e cosa ci distingue',
  'I servizi che offriamo nel dettaglio',
  'Come iniziare subito senza rischi',
]

function CheckItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(192,200,212,0.15)', border: '1.5px solid #C0C8D4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="11" height="8" viewBox="0 0 12 9" fill="none">
          <path d="M1 4L4.5 7.5L11 1" stroke="#C0C8D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-glow-body" style={{ fontSize: 15, lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

export default function Presenter() {
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const { isMobile } = useWindowSize()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } })
      tl.from(leftRef.current,  { x: -50, opacity: 0, duration: 0.8, ease: 'power2.out' })
        .from(rightRef.current, { x:  50, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="presenter" style={{
      background: '#0a0a0f',
      padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)',
      borderTop: '1px solid rgba(192,200,212,0.06)',
      position: 'relative', zIndex: 20,
    }}>
      <div style={{
        position: 'absolute', right: '15%', top: '20%', width: 400, height: 400, pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(192,200,212,0.04) 0%, transparent 70%)', filter: 'blur(60px)',
      }} />

      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 345px',
        gap: isMobile ? 48 : 80,
        alignItems: 'center',
      }}>
        {/* Su mobile il telefono viene prima del testo */}
        {isMobile && (
          <div ref={rightRef} style={{ display: 'flex', justifyContent: 'center' }}>
            <PhoneVideoShowcase />
          </div>
        )}

        <div ref={isMobile ? null : leftRef}>
          <p style={{ fontSize: 12, color: '#C0C8D4', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 20, marginTop: 0 }}>
            CHI SIAMO
          </p>
          <h2 className="text-glow-title" style={{ fontSize: 'clamp(28px,6vw,52px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px' }}>
            Lascia che ti<br />spieghiamo tutto.
          </h2>
          <p className="text-glow-body" style={{ fontSize: isMobile ? 15 : 17, lineHeight: 1.7, margin: '0 0 32px', maxWidth: 460 }}>
            In meno di 1 minuto capirai perche KREA e diversa da tutte le altre agenzie digitali.
          </p>
          <div style={{ marginBottom: 36 }}>
            {checkItems.map(t => <CheckItem key={t} text={t} />)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: '#C0C8D4', color: '#000', border: 'none',
                padding: '12px 28px', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Space Grotesk, sans-serif',
                width: isMobile ? '100%' : 'auto',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Prenota Chiamata Gratuita →
            </button>
            <span style={{ fontSize: 13, color: '#445566' }}>Risposta in 2 ore</span>
          </div>
        </div>

        {/* Su desktop il telefono è a destra */}
        {!isMobile && (
          <div ref={rightRef}><PhoneVideoShowcase /></div>
        )}
      </div>
    </section>
  )
}
