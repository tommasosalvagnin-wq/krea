import { useRef, useEffect } from 'react'
import LeftPanel  from '../components/LeftPanel'
import RightPanel from '../components/RightPanel'
import { useWindowSize } from '../hooks/useWindowSize'

/* Video a tutto schermo — il laptop rimane centrato identico,
   ma lo sfondo nero del video si espande a coprire l'intera hero */
function VideoLaptop() {
  const videoRef  = useRef(null)
  const targetRef = useRef(0)
  const rafRef    = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const init = () => video.pause()
    if (video.readyState >= 1) init()
    else video.addEventListener('loadedmetadata', init, { once: true })

    const onScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      targetRef.current = progress * (video.duration || 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const LERP_FAST = 0.22
    const LERP_SLOW = 0.10
    const JUMP_THRESHOLD = video.duration * 0.15

    const tick = () => {
      if (video.duration && video.readyState >= 2) {
        const current = video.currentTime
        const target  = targetRef.current
        const diff    = target - current
        if (Math.abs(diff) > JUMP_THRESHOLD) {
          video.currentTime = target
        } else if (Math.abs(diff) > 0.016) {
          const factor = Math.abs(diff) > 0.5 ? LERP_FAST : LERP_SLOW
          video.currentTime = current + diff * factor
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    /* Contenitore a tutto schermo — z-index 0, sotto il contenuto */
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      background: '#000',
      overflow: 'hidden',
    }}>
      <video
        ref={videoRef}
        src="/videos/laptop-seekable.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center center',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  )
}

/* Scroll hint DOM-driven */
function ScrollHint() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fn = () => {
      el.style.opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.15))
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div ref={ref} style={{
      position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      pointerEvents: 'none', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 6, zIndex: 10,
    }}>
      <span style={{ fontSize: 9, color: 'rgba(224,231,255,0.28)', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
        Scrolla
      </span>
      <div style={{ animation: 'bounceDown 2s ease-in-out infinite' }}>
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
          <rect x="5" y="0" width="4" height="12" rx="2" fill="rgba(192,200,212,0.2)" />
          <circle cx="7" cy="3.5" r="1.8" fill="#C0C8D4" />
          <path d="M3 15 L7 20 L11 15" stroke="rgba(192,200,212,0.35)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

/* Progress bar DOM-driven */
function ProgressBar() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fn = () => { el.style.width = `${Math.min(window.scrollY / window.innerHeight, 1) * 100}%` }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div ref={ref} style={{
      position: 'absolute', bottom: 0, left: 0, height: 1.5,
      background: 'linear-gradient(90deg, transparent, #C0C8D4, transparent)',
      width: '0%', opacity: 0.6, zIndex: 10,
    }} />
  )
}

export default function Hero() {
  const { isMobile, isTablet } = useWindowSize()

  return (
    <section id="hero" style={{
      position: 'sticky', top: 0,
      height: '100vh', width: '100%',
      background: '#000',
      overflow: 'hidden', zIndex: 10,
    }}>
      {/* Video a tutto schermo — z-index 0 */}
      <VideoLaptop />

      {/* Sottile vignette ai bordi per isolare il contenuto testuale */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Contenuto sopra il video — z-index 2 */}
      {isMobile ? (
        <>
          {/* Gradiente scuro in basso per leggibilità testo */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
            zIndex: 1, pointerEvents: 'none',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, padding: '0 0 48px' }}>
            <LeftPanel mobile />
          </div>
        </>
      ) : isTablet ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'flex-end', padding: '0 0 48px' }}>
          <LeftPanel /><RightPanel />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'grid', gridTemplateColumns: '30% 40% 30%', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 0' }}>
            <LeftPanel />
          </div>
          {/* Colonna centrale vuota — il video si vede attraverso */}
          <div />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RightPanel />
          </div>
        </div>
      )}

      <ScrollHint />
      <ProgressBar />
    </section>
  )
}
