const features = [
  {
    icon: '✨',
    title: '3D Innovation',
    desc: 'Scene tridimensionali interattive ad alte prestazioni con Three.js e WebGL.',
  },
  {
    icon: '🎨',
    title: 'Full Customization',
    desc: 'Ogni pixel progettato su misura per il tuo brand e la tua identità visiva.',
  },
  {
    icon: '⚡',
    title: 'High Performance',
    desc: 'Ottimizzato per 60fps su ogni dispositivo, dal mobile al workstation.',
  },
  {
    icon: '🚀',
    title: 'Scalable Solutions',
    desc: 'Architetture moderne che crescono con il tuo business senza limiti.',
  },
]

export default function RightSection() {
  return (
    <div className="right-section flex flex-col justify-center h-full px-6 lg:px-10 opacity-0">
      {/* Header */}
      <div className="mb-7">
        <p className="text-[#C0C8D4] text-xs font-medium tracking-widest uppercase mb-2">
          Perché sceglierci
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold text-[#E8ECF0] leading-tight">
          Perché <span className="text-[#C0C8D4]">KREA</span>?
        </h2>
        <div className="h-px w-16 bg-gradient-to-r from-[#C0C8D4] to-transparent mt-3" />
      </div>

      {/* Features list */}
      <div className="flex flex-col gap-3">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="feature-item group">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5 shrink-0">{icon}</span>
              <div>
                <h3 className="feature-text text-[#E8ECF0] font-semibold text-sm transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-[#E8ECF0]/45 text-xs leading-relaxed mt-0.5">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact card */}
      <div className="mt-7 p-4 rounded-2xl border border-[#4a5568]/30 bg-gradient-to-br from-[#C0C8D4]/5 to-transparent">
        <p className="text-[#E8ECF0]/60 text-xs mb-3">Pronto a iniziare il tuo progetto?</p>
        <a
          href="mailto:hello@krea.agency"
          className="text-[#C0C8D4] text-sm font-medium hover:underline"
        >
          hello@krea.agency →
        </a>
        <div className="flex gap-3 mt-3">
          {['Behance', 'LinkedIn', 'GitHub'].map((s) => (
            <span
              key={s}
              className="text-[#E8ECF0]/30 text-xs hover:text-[#C0C8D4] cursor-pointer transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Technology stack badges */}
      <div className="flex flex-wrap gap-2 mt-5">
        {['React', 'Three.js', 'GSAP', 'WebGL'].map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium text-[#E8ECF0]/40
                       border border-[#4a5568]/25 bg-white/[0.02] tracking-wide"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
