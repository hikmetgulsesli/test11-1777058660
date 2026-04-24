import { Link } from 'react-router-dom'

interface HataSayfasiProps {
  code?: number
  message?: string
}

export function HataSayfasi({ code = 404, message = 'Sayfa bulunamadı' }: HataSayfasiProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1326]">
      <div className="flex flex-col items-center gap-6 text-center px-4">
        <div className="font-headline text-8xl font-bold text-primary">{code}</div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">{message}</h1>
        <p className="font-body text-on-surface-variant max-w-md">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link 
          to="/"
          className="mt-4 px-6 py-3 bg-primary text-on-primary font-body text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

export default HataSayfasi