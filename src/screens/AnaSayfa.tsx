import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UrlInput } from '../components/UrlInput/UrlInput'
import { ShortLinkResult } from '../components/ShortLinkResult/ShortLinkResult'
import { generateShortCode } from '../utils/generateCode'
import type { ShortLink } from '../types'

interface LinkHistoryItem {
  shortCode: string
  originalUrl: string
  createdAt: Date
}

interface AnaSayfaProps {
  links: ShortLink[]
  currentShortLink: ShortLink | null
  onCreateLink: (url: string) => void
  onDeleteLink: (id: string) => void
  onClearAll: () => void
  onCopyLink: (text: string) => Promise<void>
}

export function AnaSayfa({ links, currentShortLink, onCreateLink }: AnaSayfaProps) {
  const [recentLinks] = useState<LinkHistoryItem[]>(() => {
    return links.slice(0, 5).map(link => ({
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      createdAt: link.createdAt,
    }))
  })

  const handleSubmit = useCallback((url: string) => {
    onCreateLink(url)
  }, [onCreateLink])

  const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Şimdi'
    if (diffMins < 60) return `${diffMins} Dk Önce`
    if (diffHours < 24) return `${diffHours} Saat Önce`
    return `${diffDays} Gün Önce`
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b1326] shadow-none">
        <div className="bg-[#131b2e] absolute inset-0 z-[-1] opacity-0" />
        <div className="flex justify-between items-center h-16 px-8 max-w-full mx-auto">
          <Link to="/" className="font-['Space_Grotesk'] text-2xl font-bold tracking-tighter text-[#2563eb] cursor-pointer">
            Kısa Link
          </Link>
          <div className="hidden md:flex items-center gap-8 font-['Inter'] font-medium tracking-tight">
            <Link to="/gecmis" className="text-[#2563eb] border-b-2 border-[#2563eb] pb-1 cursor-pointer">Geçmiş</Link>
            <Link to="/api" className="text-[#434655] hover:text-[#eeefff] hover:bg-[#222a3d] hover:scale-[1.02] transition-all duration-200 px-3 py-2 rounded-md active:scale-[0.98] cursor-pointer">API</Link>
            <Link to="/fiyatlandirma" className="text-[#434655] hover:text-[#eeefff] hover:bg-[#222a3d] hover:scale-[1.02] transition-all duration-200 px-3 py-2 rounded-md active:scale-[0.98] cursor-pointer">Fiyatlandırma</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-[#2563eb] font-['Inter'] font-medium tracking-tight hover:bg-[#222a3d] px-4 py-2 rounded-md transition-all duration-200 active:scale-[0.98] cursor-pointer">
              Giriş Yap
            </button>
            <div className="flex items-center gap-2 text-[#434655]">
              <Link to="/ayarlar" className="p-2 hover:bg-[#222a3d] rounded-full transition-all duration-200 hover:text-[#eeefff] cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
              </Link>
              <Link to="/profil" className="p-2 hover:bg-[#222a3d] rounded-full transition-all duration-200 hover:text-[#eeefff] cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col gap-16">
        {/* Hero Input Section */}
        <section className="flex flex-col items-center justify-center mt-12 mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/10 to-transparent blur-3xl z-0 rounded-full w-3/4 mx-auto h-64 -top-10" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-center mb-4 z-10">
            The Void Awaits Your URL.
          </h1>
          <p className="font-body text-on-surface-variant text-lg mb-12 text-center max-w-2xl z-10">
            Kısa Link transforms expansive web addresses into sharp, monolithic endpoints.
          </p>
          <div className="w-full max-w-3xl z-10 flex flex-col gap-4">
            <UrlInput onSubmit={handleSubmit} />
            {currentShortLink && (
              <ShortLinkResult
                shortCode={currentShortLink.shortCode}
                originalUrl={currentShortLink.originalUrl}
              />
            )}
          </div>
        </section>

        {/* History Section */}
        <section className="bg-surface-container-low rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden border border-outline-variant/5">
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] rounded-2xl" />
          <div className="flex justify-between items-end mb-2 relative z-10">
            <div className="flex flex-col gap-1">
              <h2 className="font-headline text-2xl font-bold tracking-tight">Geçmiş</h2>
              <p className="font-label text-sm text-on-surface-variant">Recent monolithic creations.</p>
            </div>
            {links.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Tüm geçmişi silmek istediğinize emin misiniz?')) {
                    // TODO: implement clear all
                  }
                }}
                className="text-error/80 hover:text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors font-body text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>delete_sweep</span>
                Tümünü Temizle
              </button>
            )}
          </div>
          <div className="flex flex-col gap-4 relative z-10">
            {recentLinks.length === 0 ? (
              <p className="text-on-surface-variant text-center py-8">Henüz hiç kısa link oluşturmadınız.</p>
            ) : (
              recentLinks.map((link, index) => (
                <div key={index} className="bg-surface-container-lowest p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-surface-container-high transition-colors">
                  <div className="flex flex-col gap-2 min-w-0 flex-grow">
                    <div className="flex items-center gap-3">
                      <Link to={`/${link.shortCode}`} className="font-mono text-lg text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer">
                        kisa.link/{link.shortCode}
                      </Link>
                      {index === 0 && (
                        <span className="font-label text-xs bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                    <p className="font-body text-sm text-on-surface-variant truncate">{link.originalUrl}</p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full mt-2 md:mt-0">
                    <span className="font-label text-sm text-on-surface-variant/70">{getRelativeTime(link.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(`kisa.link/${link.shortCode}`)}
                        className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer"
                        title="Kopyala"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
                      </button>
                      <button
                        onClick={() => {
                          const linkItem = links.find(l => l.shortCode === link.shortCode)
                          if (linkItem) onDeleteLink(linkItem.id)
                        }}
                        className="text-on-surface-variant hover:text-error p-2 rounded-lg hover:bg-error/10 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {links.length > 5 && (
            <div className="flex justify-center mt-4 relative z-10">
              <Link to="/gecmis" className="text-primary hover:text-primary-container font-label text-sm font-medium hover:underline underline-offset-4 transition-all cursor-pointer">
                Daha Fazla Göster
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-auto border-t border-[#131b2e] bg-[#0b1326]">
        <div className="flex flex-col items-center gap-6 max-w-7xl mx-auto px-4">
          <div className="flex gap-6 font-['Space_Grotesk'] text-sm tracking-wide">
            <Link to="/gizlilik" className="text-[#434655] hover:text-[#2563eb] transition-colors cursor-pointer">Gizlilik Politikası</Link>
            <Link to="/kullanim-kosullari" className="text-[#434655] hover:text-[#2563eb] transition-colors cursor-pointer">Kullanım Koşulları</Link>
            <Link to="/iletisim" className="text-[#434655] hover:text-[#2563eb] transition-colors cursor-pointer">İletişim</Link>
          </div>
          <p className="text-[#434655] font-body text-sm">© 2026 Kısa Link. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}

export default AnaSayfa