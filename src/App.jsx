import './App.css'
import { useScrollAnimations } from './hooks/useScrollAnimations'
import Hero      from './pages/Hero'
import Marquee   from './components/Marquee'
import WhatWeDo  from './pages/WhatWeDo'
import Pricing   from './pages/Pricing'
import Presenter from './pages/Presenter'
import Portfolio from './pages/Portfolio'
import Contact   from './pages/Contact'
import Footer    from './pages/Footer'

export default function App() {
  useScrollAnimations()

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* Hero con position:fixed — non sale mai verso l'alto */}
      <Hero />

      {/* Le sezioni successive scivolano SOPRA la hero (z-index 10 > 5) */}
      <div style={{ position: 'relative', zIndex: 10, background: '#0a0a0f' }}>
        <Marquee />
        <WhatWeDo />
        <Pricing />
        <Presenter />
        <Portfolio />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

