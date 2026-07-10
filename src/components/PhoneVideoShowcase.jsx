import { useEffect, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, useVideoTexture } from '@react-three/drei'
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
function VideoScreen() {
  const texture = useVideoTexture('/videos/presenter.mp4', {
    muted: true, loop: true, start: true, crossOrigin: 'anonymous',
  })

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

function PhoneModel() {
  const { scene } = useGLTF('/models/iphone-3d.glb')

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
      <Suspense fallback={null}>
        <VideoScreen />
      </Suspense>
    </group>
  )
}

export default function PhoneVideoShowcase() {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1

  return (
    <div style={{
      width: '100%',
      maxWidth: 390,
      aspectRatio: '9 / 16',
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      background: 'radial-gradient(ellipse at center, #1a1f2e 0%, #0a0a0f 70%)',
    }}>
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
          <PhoneModel />
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
    </div>
  )
}

useGLTF.preload('/models/iphone-3d.glb')
