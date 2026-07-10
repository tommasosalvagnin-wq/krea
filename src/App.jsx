import './App.css'
import { useScrollAnimations } from './hooks/useScrollAnimations'
import Hero    from './pages/Hero'
import Pricing  from './pages/Pricing'
import Presenter       from './pages/Presenter'
import Contact         from './pages/Contact'
import Footer          from './pages/Footer'

export default function App() {
  useScrollAnimations()

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* Hero sticky + 100vh buffer per animazione scroll video */}
      <div style={{ position: 'relative' }}>
        <Hero />
        <div style={{ height: '100vh', background: '#0a0a0f', pointerEvents: 'none' }} aria-hidden="true" />
      </div>

      <Pricing />
      <Presenter />
      <Contact />
      <Footer  />
    </div>
  )
}

