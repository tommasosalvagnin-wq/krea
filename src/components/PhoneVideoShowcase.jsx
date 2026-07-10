import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/*
  CALIBRATION — TEST PHASE (magenta plane):
  - User confirmed: z = -0.021 puts video on CAMERA (back) side → WRONG
  - Therefore: z = +0.021 = SCREEN (front) side
  - DoubleSide during test to remove normal-direction ambiguity
  - autoRotate = false so we can verify orientation with camera fixed
  - Once position confirmed, swap color="magenta" for VideoTexture + FrontSide
*/

const PLANE_W = 0.82
const PLANE_H = 1.68
const PLANE_X = 0
const PLANE_Y = 0.02
const SCREEN_Z = 0.021   // positive Z = screen side (opposite of cameras at -Z)

/* ─── MagentaScreen — remove after confirming correct side ─── */
function MagentaScreen() {
  return (
    <mesh position={[PLANE_X, PLANE_Y, SCREEN_Z]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <meshBasicMaterial color="magenta" side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

/* ─── PhoneModel ─────────────────────────────────────── */
function PhoneModel() {
  const { scene } = useGLTF('/models/iphone-3d.glb')

  useEffect(() => {
    if (!scene) return
    console.group('[Phone] Mesh list')
    scene.traverse(o => {
      if (!o.isMesh) return
      const b = new THREE.Box3().setFromObject(o)
      const s = new THREE.Vector3(); b.getSize(s)
      console.log(`"${o.name}" pos=(${o.position.x.toFixed(3)},${o.position.y.toFixed(3)},${o.position.z.toFixed(3)}) size=${s.x.toFixed(3)}x${s.y.toFixed(3)}x${s.z.toFixed(3)}`)
    })
    console.groupEnd()
  }, [scene])

  return (
    <group>
      <primitive object={scene} />
      <MagentaScreen />
    </group>
  )
}

/* ─── Static fallback ────────────────────────────────── */
function StaticFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        position: 'relative', width: 260, borderRadius: 36,
        background: '#0d0d14', border: '2px solid rgba(255,255,255,0.12)',
        boxShadow: '0 0 0 6px #111622,0 0 0 8px rgba(192,200,212,0.15),0 40px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden', padding: '12px 6px 10px',
      }}>
        <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '9/16', background: '#000' }}>
          <video src="/videos/presenter.mp4" muted playsInline loop autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Main export ────────────────────────────────────── */
export default function PhoneVideoShowcase() {
  const [hasError, setHasError] = useState(false)
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1

  if (hasError) return <StaticFallback />

  return (
    <div style={{ position: 'relative', width: 300, height: 600 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={dpr}
        style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, #1a1f2e 0%, #0a0a0f 70%)',
          borderRadius: 12,
        }}
        onError={() => setHasError(true)}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 4]}   intensity={1.8} />
        <directionalLight position={[-4, 1, -3]} intensity={0.8} color="#C0C8D4" />
        <pointLight position={[0, 3, -5]} intensity={1.2} color="#8A9BB0" />

        <Suspense fallback={null}>
          <PhoneModel />
        </Suspense>

        {/* autoRotate=false during calibration — re-enable after confirming magenta is on screen side */}
        <OrbitControls
          autoRotate={false}
          enableRotate={true}
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
