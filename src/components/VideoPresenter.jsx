import { useRef, useState, useEffect } from 'react'

export default function VideoPresenter() {
  const videoRef    = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration,  setDuration]  = useState(null)
  const [hovered,   setHovered]   = useState(false)

  /* Durata leggibile */
  const fmtDuration = (s) => {
    if (!s) return null
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')} min` : `${sec} sec`
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onMeta  = () => setDuration(video.duration)
    const onTime  = () => {
      if (!progressRef.current || !video.duration) return
      progressRef.current.style.width = `${(video.currentTime / video.duration) * 100}%`
    }
    const onEnded = () => setIsPlaying(false)

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('timeupdate',     onTime)
    video.addEventListener('ended',          onEnded)
    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('timeupdate',     onTime)
      video.removeEventListener('ended',          onEnded)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play(); setIsPlaying(true) }
    else              { video.pause(); setIsPlaying(false) }
  }

  return (
    <div
      onClick={togglePlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#000',
        boxShadow: `
          0 0 0 1px rgba(192,200,212,0.15),
          0 25px 80px rgba(0,0,0,0.5),
          0 0 60px rgba(192,200,212,0.1)
        `,
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}videos/presenter.mp4`}
        playsInline
        preload="metadata"
        style={{ width: '100%', display: 'block' }}
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered && isPlaying
          ? 'rgba(0,0,0,0)'
          : isPlaying
            ? 'rgba(0,0,0,0)'
            : hovered
              ? 'rgba(0,0,0,0.5)'
              : 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isPlaying && !hovered ? 0 : 1,
        transition: 'opacity 0.3s, background 0.3s',
        pointerEvents: isPlaying && !hovered ? 'none' : 'auto',
      }}>
        {/* Corner badge */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(192,200,212,0.15)',
          border: '1px solid rgba(192,200,212,0.3)',
          borderRadius: 4, padding: '6px 14px',
          fontSize: 12, color: '#C0C8D4',
          backdropFilter: 'blur(8px)',
        }}>
          🎬 Presentazione KREA
        </div>

        {/* Duration badge */}
        {!isPlaying && duration && (
          <div style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 4, padding: '5px 12px',
            fontSize: 13, color: '#fff',
            backdropFilter: 'blur(4px)',
          }}>
            ▶ {fmtDuration(duration)}
          </div>
        )}

        {/* Play button */}
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.8)',
          background: 'rgba(192,200,212,0.15)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.25s ease',
          animation: !isPlaying ? 'presenterPulse 2s ease-in-out infinite' : 'none',
        }}>
          {isPlaying ? (
            /* Pause icon */
            <div style={{ display: 'flex', gap: 5 }}>
              <div style={{ width: 4, height: 20, background: '#fff', borderRadius: 2 }} />
              <div style={{ width: 4, height: 20, background: '#fff', borderRadius: 2 }} />
            </div>
          ) : (
            /* Play triangle */
            <div style={{
              width: 0, height: 0,
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent',
              borderLeft: '20px solid #fff',
              marginLeft: 5,
            }} />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3, background: 'rgba(255,255,255,0.1)',
      }}>
        <div ref={progressRef} style={{
          height: '100%', width: '0%',
          background: '#C0C8D4',
          transition: 'width 0.1s linear',
        }} />
      </div>
    </div>
  )
}
