import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShortLink, copyToClipboard } from '../types'

interface HomePageProps {
  links: ShortLink[]
  currentShortLink: ShortLink | null
  onCreateLink: (url: string) => void
  onDeleteLink: (id: string) => void
  onClearAll: () => void
  onCopyLink: (text: string) => Promise<void>
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Az Önce'
  if (diffMins < 60) return `${diffMins} Dk Önce`
  if (diffHours < 24) return `${diffHours} Saat Önce`
  if (diffDays === 1) return 'Dün'
  return `${diffDays} Gün Önce`
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  setTimeout(onClose, 2500)
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-high text-on-surface px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-fade-up">
      <span className="material-symbols-outlined text-sm">check_circle</span>
      <span className="font-body text-sm">{message}</span>
    </div>
  )
}

export default function HomePage({ links, currentShortLink, onCreateLink, onDeleteLink, onClearAll, onCopyLink }: HomePageProps) {
  const [urlInput, setUrlInput] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return

    let url = urlInput.trim()
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    try {
      new URL(url)
    } catch {
      setToastMessage('Geçersiz URL biçimi')
      setTimeout(() => setToastMessage(null), 2500)
      return
    }

    onCreateLink(url)
    setShowResult(true)
    setUrlInput('')
  }

  const handleCopy = async (shortCode: string, id: string) => {
    await onCopyLink(`kisa.link/${shortCode}`)
    setCopiedId(id)
    setToastMessage('Panoya kopyalandı')
    setTimeout(() => {
      setCopiedId(null)
      setToastMessage(null)
    }, 2000)
  }

  const handleDelete = (id: string) => {
    onDeleteLink(id)
    setToastMessage('Bağlantı silindi')
    setTimeout(() => setToastMessage(null), 2500)
  }

  const handleClearAll = () => {
    onClearAll()
    setShowClearConfirm(false)
    setToastMessage('Geçmiş temizlendi')
    setTimeout(() => setToastMessage(null), 2500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-dim">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface">
        <div className="flex justify-between items-center h-16 px-8 max-w-full mx-auto">
          <Link to="/" className="font-label text-2xl font-bold tracking-tighter text-primary-container">
            Kısa Link
          </Link>
          <div className="hidden md:flex items-center gap-8 font-label font-medium tracking-tight">
            <Link to="/gecmis" className="text-primary border-b-2 border-primary pb-1">Geçmiş</Link>
            <a href="#api" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-3 py-2 rounded-md transition-all">API</a>
            <a href="#fiyat" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-3 py-2 rounded-md transition-all">Fiyatlandırma</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-primary font-label font-medium hover:bg-surface-container-high px-4 py-2 rounded-md transition-all">
              Giriş Yap
            </button>
            <div className="flex items-center gap-2">
              <Link to="/ayarlar" className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant hover:text-on-surface" aria-label="Ayarlar">
                <span className="material-symbols-outlined">settings</span>
              </Link>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant hover:text-on-surface" aria-label="Hesap">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col gap-16">
        {/* Hero Input Section */}
        <section className="flex flex-col items-center justify-center mt-12 mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/10 to-transparent blur-3xl z-0 rounded-full w-3/4 mx-auto h-64 -top-10"></div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-center mb-4 z-10">
            The Void Awaits Your URL.
          </h1>
          <p className="font-body text-on-surface-variant text-lg mb-12 text-center max-w-2xl z-10">
            Kısa Link transforms expansive web addresses into sharp, monolithic endpoints.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-3xl z-10 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 relative">
              <div className="flex-grow relative group">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Uzun URL'nizi yapıştırın..."
                  className="w-full bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 placeholder:font-body font-mono text-lg px-6 py-4 rounded-xl border-none focus:ring-0 outline-none transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  aria-label="URL girin"
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-outline-variant/15 group-focus-within:ring-primary-container/50 transition-colors"></div>
              </div>
              <button
                type="submit"
                className="bg-primary-container text-on-primary-container font-headline font-semibold px-8 py-4 rounded-xl hover:bg-on-primary-fixed-variant hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
              >
                Kısalt
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Result Card */}
          {showResult && currentShortLink && (
            <div className="bg-surface-container-highest p-4 rounded-xl flex items-center justify-between gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/10 mt-4 backdrop-blur-md animate-fade-up">
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Your Monolith</span>
                <a className="font-mono text-xl text-primary font-medium truncate hover:underline underline-offset-4 decoration-primary/50" href={`https://kisa.link/${currentShortLink.shortCode}`}>
                  kisa.link/{currentShortLink.shortCode}
                </a>
              </div>
              <button
                onClick={() => handleCopy(currentShortLink.shortCode, currentShortLink.id)}
                className="flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface px-4 py-2 rounded-lg transition-colors border border-outline-variant/20 font-body text-sm font-medium"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                {copiedId === currentShortLink.id ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>
          )}
        </section>

        {/* History Section */}
        <section className="bg-surface-container-low rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden border border-outline-variant/5">
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] rounded-2xl"></div>
          <div className="flex justify-between items-end mb-2 relative z-10">
            <div className="flex flex-col gap-1">
              <h2 className="font-headline text-2xl font-bold tracking-tight">Geçmiş</h2>
              <p className="font-label text-sm text-on-surface-variant">Recent monolithic creations.</p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-error/80 hover:text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors font-body text-sm font-medium flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Tümünü Temizle
            </button>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            {links.map((link) => (
              <div key={link.id} className="bg-surface-container-lowest p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-surface-container-high transition-colors">
                <div className="flex flex-col gap-2 min-w-0 flex-grow">
                  <div className="flex items-center gap-3">
                    <a href={`https://kisa.link/${link.shortCode}`} className="font-mono text-lg text-on-surface truncate group-hover:text-primary transition-colors">
                      kisa.link/{link.shortCode}
                    </a>
                    <span className="font-label text-xs bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full">Aktif</span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant truncate">{link.originalUrl}</p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full mt-2 md:mt-0">
                  <span className="font-label text-sm text-on-surface-variant/70">{formatTimeAgo(link.createdAt)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(link.shortCode, link.id)}
                      className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg hover:bg-surface-variant transition-colors"
                      title="Kopyala"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-on-surface-variant hover:text-error p-2 rounded-lg hover:bg-error/10 transition-colors"
                      title="Sil"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {links.length === 0 && (
            <div className="text-center py-8 text-on-surface-variant font-body">
              Henüz kısaltılmış bağlantı yok.
            </div>
          )}

          <div className="flex justify-center mt-4 relative z-10">
            <Link to="/gecmis" className="text-primary hover:text-primary-container font-label text-sm font-medium hover:underline underline-offset-4 transition-all">
              Daha Fazla Göster
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
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

      {/* Clear Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-high rounded-2xl p-6 max-w-sm w-full shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="clear-title">
            <h3 id="clear-title" className="font-headline text-xl font-bold mb-4">Geçmişi Temizle</h3>
            <p className="font-body text-on-surface-variant mb-6">Tüm kısaltılmış bağlantılar silinecek. Bu işlem geri alınamaz.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg font-body text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg font-body text-sm font-medium bg-error text-on-error hover:bg-error-container transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  )
}
