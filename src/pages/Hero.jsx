import { useRef, useEffect } from 'react'
import LeftPanel  from '../components/LeftPanel'
import RightPanel from '../components/RightPanel'
import { useWindowSize } from '../hooks/useWindowSize'

const INITIAL_VH = window.innerHeight
// Scroll range over which the video plays — 3× the viewport height gives a slow, deliberate scrub
const SCROLL_RANGE = INITIAL_VH * 3

function VideoLaptop() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const scrub = () => {
      if (!video.duration) return
      const progress = Math.min(window.scrollY / SCROLL_RANGE, 1)
      video.currentTime = progress * video.duration
    }

    const onReady = () => { video.pause(); scrub() }

    video.addEventListener('loadedmetadata', onReady)
    window.addEventListener('scroll', scrub, { passive: true })
    if (video.readyState >= 1) onReady()

    return () => {
      video.removeEventListener('loadedmetadata', onReady)
      window.removeEventListener('scroll', scrub)
    }
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      background: '#08111f',
      overflow: 'hidden',
    }}>
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}videos/full_video.mp4`}
        muted
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
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
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!wrapperRef.current) return
    // SCROLL_RANGE + 1vh = total wrapper so user scrolls the full video before exiting
    wrapperRef.current.style.height = `${SCROLL_RANGE + INITIAL_VH}px`
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: `${SCROLL_RANGE + INITIAL_VH}px` }}>
    <section id="hero" style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: `${INITIAL_VH}px`,
      background: '#08111f',
      overflow: 'hidden', zIndex: 5,
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
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
            background: 'linear-gradient(to top, rgba(8,17,31,0.99) 0%, rgba(8,17,31,0.75) 45%, transparent 100%)',
            zIndex: 1, pointerEvents: 'none',
          }} />
          {/* Testo posizionato subito sotto il laptop (top ~30%) */}
          <div style={{ position: 'absolute', top: '32%', left: 0, right: 0, zIndex: 2, padding: '0 24px' }}>
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
    </div>
  )
}
