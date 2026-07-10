import { useEffect, useRef, useState, useCallback } from 'react'

const vertexShaderSource = `
  precision mediump float;
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_opacity;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying float v_opacity;
  varying vec2 v_position;
  void main() {
    vec2 position = (a_position / u_resolution) * 2.0 - 1.0;
    position.y *= -1.0;
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = a_size;
    v_opacity = a_opacity;
    v_position = a_position;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform vec3 u_accentColor;
  uniform vec3 u_glowColor;
  uniform vec3 u_coreColor;
  varying float v_opacity;
  varying vec2 v_position;
  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float dist = length(coord);
    if (dist > 0.5) { discard; }
    float innerGlow = 1.0 - smoothstep(0.0, 0.2, dist);
    float outerGlow = 1.0 - smoothstep(0.2, 0.5, dist);
    float glow = pow(innerGlow, 3.0) + pow(outerGlow, 1.5) * 0.6;
    float mouseDist = distance(v_position, u_mouse);
    float mouseGlow = 1.0 / (1.0 + mouseDist * 0.008);
    float mouseIntensity = smoothstep(300.0, 0.0, mouseDist);
    float timeWave = sin(u_time * 0.0008) * 0.5 + 0.5;
    float positionGradient = (v_position.x / u_resolution.x + v_position.y / u_resolution.y) * 0.5;
    vec3 baseColor = mix(u_primaryColor, u_secondaryColor, timeWave);
    baseColor = mix(baseColor, u_accentColor, positionGradient * 0.3);
    vec3 color = mix(baseColor, u_coreColor, innerGlow * 0.8);
    color = mix(color, u_glowColor, mouseGlow * mouseIntensity * 0.6);
    float bloom = glow * (1.0 + mouseGlow * 0.8);
    float finalAlpha = bloom * v_opacity * (0.9 + mouseIntensity * 0.4);
    gl_FragColor = vec4(color, finalAlpha);
  }
`

const postVertexShader = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = (a_position + 1.0) * 0.5;
  }
`

const postFragmentShader = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform vec2 u_texelSize;
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 v_texCoord;
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  void main() {
    vec4 color = texture2D(u_texture, v_texCoord);
    vec4 bloom = vec4(0.0);
    float totalWeight = 0.0;
    for (int i = -4; i <= 4; i++) {
      for (int j = -4; j <= 4; j++) {
        vec2 offset = vec2(float(i), float(j)) * u_texelSize * 2.5;
        vec4 s = texture2D(u_texture, v_texCoord + offset);
        float weight = exp(-float(i*i + j*j) * 0.2);
        bloom += s * weight;
        totalWeight += weight;
      }
    }
    bloom /= totalWeight;
    vec4 brightPass = max(color - 0.4, 0.0) * 3.0;
    bloom = bloom + brightPass * 0.9;
    float grain = random(v_texCoord * u_resolution + u_time * 0.001) * 0.05;
    vec2 center = v_texCoord - 0.5;
    float aberration = length(center) * 0.015;
    vec4 r = texture2D(u_texture, v_texCoord + center * aberration * vec2(1.0, 0.0));
    vec4 g = texture2D(u_texture, v_texCoord);
    vec4 b = texture2D(u_texture, v_texCoord - center * aberration * vec2(0.0, 1.0));
    vec4 aberrated = vec4(r.r, g.g, b.b, g.a);
    float vignette = smoothstep(0.3, 1.0, 1.0 - length(center) * 0.8);
    vec4 final = aberrated + bloom * 0.6;
    final.rgb += grain;
    final.rgb *= vignette;
    final.rgb = pow(final.rgb, vec3(0.9));
    final.rgb = mix(final.rgb, final.rgb * vec3(1.1, 0.95, 1.05), 0.3);
    gl_FragColor = final;
  }
`

export const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export function ParticleText({
  text = 'KREA',
  particleSize = 0.05,
  animationSpeed = 1.5,
  mouseForce = 250,
  interactionMode = 'repel',
  fontSize,
  fontFamily = 'Inter, sans-serif',
  className = '',
  primaryColor = [0.0, 0.83, 1.0],
  secondaryColor = [0.0, 0.5, 0.9],
  accentColor = [0.3, 0.9, 1.0],
  glowColor = [0.0, 0.96, 1.0],
  coreColor = [1.0, 1.0, 1.0],
}) {
  const canvasRef    = useRef(null)
  const webglRef     = useRef(null)
  const animRef      = useRef(null)
  const particlesRef = useRef([])
  const mouseRef     = useRef({ x: 0, y: 0 })
  const glRef        = useRef(null)
  const programRef   = useRef(null)
  const postProgramRef = useRef(null)
  const fbRef        = useRef(null)
  const texRef       = useRef(null)
  const bufsRef      = useRef({ position: null, size: null, opacity: null })
  const lastTimeRef  = useRef(0)

  const createShader = useCallback((gl, type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }, [])

  const createProgram = useCallback((gl, vs, fs) => {
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program error:', gl.getProgramInfoLog(prog))
      return null
    }
    return prog
  }, [])

  const initWebGL = useCallback(() => {
    const canvas = webglRef.current
    if (!canvas) return false
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true })
    if (!gl) return false
    glRef.current = gl

    const vs  = createShader(gl, gl.VERTEX_SHADER,   vertexShaderSource)
    const fs  = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const pvs = createShader(gl, gl.VERTEX_SHADER,   postVertexShader)
    const pfs = createShader(gl, gl.FRAGMENT_SHADER, postFragmentShader)
    if (!vs || !fs || !pvs || !pfs) return false

    programRef.current     = createProgram(gl, vs, fs)
    postProgramRef.current = createProgram(gl, pvs, pfs)
    if (!programRef.current || !postProgramRef.current) return false

    const fb  = gl.createFramebuffer()
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    fbRef.current  = fb
    texRef.current = tex

    bufsRef.current = { position: gl.createBuffer(), size: gl.createBuffer(), opacity: gl.createBuffer() }
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    return true
  }, [createShader, createProgram])

  const createParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    particlesRef.current = []

    const calcFontSize = fontSize || Math.min(160, window.innerWidth / 5)
    ctx.font = `900 ${calcFontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const textW = ctx.measureText(text).width
    const temp  = document.createElement('canvas')
    const tctx  = temp.getContext('2d')
    temp.width  = textW + 100
    temp.height = calcFontSize + 50
    tctx.font   = ctx.font
    tctx.fillStyle = '#fff'
    tctx.textAlign = 'center'
    tctx.textBaseline = 'middle'
    tctx.fillText(text, temp.width / 2, temp.height / 2)

    const imgData = tctx.getImageData(0, 0, temp.width, temp.height).data
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const step = 2

    for (let y = 0; y < temp.height; y += step) {
      for (let x = 0; x < temp.width; x += step) {
        if (imgData[(y * temp.width + x) * 4 + 3] > 128) {
          const px = cx + x - temp.width / 2
          const py = cy + y - temp.height / 2
          particlesRef.current.push({
            x: px + (Math.random() - 0.5) * 120,
            y: py + (Math.random() - 0.5) * 120,
            targetX: px, targetY: py,
            originalX: px, originalY: py,
            vx: 0, vy: 0,
            size: particleSize + Math.random() * 3,
            opacity: Math.random() * 0.4 + 0.6,
            life: 1,
          })
        }
      }
    }
  }, [text, particleSize, fontSize, fontFamily])

  const updateParticle = useCallback((p) => {
    if (p.isExplosion) {
      p.x += p.vx; p.y += p.vy
      p.vx *= 0.96; p.vy *= 0.96
      p.life -= 0.025
      p.opacity = Math.max(0, p.life)
      return
    }
    const dx = mouseRef.current.x - p.x
    const dy = mouseRef.current.y - p.y
    const distSq = dx * dx + dy * dy
    const mfSq   = mouseForce * mouseForce
    if (distSq < mfSq) {
      const d = Math.sqrt(distSq)
      const force = (mouseForce - d) / mouseForce
      const angle = Math.atan2(dy, dx)
      const dir   = interactionMode === 'attract' ? 1 : -1
      p.vx += Math.cos(angle) * force * 3 * dir
      p.vy += Math.sin(angle) * force * 3 * dir
    }
    p.vx += (p.targetX - p.x) * 0.04 * animationSpeed
    p.vy += (p.targetY - p.y) * 0.04 * animationSpeed
    p.vx *= 0.94; p.vy *= 0.94
    p.x += p.vx;  p.y += p.vy
  }, [mouseForce, animationSpeed, interactionMode])

  const renderWebGL = useCallback((t) => {
    const gl = glRef.current
    const prog = programRef.current
    const postProg = postProgramRef.current
    const canvas = webglRef.current
    if (!gl || !prog || !postProg || !canvas) return
    const pts = particlesRef.current
    if (!pts.length) return

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbRef.current)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.06, 0.08, 0.16, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(prog)

    gl.uniform2f(gl.getUniformLocation(prog, 'u_resolution'), canvas.width, canvas.height)
    gl.uniform2f(gl.getUniformLocation(prog, 'u_mouse'), mouseRef.current.x, canvas.height - mouseRef.current.y)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_time'), t)
    gl.uniform3fv(gl.getUniformLocation(prog, 'u_primaryColor'),   primaryColor)
    gl.uniform3fv(gl.getUniformLocation(prog, 'u_secondaryColor'), secondaryColor)
    gl.uniform3fv(gl.getUniformLocation(prog, 'u_accentColor'),    accentColor)
    gl.uniform3fv(gl.getUniformLocation(prog, 'u_glowColor'),      glowColor)
    gl.uniform3fv(gl.getUniformLocation(prog, 'u_coreColor'),      coreColor)

    const positions = new Float32Array(pts.length * 2)
    const sizes     = new Float32Array(pts.length)
    const opacities = new Float32Array(pts.length)
    for (let i = 0; i < pts.length; i++) {
      positions[i * 2]     = pts[i].x
      positions[i * 2 + 1] = pts[i].y
      sizes[i]     = pts[i].size * 7
      opacities[i] = pts[i].opacity
    }

    const posLoc = gl.getAttribLocation(prog, 'a_position')
    const sizLoc = gl.getAttribLocation(prog, 'a_size')
    const opLoc  = gl.getAttribLocation(prog, 'a_opacity')

    gl.bindBuffer(gl.ARRAY_BUFFER, bufsRef.current.position)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, bufsRef.current.size)
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(sizLoc)
    gl.vertexAttribPointer(sizLoc, 1, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, bufsRef.current.opacity)
    gl.bufferData(gl.ARRAY_BUFFER, opacities, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(opLoc)
    gl.vertexAttribPointer(opLoc, 1, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.POINTS, 0, pts.length)

    // Post-processing pass
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(postProg)

    const quad = new Float32Array([-1,-1, 1,-1, -1,1, 1,1])
    const qBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, qBuf)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
    const pPosLoc = gl.getAttribLocation(postProg, 'a_position')
    gl.enableVertexAttribArray(pPosLoc)
    gl.vertexAttribPointer(pPosLoc, 2, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texRef.current)
    gl.uniform1i(gl.getUniformLocation(postProg, 'u_texture'), 0)
    gl.uniform2f(gl.getUniformLocation(postProg, 'u_texelSize'), 1/canvas.width, 1/canvas.height)
    gl.uniform1f(gl.getUniformLocation(postProg, 'u_time'), t)
    gl.uniform2f(gl.getUniformLocation(postProg, 'u_resolution'), canvas.width, canvas.height)

    gl.disable(gl.BLEND)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.enable(gl.BLEND)
    gl.deleteBuffer(qBuf)
  }, [primaryColor, secondaryColor, accentColor, glowColor, coreColor])

  const animate = useCallback((t) => {
    lastTimeRef.current = t
    particlesRef.current = particlesRef.current.filter(p => {
      updateParticle(p)
      return !p.isExplosion || p.life > 0
    })
    renderWebGL(t)
    animRef.current = requestAnimationFrame(animate)
  }, [updateParticle, renderWebGL])

  const handleResize = useCallback(() => {
    const c  = canvasRef.current
    const wc = webglRef.current
    if (!c || !wc) return
    c.width  = wc.width  = window.innerWidth
    c.height = wc.height = window.innerHeight
    const gl = glRef.current
    if (gl && texRef.current) {
      gl.viewport(0, 0, wc.width, wc.height)
      gl.bindTexture(gl.TEXTURE_2D, texRef.current)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, wc.width, wc.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    }
    createParticles()
  }, [createParticles])

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY
  }, [])

  const handleClick = useCallback((e) => {
    const mx = e.clientX, my = e.clientY
    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120
      const vel   = 4 + Math.random() * 60
      particlesRef.current.push({
        x: mx, y: my, targetX: mx, targetY: my, originalX: mx, originalY: my,
        vx: Math.cos(angle) * vel, vy: Math.sin(angle) * vel,
        size: particleSize * 0.4, opacity: 1, life: 1, isExplosion: true,
      })
    }
    particlesRef.current.forEach(p => {
      if (p.isExplosion) return
      const dx = p.x - mx, dy = p.y - my
      const d  = Math.sqrt(dx*dx + dy*dy)
      if (d < 120) {
        const f = (120 - d) / 120
        const a = Math.atan2(dy, dx)
        p.vx += Math.cos(a) * f * 90
        p.vy += Math.sin(a) * f * 90
      }
    })
  }, [particleSize])

  useEffect(() => {
    if (initWebGL()) {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [initWebGL, handleResize])

  useEffect(() => { createParticles() }, [createParticles])

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [animate])

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }} />
      <canvas ref={webglRef}  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove} onClick={handleClick} />
    </div>
  )
}
