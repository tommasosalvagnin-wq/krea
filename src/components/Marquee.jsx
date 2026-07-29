import './Marquee.css'

const ITEMS = [
  'WEB 3D', 'VIDEO AI', 'MENU DIGITALI', 'SITI WEB', 'ANIMAZIONI 3D',
  'VIDEO HYPERREALISTICI', 'SCROLL EFFECTS', 'MOUSE TRACKING',
]

export default function Marquee({ reverse = false }) {
  const track = [...ITEMS, ...ITEMS]

  return (
    <div className="mq-wrap">
      <div className={`mq-track${reverse ? ' mq-reverse' : ''}`}>
        {track.map((item, i) => (
          <span key={i} className="mq-item">
            {item}
            <span className="mq-dot" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
