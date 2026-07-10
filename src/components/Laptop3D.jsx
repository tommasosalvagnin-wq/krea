import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ── polyfill ── */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/* KREA screen logo */
function useScreenTex() {
  return useMemo(() => {
    const W = 1024, H = 640
    const c = document.createElement('canvas')
    c.width = W; c.height = H
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#050810'; ctx.fillRect(0, 0, W, H)

    /* subtle grid */
    ctx.strokeStyle = 'rgba(192,200,212,0.04)'; ctx.lineWidth = 1
    for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke() }
    for (let i = 0; i < H; i += 40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(W,i); ctx.stroke() }

    /* center glow */
    const g = ctx.createRadialGradient(W/2,H/2,20,W/2,H/2,260)
    g.addColorStop(0,'rgba(192,200,212,0.18)'); g.addColorStop(1,'rgba(192,200,212,0)')
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H)

    /* KREA text */
    ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.font = `900 ${W*0.19}px "Inter","Helvetica Neue",sans-serif`
    ctx.shadowColor='#C0C8D4'; ctx.shadowBlur=50
    const tg = ctx.createLinearGradient(W*0.2,0,W*0.8,0)
    tg.addColorStop(0,'#E8ECF0'); tg.addColorStop(0.5,'#C0C8D4'); tg.addColorStop(1,'#E8ECF0')
    ctx.fillStyle = tg
    ctx.fillText('KREA', W/2, H/2 - 22)

    /* tagline */
    ctx.shadowBlur=10; ctx.font=`300 ${W*0.05}px "Inter",sans-serif`
    ctx.fillStyle='rgba(224,231,255,0.55)'; ctx.fillText('AGENCY', W/2, H/2+52)

    /* accent line */
    const lg = ctx.createLinearGradient(W*0.3,0,W*0.7,0)
    lg.addColorStop(0,'transparent'); lg.addColorStop(0.5,'#C0C8D4'); lg.addColorStop(1,'transparent')
    ctx.shadowBlur=0; ctx.strokeStyle=lg; ctx.lineWidth=1.5
    ctx.beginPath(); ctx.moveTo(W*0.3,H/2+75); ctx.lineTo(W*0.7,H/2+75); ctx.stroke()

    const t = new THREE.CanvasTexture(c); t.needsUpdate=true; return t
  }, [])
}

/* Keyboard */
function useKbTex() {
  return useMemo(() => {
    const W=800,H=260,c=document.createElement('canvas')
    c.width=W; c.height=H
    const ctx=c.getContext('2d')
    ctx.fillStyle='#111520'; ctx.fillRect(0,0,W,H)
    const rows=[{n:14,y:8,kw:50,kh:38},{n:14,y:54,kw:50,kh:38},{n:13,y:100,kw:54,kh:38},{n:12,y:146,kw:58,kh:38}]
    rows.forEach(({n,y,kw,kh})=>{
      const tot=n*kw+(n-1)*3,sx=(W-tot)/2
      for(let i=0;i<n;i++){
        const x=sx+i*(kw+3)
        const g=ctx.createLinearGradient(x,y,x,y+kh)
        g.addColorStop(0,'#1d2130'); g.addColorStop(1,'#141820')
        ctx.fillStyle=g; rr(ctx,x,y,kw,kh,4); ctx.fill()
        ctx.strokeStyle='rgba(80,100,160,0.22)'; ctx.lineWidth=0.8; ctx.stroke()
        ctx.fillStyle='rgba(200,215,255,0.05)'; rr(ctx,x+1,y+1,kw-2,kh*0.35,3); ctx.fill()
      }
    })
    const sbX=(W-260)/2,sbY=194
    const sg=ctx.createLinearGradient(sbX,sbY,sbX,sbY+38)
    sg.addColorStop(0,'#1d2130'); sg.addColorStop(1,'#141820')
    ctx.fillStyle=sg; rr(ctx,sbX,sbY,260,38,4); ctx.fill()
    ctx.strokeStyle='rgba(80,100,160,0.22)'; ctx.lineWidth=0.8; ctx.stroke()
    const t=new THREE.CanvasTexture(c); t.needsUpdate=true; return t
  },[])
}

/* Lid exterior */
function useLidTex() {
  return useMemo(()=>{
    const W=1024,H=700,c=document.createElement('canvas')
    c.width=W; c.height=H
    const ctx=c.getContext('2d')
    ctx.fillStyle='#28292f'; ctx.fillRect(0,0,W,H)
    for(let y=0;y<H;y+=2){
      ctx.strokeStyle=`rgba(255,255,255,${0.006+Math.random()*0.009})`
      ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke()
    }
    const r=ctx.createRadialGradient(W*0.5,H*0.4,20,W*0.5,H*0.4,W*0.6)
    r.addColorStop(0,'rgba(200,210,230,0.12)'); r.addColorStop(1,'rgba(0,0,0,0.15)')
    ctx.fillStyle=r; ctx.fillRect(0,0,W,H)
    const t=new THREE.CanvasTexture(c); t.needsUpdate=true; return t
  },[])
}

/* ── MAIN ── */
export default function Laptop3D({ lidAngle=0, mouseX=0, mouseY=0, lightIntensity=1 }) {
  const groupRef=useRef(), lidRef=useRef(), glowRef=useRef()
  const screenTex=useScreenTex(), kbTex=useKbTex(), lidTex=useLidTex()
  const MAX=-Math.PI*0.585

  const bodyMat = { color:'#28292f', metalness:0.72, roughness:0.22 }
  const lidMat  = { color:'#28292f', metalness:0.72, roughness:0.20, map:lidTex }
  const BW=3.2,BD=2.05,BH=0.088,LW=3.2,LD=2.05,LH=0.065

  useFrame((state)=>{
    if(!groupRef.current||!lidRef.current) return
    const t=state.clock.getElapsedTime()
    groupRef.current.rotation.x=THREE.MathUtils.lerp(groupRef.current.rotation.x,mouseY*0.12,0.055)
    groupRef.current.rotation.y=THREE.MathUtils.lerp(groupRef.current.rotation.y,mouseX*0.20,0.055)
    lidRef.current.rotation.x=THREE.MathUtils.lerp(lidRef.current.rotation.x,MAX*lidAngle,0.07)
    if(glowRef.current){
      glowRef.current.emissiveIntensity=lidAngle*(0.5+Math.sin(t*2)*0.18)
    }
  })

  return (
    <group ref={groupRef} position={[0,-0.1,0]}>

      {/* BASE */}
      <group>
        <RoundedBox args={[BW,BH,BD]} radius={0.055} smoothness={6}>
          <meshStandardMaterial {...bodyMat} />
        </RoundedBox>

        {/* Keyboard deck */}
        <mesh position={[0,BH*0.52,-0.04]}>
          <boxGeometry args={[BW*0.88,0.003,BD*0.71]} />
          <meshStandardMaterial color="#101318" roughness={0.92} metalness={0.05} map={kbTex} />
        </mesh>

        {/* Trackpad */}
        <RoundedBox args={[0.86,0.007,0.54]} radius={0.016} smoothness={4} position={[0.05,BH*0.505,0.63]}>
          <meshStandardMaterial color="#1a1d24" metalness={0.75} roughness={0.08} />
        </RoundedBox>

        {/* Left ports */}
        <mesh position={[-BW/2+0.01,-0.005,-0.48]}>
          <boxGeometry args={[0.038,0.052,0.22]} />
          <meshStandardMaterial color="#0c0e14" roughness={0.4} metalness={0.85} />
        </mesh>
        {[-0.07,-0.035,0,0.035,0.07].map((oz,i)=>(
          <mesh key={i} position={[-BW/2+0.028,-0.005,-0.48+oz]} rotation={[0,0,Math.PI/2]}>
            <cylinderGeometry args={[0.007,0.007,0.008,8]} />
            <meshStandardMaterial color="#aaa" metalness={1} roughness={0.05} />
          </mesh>
        ))}
        {[-0.14,0.06].map((oz,i)=>(
          <mesh key={i} position={[-BW/2+0.01,-0.005,-0.08+oz]}>
            <boxGeometry args={[0.038,0.045,0.11]} />
            <meshStandardMaterial color="#090c12" roughness={0.3} metalness={0.9} />
          </mesh>
        ))}

        {/* Right port */}
        <mesh position={[BW/2-0.01,-0.005,0.1]}>
          <boxGeometry args={[0.038,0.045,0.11]} />
          <meshStandardMaterial color="#090c12" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Feet */}
        {[[-1.3,-0.68],[1.3,-0.68],[-1.3,0.76],[1.3,0.76]].map(([x,z],i)=>(
          <mesh key={i} position={[x,-BH/2-0.012,z]}>
            <cylinderGeometry args={[0.055,0.055,0.022,12]} />
            <meshStandardMaterial color="#0a0c10" roughness={1} metalness={0} />
          </mesh>
        ))}
      </group>

      {/* LID */}
      <group position={[0,BH/2,-BD/2]}>
        <group ref={lidRef}>
          <group position={[0,LH/2,LD/2]}>
            <RoundedBox args={[LW,LH,LD]} radius={0.055} smoothness={6}>
              <meshStandardMaterial {...lidMat} />
            </RoundedBox>

            {/* Bezel */}
            <mesh position={[0,LH*0.52,0.008]}>
              <boxGeometry args={[LW*0.95,0.013,LD*0.96]} />
              <meshStandardMaterial color="#09090f" roughness={0.92} metalness={0.1} />
            </mesh>

            {/* Screen */}
            <mesh ref={glowRef} position={[0,LH*0.535,0.018]}>
              <boxGeometry args={[LW*0.88,0.009,LD*0.875]} />
              <meshStandardMaterial
                map={screenTex}
                emissive="#C0C8D4"
                emissiveMap={screenTex}
                emissiveIntensity={0}
                roughness={0.05} metalness={0}
              />
            </mesh>

            {/* Camera */}
            <mesh position={[0,LH*0.527,-LD*0.435]}>
              <cylinderGeometry args={[0.018,0.018,0.012,14]} />
              <meshStandardMaterial color="#060810" roughness={0.8} metalness={0.4} />
            </mesh>

            {/* Hinge */}
            <mesh position={[0,-LH*0.48,-LD/2+0.038]}>
              <boxGeometry args={[LW*0.25,0.016,0.048]} />
              <meshStandardMaterial color="#1a1c22" metalness={0.95} roughness={0.04} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Dynamic screen light */}
      <pointLight position={[0,0.8,0.8]} intensity={lidAngle*lightIntensity*5}
        color="#C0C8D4" distance={7} decay={2} />
    </group>
  )
}
