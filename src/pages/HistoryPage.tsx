import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShortLink } from '../types'

interface HistoryPageProps {
  links: ShortLink[]
  onDeleteLink: (id: string) => void
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

export default function HistoryPage({ links, onDeleteLink, onCopyLink }: HistoryPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (shortCode: string, id: string) => {
    await onCopyLink(`kisa.link/${shortCode}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-dim">
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
            <Link to="/ayarlar" className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant hover:text-on-surface" aria-label="Ayarlar">
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-surface-container-low rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline text-2xl font-bold tracking-tight">Geçmiş</h1>
            <p className="font-label text-sm text-on-surface-variant">Tüm kısaltılmış bağlantılarınız</p>
          </div>

          <div className="flex flex-col gap-4">
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
                      onClick={() => onDeleteLink(link.id)}
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
