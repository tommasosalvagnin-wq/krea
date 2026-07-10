import { ParticleText } from '../components/ParticleText'

export default function ParticleSection() {
  return (
    <section
      id="particle-tagline"
      style={{
        position: 'relative',
        zIndex: 20,
        height: '50vh',
        background: '#0a0a0f',
        borderTop: '1px solid rgba(192,200,212,0.08)',
        overflow: 'hidden',
      }}
    >
      <ParticleText
        text="KREA"
        particleSize={0.08}
        animationSpeed={1.5}
        mouseForce={220}
        interactionMode="repel"
        primaryColor={[0.0, 0.83, 1.0]}
        secondaryColor={[0.0, 0.39, 0.9]}
        accentColor={[0.3, 0.9, 1.0]}
        glowColor={[0.0, 0.96, 1.0]}
        coreColor={[1.0, 1.0, 1.0]}
      />
    </section>
  )
}
