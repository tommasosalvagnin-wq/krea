import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, Environment } from '@react-three/drei'
import Laptop3D from './Laptop3D'

function PulsingLights({ scrollProgress }) {
  const blueRef  = useRef()
  const magRef   = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = Math.sin(t * 2) * 0.3
    if (blueRef.current)  blueRef.current.intensity  = 0.8 + pulse
    if (magRef.current)   magRef.current.intensity   = 0.6 + pulse * 0.8
  })

  return (
    <>
      <ambientLight intensity={0.5} color="#8899bb" />
      <pointLight ref={blueRef}  position={[5,  5,  5]}  intensity={0.8} color="#0099ff" distance={20} decay={2} />
      <pointLight ref={magRef}   position={[-5,-5,  5]}  intensity={0.6} color="#ff00d4" distance={20} decay={2} />
      <directionalLight position={[-3,6,4]}  intensity={3}   color="#d0dff0" />
      <directionalLight position={[4, 3,2]}  intensity={1.5} color="#a0b8d8" />
      <directionalLight position={[0, 8,-4]} intensity={1.2} color="#c8d8f0" />
      <pointLight position={[0,1.5,1.8]} intensity={scrollProgress*6} color="#C0C8D4" distance={7} decay={2} />
    </>
  )
}

function FallbackBox() {
  return (
    <mesh>
      <boxGeometry args={[3,0.1,2]} />
      <meshStandardMaterial color="#28292f" metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

export default function LaptopScene({ lidAngle=0, mouseX=0, mouseY=0, isMobile=false }) {
  return (
    <Canvas
      camera={{ position:[0,2.2,7.2], fov:35, near:0.1, far:100 }}
      dpr={[1, isMobile ? 1 : 1.5]}
      gl={{ antialias:true, alpha:true, powerPreference:'high-performance', toneMapping:1, toneMappingExposure:1.0 }}
      style={{ background:'transparent', width:'100%', height:'100%' }}
    >
      <Suspense fallback={<FallbackBox />}>
        <PulsingLights scrollProgress={lidAngle} />
        <Environment preset="studio" backgroundIntensity={0} />

        <Float speed={1.1} rotationIntensity={0.03} floatIntensity={lidAngle>0.05 ? 0.05 : 0.20}>
          <Laptop3D lidAngle={lidAngle} mouseX={mouseX} mouseY={mouseY} lightIntensity={1} />
        </Float>

        <ContactShadows position={[0,-1.85,0]} opacity={0.5} scale={7} blur={2.5} far={4} color="#050d1a" frames={1} />
      </Suspense>
    </Canvas>
  )
}
