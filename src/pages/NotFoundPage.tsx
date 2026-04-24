import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-dim items-center justify-center">
      <nav className="fixed top-0 w-full z-50 bg-surface">
        <div className="flex justify-between items-center h-16 px-8 max-w-full mx-auto">
          <Link to="/" className="font-label text-2xl font-bold tracking-tighter text-primary-container">
            Kısa Link
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-headline text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-headline text-2xl font-semibold text-on-surface mb-2">Sayfa Bulunamadı</h2>
          <p className="font-body text-on-surface-variant mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container font-headline font-semibold px-6 py-3 rounded-xl hover:bg-on-primary-fixed-variant transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>

      <footer className="w-full py-12 border-t border-surface-container-low bg-surface">
        <div className="flex flex-col items-center gap-6 max-w-7xl mx-auto px-4">
          <div className="flex gap-6 font-label text-sm tracking-wide">
            <a href="#gizlilik" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Gizlilik Politikası</a>
            <a href="#kullanim" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Kullanım Koşulları</a>
            <a href="#iletisim" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">İletişim</a>
          </div>
          <p className="text-on-surface-variant font-label text-sm tracking-wide">
            © 2024 Kısa Link - Monolith &amp; Void Edition
          </p>
        </div>
      </footer>
    </div>
  )
}
