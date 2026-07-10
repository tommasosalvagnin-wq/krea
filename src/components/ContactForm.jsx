import { useForm } from 'react-hook-form'
import { useState } from 'react'

const inputStyle = (hasError) => ({
  width: '100%', padding: '14px 18px',
  borderRadius: 10, fontSize: 15,
  background: 'rgba(26,42,74,0.5)',
  border: `1.5px solid ${hasError ? '#ff6b6b' : 'rgba(74,85,104,0.4)'}`,
  color: '#E8ECF0', outline: 'none',
  transition: 'border-color 0.3s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
})

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const onSubmit = async (data) => {
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    console.log('Form data:', data)
    setSending(false)
    setSent(true)
    reset()
    setTimeout(() => setSent(false), 5000)
  }

  if (sent) return (
    <div style={{ textAlign:'center', padding:'60px 40px' }}>
      <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
      <h3 style={{ fontSize:24, fontWeight:700, color:'#C0C8D4', marginBottom:10 }}>Messaggio inviato!</h3>
      <p style={{ color:'rgba(224,231,255,0.6)', fontSize:16 }}>
        Ti risponderemo entro 24 ore. Controlla la tua email!
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Email + Telefono */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div>
          <label style={{ display:'block', fontSize:12, color:'rgba(224,231,255,0.5)', marginBottom:6, letterSpacing:'0.08em' }}>
            📧 Email *
          </label>
          <input
            type="email"
            placeholder="tua@email.com"
            style={inputStyle(!!errors.email)}
            onFocus={e => e.target.style.borderColor = '#C0C8D4'}
            onBlur={e => e.target.style.borderColor = errors.email ? '#ff6b6b' : 'rgba(74,85,104,0.4)'}
            {...register('email', {
              required: 'Email obbligatoria',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email non valida' },
            })}
          />
          {errors.email && <p style={{ color:'#ff6b6b', fontSize:12, margin:'5px 0 0' }}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={{ display:'block', fontSize:12, color:'rgba(224,231,255,0.5)', marginBottom:6, letterSpacing:'0.08em' }}>
            📱 WhatsApp *
          </label>
          <input
            type="tel"
            placeholder="+39 333 000 0000"
            style={inputStyle(!!errors.phone)}
            onFocus={e => e.target.style.borderColor = '#C0C8D4'}
            onBlur={e => e.target.style.borderColor = errors.phone ? '#ff6b6b' : 'rgba(74,85,104,0.4)'}
            {...register('phone', { required: 'Telefono obbligatorio' })}
          />
          {errors.phone && <p style={{ color:'#ff6b6b', fontSize:12, margin:'5px 0 0' }}>{errors.phone.message}</p>}
        </div>
      </div>

      {/* Azienda */}
      <div>
        <label style={{ display:'block', fontSize:12, color:'rgba(224,231,255,0.5)', marginBottom:6, letterSpacing:'0.08em' }}>
          🏢 Nome Azienda *
        </label>
        <input
          type="text"
          placeholder="La tua azienda"
          style={inputStyle(!!errors.company)}
          onFocus={e => e.target.style.borderColor = '#C0C8D4'}
          onBlur={e => e.target.style.borderColor = errors.company ? '#ff6b6b' : 'rgba(74,85,104,0.4)'}
          {...register('company', { required: 'Azienda obbligatoria' })}
        />
        {errors.company && <p style={{ color:'#ff6b6b', fontSize:12, margin:'5px 0 0' }}>{errors.company.message}</p>}
      </div>

      {/* Servizio */}
      <div>
        <label style={{ display:'block', fontSize:12, color:'rgba(224,231,255,0.5)', marginBottom:6, letterSpacing:'0.08em' }}>
          💬 Che servizio ti interessa?
        </label>
        <select
          style={{ ...inputStyle(false), cursor:'pointer', appearance:'none',
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2300d4ff' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
            backgroundRepeat:'no-repeat', backgroundPosition:'right 16px center',
          }}
          onFocus={e => e.target.style.borderColor = '#C0C8D4'}
          onBlur={e => e.target.style.borderColor = 'rgba(74,85,104,0.4)'}
          {...register('service')}
        >
          <option value="" style={{ background:'#1a2a4a' }}>Seleziona un servizio...</option>
          <option value="sito3d" style={{ background:'#1a2a4a' }}>Sito 3D</option>
          <option value="video3d" style={{ background:'#1a2a4a' }}>Video 3D</option>
          <option value="menu" style={{ background:'#1a2a4a' }}>Menu Digitale</option>
          <option value="tutto" style={{ background:'#1a2a4a' }}>Tutto!</option>
        </select>
      </div>

      {/* Descrizione */}
      <div>
        <label style={{ display:'block', fontSize:12, color:'rgba(224,231,255,0.5)', marginBottom:6, letterSpacing:'0.08em' }}>
          📝 Descrivi il tuo progetto...
        </label>
        <textarea
          placeholder="Raccontaci la tua idea, i tuoi obiettivi, le tue aspettative..."
          rows={4}
          style={{ ...inputStyle(false), resize:'vertical', minHeight:110, lineHeight:1.6 }}
          onFocus={e => e.target.style.borderColor = '#C0C8D4'}
          onBlur={e => e.target.style.borderColor = 'rgba(74,85,104,0.4)'}
          {...register('message', { maxLength: { value:500, message:'Max 500 caratteri' } })}
        />
        {errors.message && <p style={{ color:'#ff6b6b', fontSize:12, margin:'5px 0 0' }}>{errors.message.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={sending}
        style={{
          padding:'16px 32px', borderRadius:12, border:'none',
          background: sending ? 'rgba(192,200,212,0.5)' : '#C0C8D4',
          color:'#0a1020', fontWeight:800, fontSize:16,
          cursor: sending ? 'wait' : 'pointer',
          transition:'all 0.3s', fontFamily:'inherit',
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
        }}
        onMouseEnter={e => { if (!sending) { e.currentTarget.style.boxShadow='0 0 32px rgba(192,200,212,0.45)'; e.currentTarget.style.transform='translateY(-2px)' }}}
        onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
      >
        {sending ? (
          <>
            <span style={{ width:16,height:16,border:'2px solid #0a1020',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }} />
            Invio in corso...
          </>
        ) : '🚀 Invia il tuo progetto'}
      </button>

      <p style={{ textAlign:'center', fontSize:12, color:'rgba(224,231,255,0.3)', margin:0 }}>
        Risponderemo entro 24 ore · Nessuno spam, promesso
      </p>
    </form>
  )
}
