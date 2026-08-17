import { useEffect, useState, useRef, useCallback, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

/* Canvas alphaMap con angoli arrotondati — UV mapping corretto */
function makeRoundedAlpha(w, h, radius) {
  const scale = 512
  const pw = scale, ph = Math.round(scale * (h / w))
  const canvas = document.createElement('canvas')
  canvas.width = pw; canvas.height = ph
  const ctx = canvas.getContext('2d')
  const r = radius * (pw / w)
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(pw - r, 0)
  ctx.quadraticCurveTo(pw, 0,  pw, r)
  ctx.lineTo(pw, ph - r)
  ctx.quadraticCurveTo(pw, ph, pw - r, ph)
  ctx.lineTo(r, ph)
  ctx.quadraticCurveTo(0, ph,  0, ph - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0,   r, 0)
  ctx.closePath()
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

/* ─── Video screen con PlaneGeometry (UV corretti) + alphaMap arrotondato ─── */
function VideoScreen({ video }) {
  // La texture è costruita a mano invece che con useVideoTexture: quello
  // sospende finché il video non è pronto e tiene l'elemento per sé, mentre
  // qui serve poterlo raggiungere per accendere l'audio
  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [video])

  useEffect(() => () => texture.dispose(), [texture])

  const alpha = useMemo(() => makeRoundedAlpha(0.88, 1.86, 0.13), [])

  return (
    <mesh position={[0, 0, 0.086]}>
      <planeGeometry args={[0.88, 1.86]} />
      <meshBasicMaterial
        map={texture}
        alphaMap={alpha}
        transparent
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

function PhoneModel({ video }) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/iphone-3d.glb`)

  useEffect(() => {
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    console.log('[Phone] bounding box:', {
      W: size.x.toFixed(4),
      H: size.y.toFixed(4),
      D: size.z.toFixed(4),
      minX: box.min.x.toFixed(4), maxX: box.max.x.toFixed(4),
      minY: box.min.y.toFixed(4), maxY: box.max.y.toFixed(4),
      minZ: box.min.z.toFixed(4), maxZ: box.max.z.toFixed(4),
    })
  }, [scene])

  return (
    <group>
      <primitive object={scene} />
      <VideoScreen video={video} />
    </group>
  )
}

export default function PhoneVideoShowcase() {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1
  const wrapRef = useRef(null)
  const [audioOn, setAudioOn] = useState(false)

  // L'elemento video vive qui, non dentro la scena 3D: è il solo modo di
  // avere in mano il controllo dell'audio. Parte muto perché senza un gesto
  // dell'utente il browser blocca l'autoplay sonoro e non partirebbe affatto
  const video = useMemo(() => {
    const v = document.createElement('video')
    v.src = `${import.meta.env.BASE_URL}videos/presenter.mp4`
    v.loop = true
    v.muted = true
    v.playsInline = true
    v.preload = 'auto'
    v.crossOrigin = 'anonymous'
    return v
  }, [])

  useEffect(() => {
    const p = video.play()
    if (p) p.catch(() => {})
    // Solo pause: togliere la sorgente qui svuotava l'elemento, e con il
    // doppio montaggio di StrictMode al secondo giro non c'era più niente
    // da riprodurre
    return () => video.pause()
  }, [video])

  const toggleAudio = () => {
    if (!video.muted) { spegni(); return }
    // Si accende solo se il telefono è in vista
    if (!inVista()) {
      wrapRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    video.muted = false
    video.volume = 0.85
    // Il click è il gesto che sblocca il suono; se il video era fermo
    // per qualche motivo, riparte qui
    const p = video.play()
    if (p) p.catch(() => {})
    setAudioOn(true)
  }

  // Il suono esiste solo mentre il telefono è davvero davanti agli occhi.
  // Appena scende sotto questa quota di visibilità si spegne: una voce che
  // continua a parlare mentre si legge un'altra sezione è fastidiosa
  const SOGLIA_VISIBILE = 0.5

  const spegni = useCallback(() => {
    if (video.muted) return
    video.muted = true
    setAudioOn(false)
  }, [video])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const io = new IntersectionObserver(([e]) => {
      if (video.muted) return
      // La voce dell'observer può arrivare in ritardo e descrivere una
      // posizione già superata: la controprova evita che una notifica
      // vecchia annulli un click appena fatto
      if (e.intersectionRatio >= SOGLIA_VISIBILE) return
      const r = wrap.getBoundingClientRect()
      const alt = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
      const quota = r.height > 0 ? Math.max(0, alt) / r.height : 0
      if (quota < SOGLIA_VISIBILE) spegni()
    }, { threshold: [0, 0.25, SOGLIA_VISIBILE, 0.75, 1] })
    io.observe(wrap)

    // Cambio scheda o finestra ridotta a icona: stesso trattamento
    const onHidden = () => { if (document.hidden) spegni() }
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('pagehide', spegni)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('pagehide', spegni)
    }
  }, [video, spegni])

  // Acceso solo se il telefono è in vista: senza questa guardia il pulsante
  // resterebbe premibile anche con la sezione fuori campo (per esempio da
  // tastiera, arrivandoci col tab)
  const inVista = () => {
    const wrap = wrapRef.current
    if (!wrap) return false
    const r = wrap.getBoundingClientRect()
    const alt = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
    return r.height > 0 && Math.max(0, alt) / r.height >= SOGLIA_VISIBILE
  }

  return (
    <div ref={wrapRef} style={{
      width: '100%',
      maxWidth: 390,
      aspectRatio: '9 / 16',
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      background: 'radial-gradient(ellipse at center, #1a1f2e 0%, #0a0a0f 70%)',
    }}>
      <style>{`
        .pv-audio {
          position: absolute;
          left: 50%;
          bottom: 14px;
          transform: translateX(-50%);
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(192,200,212,0.22);
          background: rgba(10,10,15,0.62);
          backdrop-filter: blur(8px);
          color: #C0C8D4;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .pv-audio svg { stroke: currentColor; flex-shrink: 0; }
        .pv-audio:hover { border-color: rgba(192,200,212,0.5); color: #E8ECF0; background: rgba(10,10,15,0.8); }
        .pv-audio:focus-visible { outline: 2px solid #C0C8D4; outline-offset: 2px; }
        .pv-audio[aria-pressed="true"] { border-color: rgba(192,200,212,0.5); color: #E8ECF0; }
      `}</style>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={dpr}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[3, 5, 4]}   intensity={1.8} />
        <directionalLight position={[-4, 1, -3]} intensity={0.8} color="#C0C8D4" />
        <pointLight position={[0, 3, -5]}        intensity={1.2} color="#8A9BB0" />

        <Suspense fallback={null}>
          <PhoneModel video={video} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          autoRotate
          autoRotateSpeed={1.5}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>

      {/* Il pulsante sta fuori dal Canvas: dev'essere un vero controllo
          raggiungibile da tastiera, non un oggetto 3D */}
      <button
        type="button"
        onClick={toggleAudio}
        className="pv-audio"
        aria-pressed={audioOn}
        aria-label={audioOn ? 'Disattiva audio del video' : 'Attiva audio del video'}
        title={audioOn ? 'Disattiva audio' : 'Attiva audio'}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          {audioOn ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <path d="M22 9l-6 6M16 9l6 6" />
          )}
        </svg>
        <span>{audioOn ? 'Audio attivo' : 'Attiva audio'}</span>
      </button>
    </div>
  )
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/iphone-3d.glb`)
