import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="min-h-screen flex flex-col bg-surface-dim">
      <nav className="fixed top-0 w-full z-50 bg-surface">
        <div className="flex justify-between items-center h-16 px-8 max-w-full mx-auto">
          <Link to="/" className="font-label text-2xl font-bold tracking-tighter text-primary-container">
            Kısa Link
          </Link>
          <div className="hidden md:flex items-center gap-8 font-label font-medium tracking-tight">
            <Link to="/gecmis" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-3 py-2 rounded-md transition-all">Geçmiş</Link>
            <a href="#api" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-3 py-2 rounded-md transition-all">API</a>
            <a href="#fiyat" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-3 py-2 rounded-md transition-all">Fiyatlandırma</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/ayarlar" className="p-2 bg-surface-container-high rounded-full transition-all text-on-surface" aria-label="Ayarlar">
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto w-full">
        <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Ayarlar</h1>
        
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-lg font-semibold">Tema</h2>
              <p className="font-body text-sm text-on-surface-variant">Karanlık veya aydınlık mod seçin</p>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-body text-sm"
              aria-label="Tema seçin"
            >
              <option value="dark">Karanlık</option>
              <option value="light">Aydınlık</option>
              <option value="system">Sistem</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-lg font-semibold">Bildirimler</h2>
              <p className="font-body text-sm text-on-surface-variant">Bağlantı oluşturma bildirimleri</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary-container' : 'bg-surface-variant'}`}
              aria-label="Bildirimleri aç/kapat"
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-on-primary-container transition-transform ${notifications ? 'left-7' : 'left-1'}`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-lg font-semibold">Sürüm</h2>
              <p className="font-body text-sm text-on-surface-variant">Kısa Link v0.1.0</p>
            </div>
            <span className="font-mono text-sm text-on-surface-variant">v0.1.0</span>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 mt-auto border-t border-surface-container-low bg-surface">
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
