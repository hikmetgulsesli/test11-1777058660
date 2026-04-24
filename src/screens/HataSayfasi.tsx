import { Link } from 'react-router-dom'

interface HataSayfasiProps {
  code?: number
  message?: string
}

export function HataSayfasi({ code = 404, message = 'Bu kısa link artık mevcut değil' }: HataSayfasiProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-dim relative overflow-hidden antialiased">
      {/* Ambient void glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-low/60 via-surface-dim to-surface-dim z-0 pointer-events-none" />

      <main className="z-10 flex flex-col items-center text-center max-w-2xl px-6 w-full">
        {/* Error icon container with tonal layering */}
        <div className="mb-10 relative group cursor-default">
          {/* Subtle error glow */}
          <div className="absolute inset-0 bg-error/10 blur-[40px] rounded-full scale-[2] transition-opacity duration-700 opacity-70 group-hover:opacity-100" />
          <div className="bg-surface-container-highest w-28 h-28 rounded-full flex items-center justify-center relative z-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
            <span className="material-symbols-outlined text-5xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>link_off</span>
          </div>
        </div>

        {/* 404 data mark */}
        <div className="font-mono text-8xl md:text-9xl font-bold text-surface-container-highest/80 tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] -z-10 select-none pointer-events-none">
          {code}
        </div>

        {/* Typography */}
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-on-surface mb-4">
          {message}
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant font-body mb-12 max-w-md mx-auto leading-relaxed">
          Girdiğiniz bağlantı silinmiş veya süresi dolmuş olabilir.
        </p>

        {/* Primary action */}
        <Link 
          to="/" 
          className="bg-primary-container text-on-primary-container font-label text-base font-medium px-8 py-3.5 rounded-lg hover:bg-inverse-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 shadow-[0_10px_30px_rgba(37,99,235,0.15)] ring-1 ring-white/10"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Ana Sayfaya Dön
        </Link>
      </main>
    </div>
  )
}

export default HataSayfasi
