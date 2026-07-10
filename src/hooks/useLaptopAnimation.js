import { useEffect, useRef, useState, useCallback } from 'react'

export function useLaptopAnimation() {
  const mouseRef  = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const rafRef    = useRef(null)
  const [mouseNorm,    setMouseNorm]    = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)

  /* ── smooth mouse tracking ── */
  const onMouseMove = useCallback((e) => {
    mouseRef.current.tx = (e.clientX / window.innerWidth)  * 2 - 1
    mouseRef.current.ty = -((e.clientY / window.innerHeight) * 2 - 1)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      const m = mouseRef.current
      m.x = lerp(m.x, m.tx, 0.08)
      m.y = lerp(m.y, m.ty, 0.08)
      setMouseNorm({ x: m.x, y: m.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [onMouseMove])

  /* ── scroll progress: lid opens over first 100vh ── */
  useEffect(() => {
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      setScrollProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { mouseNorm, scrollProgress }
}
