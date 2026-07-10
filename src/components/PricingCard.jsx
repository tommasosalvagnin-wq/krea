export default function PricingCard({ plan }) {
  const { icon, name, tagline, highlight, badge, features, price, btnLabel, btnStyle } = plan

  return (
    <div
      className="pricing-card"
      style={{
        position: 'relative',
        padding: '36px 32px',
        borderRadius: 4,
        border: highlight ? '2px solid #C0C8D4' : '1px solid rgba(74,85,104,0.3)',
        background: highlight
          ? 'linear-gradient(160deg, rgba(192,200,212,0.07) 0%, rgba(26,42,74,0.6) 100%)'
          : 'rgba(26,42,74,0.4)',
        boxShadow: highlight ? '0 0 50px rgba(192,200,212,0.15), inset 0 0 50px rgba(192,200,212,0.04)' : 'none',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.4s ease',
        cursor: 'default',
        opacity: 0,
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.04) translateY(-4px)'
        e.currentTarget.style.boxShadow = highlight
          ? '0 0 70px rgba(192,200,212,0.25), 0 20px 40px rgba(0,0,0,0.3)'
          : '0 0 30px rgba(192,200,212,0.10), 0 20px 40px rgba(0,0,0,0.2)'
        e.currentTarget.style.borderColor = '#C0C8D4'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = highlight ? '0 0 50px rgba(192,200,212,0.15), inset 0 0 50px rgba(192,200,212,0.04)' : 'none'
        e.currentTarget.style.borderColor = highlight ? '#C0C8D4' : 'rgba(74,85,104,0.3)'
      }}
    >
      {/* Badge */}
      {badge && (
        <div style={{
          position:'absolute', top:16, right:16,
          padding:'4px 12px', borderRadius:999,
          background:'#C0C8D4', color:'#0a1020',
          fontSize:10, fontWeight:800, letterSpacing:'0.15em',
        }}>
          {badge}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <span style={{ fontSize:28, marginRight:8 }}>{icon}</span>
        <h3 style={{ fontSize:19, fontWeight:800, color:'#E8ECF0', margin:'10px 0 6px' }}>{name}</h3>
        <p style={{ fontSize:13, color:'rgba(224,231,255,0.5)', margin:0 }}>{tagline}</p>
      </div>

      {/* Features */}
      <div style={{ flex:1, marginBottom:28 }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'flex-start', gap:10,
            padding:'8px 0',
            borderBottom: i < features.length-1 ? '1px solid rgba(74,85,104,0.15)' : 'none',
          }}>
            <span style={{ color:'#C0C8D4', fontWeight:700, marginTop:1, fontSize:14, flexShrink:0 }}>
              {typeof f === 'object' && f.section ? '' : '✓'}
            </span>
            {typeof f === 'object' && f.section ? (
              <p style={{ margin:0, fontSize:12, color:'rgba(224,231,255,0.45)', fontStyle:'italic' }}>{f.section}</p>
            ) : (
              <p style={{ margin:0, fontSize:13.5, color:'rgba(224,231,255,0.72)', lineHeight:1.5 }}>{f}</p>
            )}
          </div>
        ))}
      </div>

      {/* Price */}
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <span style={{ fontSize:46, fontWeight:900, color: highlight ? '#C0C8D4' : '#E8ECF0' }}>{price}</span>
        <span style={{ fontSize:14, color:'rgba(224,231,255,0.4)', marginLeft:4 }}>una tantum</span>
      </div>

      {/* Button */}
      <a href="#contact" style={{
        display:'block', textAlign:'center',
        padding:'14px 24px', borderRadius:12,
        background: btnStyle === 'cyan'
          ? '#C0C8D4'
          : 'rgba(74,85,104,0.3)',
        color: btnStyle === 'cyan' ? '#0a1020' : '#E8ECF0',
        fontWeight:700, fontSize:15, textDecoration:'none',
        border: btnStyle === 'cyan' ? 'none' : '1px solid rgba(74,85,104,0.4)',
        transition:'all 0.3s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.filter = 'brightness(1.15)'
          e.currentTarget.style.boxShadow = btnStyle === 'cyan' ? '0 0 24px rgba(192,200,212,0.4)' : '0 0 16px rgba(74,85,104,0.3)'
        }}
        onMouseLeave={e => { e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='none' }}>
        {btnLabel}
      </a>
    </div>
  )
}
