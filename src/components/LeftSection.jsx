export default function LeftSection() {
  return (
    <div className="left-section flex flex-col justify-center h-full px-6 lg:px-10 opacity-0">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#4a5568]/40 bg-[#C0C8D4]/5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C0C8D4] pulse-glow" />
        <span className="text-[#C0C8D4] text-xs font-medium tracking-wider uppercase">
          Premium 3D Agency
        </span>
      </div>

      {/* Main title */}
      <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight mb-4">
        <span className="shimmer-text">KREA</span>
      </h1>

      {/* Subtitle */}
      <p className="text-[#E8ECF0]/70 text-lg lg:text-xl font-light mb-6 leading-relaxed">
        Advanced 3D Web Solutions
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-8 bg-[#C0C8D4]" />
        <div className="h-px flex-1 bg-[#4a5568]/30" />
      </div>

      {/* Description */}
      <p className="text-[#E8ECF0]/55 text-sm lg:text-base leading-relaxed max-w-xs">
        Trasformiamo le tue idee in esperienze web immersive. Specializzati in interfacce 3D
        ad alte prestazioni che catturano, coinvolgono e convertono.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[
          { val: '60+', label: 'Progetti' },
          { val: '99%', label: 'Soddisfazione' },
          { val: '3D', label: 'Specialist' },
        ].map(({ val, label }) => (
          <div key={label} className="text-center p-3 rounded-xl border border-[#4a5568]/20 bg-white/[0.02]">
            <div className="text-xl font-bold text-[#C0C8D4]">{val}</div>
            <div className="text-[10px] text-[#E8ECF0]/40 uppercase tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-3 mt-8">
        <button
          className="px-5 py-2.5 rounded-xl bg-[#C0C8D4] text-[#0a0a0f] text-sm font-semibold
                     hover:bg-[#C0C8D4]/90 hover:shadow-[0_0_24px_rgba(192,200,212,0.4)]
                     transition-all duration-300 active:scale-95"
        >
          Inizia ora
        </button>
        <button
          className="px-5 py-2.5 rounded-xl border border-[#4a5568]/50 text-[#E8ECF0]/70 text-sm
                     hover:border-[#C0C8D4]/50 hover:text-[#C0C8D4] transition-all duration-300"
        >
          Portfolio →
        </button>
      </div>
    </div>
  )
}
