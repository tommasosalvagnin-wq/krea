import { useForm } from 'react-hook-form'
import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'
import './StackedForm.css'

gsap.registerPlugin(ScrollTrigger)

const EJS_SERVICE  = 'service_jg4k4go'
const EJS_TEMPLATE = 'template_1vadko8'
const EJS_PUBLIC   = 'rJRSibuP5RKlsRAU0'

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></g>
  </svg>
)
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></g>
  </svg>
)
const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></g>
  </svg>
)
const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></g>
  </svg>
)
const IconEdit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></g>
  </svg>
)

/* Campo con etichetta che sale. L'input tiene placeholder=" " perché
   :placeholder-shown è ciò che dice al CSS se il campo è vuoto */
function Field({ icon, label, textarea = false, inputProps = {}, shake = false }) {
  const boxRef = useRef(null)

  // L'alone segue il mouse e il campo si sporge verso il cursore, come una
  // calamita. È lo stesso mouse tracking che l'agenzia vende come servizio
  const onMove = (e) => {
    const el = boxRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--kf-mx', `${x}px`)
    el.style.setProperty('--kf-my', `${y}px`)
    // scostamento massimo 7px, proporzionale a quanto sei lontano dal centro
    const dx = (x / r.width - 0.5) * 2
    const dy = (y / r.height - 0.5) * 2
    el.style.setProperty('--kf-tx', `${(dx * 7).toFixed(2)}px`)
    el.style.setProperty('--kf-ty', `${(dy * 4).toFixed(2)}px`)
    el.style.setProperty('--kf-rot', `${(dx * 0.5).toFixed(3)}deg`)
  }

  const onLeave = () => {
    const el = boxRef.current
    if (!el) return
    el.style.setProperty('--kf-tx', '0px')
    el.style.setProperty('--kf-ty', '0px')
    el.style.setProperty('--kf-rot', '0deg')
  }
  const onDown = (e) => {
    const el = boxRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--kf-x', `${e.clientX - r.left}px`)
    el.style.setProperty('--kf-y', `${e.clientY - r.top}px`)
  }

  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div
      ref={boxRef}
      className={`kf-input-container${textarea ? ' kf-textarea' : ''}${shake ? ' kf-shake' : ''}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={onDown}
    >
      {icon}
      <div className="kf-field">
        <Tag className="kf-input" placeholder=" " {...inputProps} />
        <span className="kf-label">{label}</span>
      </div>
    </div>
  )
}

export default function ContactForm() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(null)
  const formRef = useRef(null)

  // Quanto manca a poter inviare: il bottone si riempie di conseguenza
  const vals = watch(['email', 'phone', 'company'])
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals[0] || '')
  const fatti = [emailOk, !!(vals[1] || '').trim(), !!(vals[2] || '').trim()].filter(Boolean).length
  const completamento = fatti / 3
  const pronto = fatti === 3

  // Entrata scaglionata quando la sezione entra in vista
  useEffect(() => {
    if (!formRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.kf-row', {
        opacity: 0,
        y: 26,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
      })
    }, formRef)
    return () => ctx.revert()
  }, [sent])

  const onSubmit = async (data) => {
    setSending(true)
    setSendError(null)
    try {
      await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
        email:   data.email,
        phone:   data.phone,
        company: data.company,
        service: data.service || 'Non specificato',
        message: data.message || '',
      }, EJS_PUBLIC)
      setSent(true)
      reset()
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      console.error('EmailJS error:', err)
      setSendError("Errore durante l'invio. Riprova o contattaci direttamente.")
    } finally {
      setSending(false)
    }
  }

  if (sent) return (
    <div className="krea-form kf-done" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      {/* La spunta si disegna da sola, poi il testo sale */}
      <svg className="kf-check" width="64" height="64" viewBox="0 0 52 52" aria-hidden="true">
        <circle className="kf-check-ring" cx="26" cy="26" r="23" fill="none" />
        <path className="kf-check-mark" fill="none" d="M14 27 l8 8 l16 -17" />
      </svg>
      <h3 className="kf-done-title">Ricevuto</h3>
      <p className="kf-done-sub">Ti rispondiamo entro 24 ore.</p>
    </div>
  )

  return (
    <div className="krea-form">
      <div className="kf-texture" />

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

        <div className="kf-row">
          <Field icon={<IconMail />} label="Email *" shake={!!errors.email}
            inputProps={{
              type: 'email',
              ...register('email', {
                required: 'Email obbligatoria',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email non valida' },
              }),
            }} />
          {errors.email && <span className="kf-error">{errors.email.message}</span>}
        </div>

        <div className="kf-row">
          <Field icon={<IconPhone />} label="WhatsApp *" shake={!!errors.phone}
            inputProps={{ type: 'tel', ...register('phone', { required: 'Telefono obbligatorio' }) }} />
          {errors.phone && <span className="kf-error">{errors.phone.message}</span>}
        </div>

        <div className="kf-row">
          <Field icon={<IconBuilding />} label="Nome Azienda *" shake={!!errors.company}
            inputProps={{ type: 'text', ...register('company', { required: 'Azienda obbligatoria' }) }} />
          {errors.company && <span className="kf-error">{errors.company.message}</span>}
        </div>

        {/* Il select ha già la sua voce guida: niente etichetta mobile */}
        <div className="kf-row">
          <div className="kf-input-container">
            <IconList />
            <div className="kf-field">
              <select className="kf-input" {...register('service')}>
                <option value="">Servizio di interesse...</option>
                <option value="sito3d">Sito 3D</option>
                <option value="video3d">Video 3D</option>
                <option value="menu">Menu Digitale</option>
                <option value="tutto">Tutto!</option>
              </select>
            </div>
          </div>
        </div>

        <div className="kf-row">
          <Field icon={<IconEdit />} label="Descrivi il tuo progetto..." textarea shake={!!errors.message}
            inputProps={{ ...register('message', { maxLength: { value: 500, message: 'Max 500 caratteri' } }) }} />
          {errors.message && <span className="kf-error">{errors.message.message}</span>}
        </div>

        <div className="kf-row kf-submit">
          <button
            type="submit"
            disabled={sending}
            className={pronto ? 'is-ready' : ''}
            style={{ '--kf-fill': completamento }}
          >
            {/* Il riempimento avanza con i campi obbligatori compilati */}
            <span className="kf-fill" aria-hidden="true" />
            <span className="kf-btn-text">
              {sending ? 'Invio in corso…' : pronto ? 'Invia il tuo progetto' : `Compila i campi (${fatti}/3)`}
            </span>
          </button>
        </div>

        {sendError && <p className="kf-send-error">{sendError}</p>}
      </form>
    </div>
  )
}
