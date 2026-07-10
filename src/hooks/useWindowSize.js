import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '../utils/constants'

export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    ...size,
    isMobile:  size.width < BREAKPOINTS.mobile,
    isTablet:  size.width >= BREAKPOINTS.mobile && size.width < BREAKPOINTS.desktop,
    isDesktop: size.width >= BREAKPOINTS.desktop,
  }
}
