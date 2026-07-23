import { useForm } from 'react-hook-form'
import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './StackedForm.css'

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

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(null)

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
    <div className="krea-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div className="kf-texture" />
      <h3 style={{ fontSize: 22, fontWeight: 700, color: '#C0C8D4', margin: '0 0 10px' }}>Messaggio inviato!</h3>
      <p style={{ color: 'rgba(192,200,212,0.6)', fontSize: 15, margin: 0 }}>
        Ti risponderemo entro 24 ore.
      </p>
    </div>
  )

  return (
    <div className="krea-form">
      <div className="kf-texture" />

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

        <div className="kf-input-container">
          <IconMail />
          <input className="kf-input" type="email" placeholder="Email *"
            {...register('email', {
              required: 'Email obbligatoria',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email non valida' },
            })} />
        </div>
        {errors.email && <span className="kf-error">{errors.email.message}</span>}

        <div className="kf-input-container">
          <IconPhone />
          <input className="kf-input" type="tel" placeholder="WhatsApp *"
            {...register('phone', { required: 'Telefono obbligatorio' })} />
        </div>
        {errors.phone && <span className="kf-error">{errors.phone.message}</span>}

        <div className="kf-input-container">
          <IconBuilding />
          <input className="kf-input" type="text" placeholder="Nome Azienda *"
            {...register('company', { required: 'Azienda obbligatoria' })} />
        </div>
        {errors.company && <span className="kf-error">{errors.company.message}</span>}

        <div className="kf-input-container">
          <IconList />
          <select className="kf-input" {...register('service')}>
            <option value="">Servizio di interesse...</option>
            <option value="sito3d">Sito 3D</option>
            <option value="video3d">Video 3D</option>
            <option value="menu">Menu Digitale</option>
            <option value="tutto">Tutto!</option>
          </select>
        </div>

        <div className="kf-input-container kf-textarea">
          <IconEdit />
          <textarea className="kf-input" placeholder="Descrivi il tuo progetto..."
            {...register('message', { maxLength: { value: 500, message: 'Max 500 caratteri' } })} />
        </div>
        {errors.message && <span className="kf-error">{errors.message.message}</span>}

        <div className="kf-submit">
          <button type="submit" disabled={sending}>
            {sending ? 'Invio in corso...' : 'Invia il tuo progetto'}
          </button>
        </div>

        {sendError && <p className="kf-send-error">{sendError}</p>}
      </form>
    </div>
  )
}
