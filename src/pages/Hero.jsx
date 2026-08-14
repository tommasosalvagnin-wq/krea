import { useRef, useEffect, useState } from 'react'
import LeftPanel  from '../components/LeftPanel'
import RightPanel from '../components/RightPanel'
import { useWindowSize } from '../hooks/useWindowSize'
import { BREAKPOINTS } from '../utils/constants'

// Lo scroll della hero dura 3 viewport: scrub lento e deliberato
const SCROLL_MULTIPLIER = 3
// Damping del seguito scroll → video. Più alto = più reattivo, più basso = più morbido
const SMOOTHING = 9
// Il video sorgente è a 24 fps: non ha senso cercare posizioni più fini di un frame
const FRAME_DURATION = 1 / 24
// Sotto questa differenza consideriamo lo scrub fermo e mettiamo in pausa il loop
const SETTLE_EPSILON = 0.0004

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// La sorgente si sceglie una volta sola al mount: cambiare src a caldo
// farebbe ripartire il download e sbiancherebbe la hero durante un resize
const pickSource = () =>
  window.innerWidth < BREAKPOINTS.mobile ? 'hero-scrub-mobile.mp4' : 'hero-scrub.mp4'

export default function Hero() {
  const { isMobile, isTablet } = useWindowSize()
  const [source] = useState(pickSource)
  const [ready, setReady]     = useState(false)

  const wrapperRef = useRef(null)
  const videoRef   = useRef(null)
  const hintRef    = useRef(null)
  const barRef     = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video   = videoRef.current
    if (!wrapper || !video) return

    const reduced = reducedMotion()

    let vh          = window.innerHeight
    let lockedWidth = window.innerWidth
    let range       = 0
    let scrollY     = 0

    let target  = 0    // progresso grezzo dallo scroll (0..1)
    let current = 0    // progresso interpolato, quello che pilota il video
    let rafId   = null
    let lastTs  = 0

    const applyHeight = () => {
      vh    = window.innerHeight
      range = reduced ? 0 : vh * SCROLL_MULTIPLIER
      // range + 1vh: si scorre tutto il video prima che la hero esca di scena
      wrapper.style.height = `${range + vh}px`
    }

    const readScroll = () => {
      scrollY = window.scrollY
      target  = range > 0 ? Math.min(Math.max(scrollY / range, 0), 1) : 0
    }

    const render = (ts) => {
      // dt limitato a 100ms: dopo un tab in background non deve "saltare"
      const dt = Math.min((ts - lastTs) / 1000, 0.1)
      lastTs = ts

      // Smorzamento esponenziale: indipendente dal refresh rate,
      // identico su un 60Hz e su un 120Hz
      current += (target - current) * (1 - Math.exp(-SMOOTHING * dt))
      const diff = Math.abs(target - current)
      if (diff < SETTLE_EPSILON) current = target

      if (video.duration) {
        const t = current * (video.duration - FRAME_DURATION)
        // Non accodiamo un seek mentre il decoder ne sta già servendo un altro,
        // ed evitiamo le riscritture sotto il mezzo frame: è ciò che causa lo stutter
        if (!video.seeking && Math.abs(t - video.currentTime) > FRAME_DURATION * 0.5) {
          video.currentTime = t
        }
      }

      if (barRef.current) barRef.current.style.transform = `scaleX(${current})`
      if (hintRef.current) {
        hintRef.current.style.opacity = Math.max(0, 1 - scrollY / (vh * 0.2))
      }

      if (diff < SETTLE_EPSILON) { rafId = null; return }  // loop in pausa
      rafId = requestAnimationFrame(render)
    }

    const wake = () => {
      if (rafId != null) return
      lastTs = performance.now()
      rafId  = requestAnimationFrame(render)
    }

    const onScroll = () => { readScroll(); wake() }

    const onResize = () => {
      const width     = window.innerWidth
      const heightOnly = width === lockedWidth
      // Su touch la barra URL che entra ed esce cambia innerHeight in continuazione:
      // ricalcolare lì farebbe sobbalzare la pagina sotto il dito
      if (heightOnly && window.matchMedia('(hover: none)').matches) return
      lockedWidth = width
      applyHeight()
      readScroll()
      wake()
    }

    const onReady = () => {
      video.pause()
      readScroll()
      current = target
      if (video.duration) video.currentTime = current * (video.duration - FRAME_DURATION)
      setReady(true)
      // Su iOS il decoder resta addormentato finché il video non parte almeno
      // una volta: senza questo il primo scrub arriva a scatti
      const played = video.play()
      if (played) played.then(() => video.pause()).catch(() => {})
    }

    applyHeight()
    readScroll()

    if (reduced) {
      // Niente scrub: primo fotogramma fisso e hero alta un solo schermo
      if (video.readyState >= 1) { video.pause(); video.currentTime = 0; setReady(true) }
      else video.addEventListener('loadedmetadata', () => { video.pause(); setReady(true) }, { once: true })
      window.addEventListener('resize', onResize, { passive: true })
      return () => window.removeEventListener('resize', onResize)
    }

    video.addEventListener('loadedmetadata', onReady)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    if (video.readyState >= 1) onReady()

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId)
      video.removeEventListener('loadedmetadata', onReady)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const poster = `${import.meta.env.BASE_URL}images/hero-poster.jpg`

  return (
    <div ref={wrapperRef} style={{ height: '100vh' }}>
      <section id="hero" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '100svh',
        background: '#08111f',
        overflow: 'hidden', zIndex: 5,
      }}>
        {/* Video a tutto schermo — z-index 0 */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `#08111f url(${poster}) center / cover no-repeat`,
          overflow: 'hidden',
        }}>
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}videos/${source}`}
            poster={poster}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block', pointerEvents: 'none',
              // Il poster resta visibile finché il primo frame non è al posto giusto
              opacity: ready ? 1 : 0,
              transition: 'opacity 420ms ease',
            }}
          />
        </div>

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

        {/* Scroll hint — pilotato dal loop rAF condiviso */}
        <div ref={hintRef} style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 6, zIndex: 10, willChange: 'opacity',
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

        {/* Progress bar — scaleX invece di width: niente reflow a ogni frame */}
        <div ref={barRef} style={{
          position: 'absolute', bottom: 0, left: 0, height: 1.5, width: '100%',
          background: 'linear-gradient(90deg, transparent, #C0C8D4, transparent)',
          transform: 'scaleX(0)', transformOrigin: 'left center',
          opacity: 0.6, zIndex: 10, willChange: 'transform',
        }} />
      </section>
    </div>
  )
}
