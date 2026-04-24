import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLinkHistory } from '../hooks/useLinkHistory'

interface YonlendirmeEkraniProps {
  onRedirect?: (shortCode: string) => void
}

export function YonlendirmeEkrani({ onRedirect }: YonlendirmeEkraniProps) {
  const { shortCode } = useParams<{ shortCode: string }>()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [targetUrl, setTargetUrl] = useState<string>('Yükleniyor...')
  const navigate = useNavigate()
  const { history } = useLinkHistory()

  const performRedirect = useCallback(() => {
    if (!shortCode) {
      setStatus('error')
      return
    }

    // Look up the short code in history
    const entry = history.find(h => h.shortCode === shortCode)
    if (entry) {
      setTargetUrl(entry.originalUrl)
      // Redirect after a short delay
      const timer = setTimeout(() => {
        setStatus('success')
        if (onRedirect) onRedirect(shortCode)
        window.location.href = entry.originalUrl
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      // Short code not found - navigate to error page
      const timer = setTimeout(() => {
        navigate(`/${shortCode}`, { replace: true })
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [shortCode, history, onRedirect, navigate])

  useEffect(() => {
    setStatus('loading')
    setTargetUrl('Yükleniyor...')
    const cleanup = performRedirect()
    return cleanup
  }, [performRedirect])

  return (
    <div className="min-h-screen flex flex-col bg-surface-dim">
      {/* Ambient void glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container opacity-5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <div className="flex flex-col items-center max-w-md w-full">
          {/* Connection visual */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {/* Source */}
            <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center shadow-2xl relative">
              <span className="material-symbols-outlined text-primary text-2xl">link</span>
              {/* Active indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-container shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            </div>

            {/* Path/progress */}
            <div className="flex flex-col items-center justify-center gap-2 w-24">
              <span className="font-label text-xs tracking-wider text-on-surface-variant uppercase">Bağlanıyor</span>
              <div className="flex justify-between w-full">
                <div className="w-2 h-[2px] rounded-full bg-primary-container shadow-[0_0_4px_rgba(37,99,235,0.6)]" />
                <div className="w-2 h-[2px] rounded-full bg-primary-container shadow-[0_0_4px_rgba(37,99,235,0.6)]" />
                <div className="w-2 h-[2px] rounded-full bg-primary-container shadow-[0_0_4px_rgba(37,99,235,0.6)]" />
                <div className="w-2 h-[2px] rounded-full bg-surface-variant" />
                <div className="w-2 h-[2px] rounded-full bg-surface-variant" />
                <div className="w-2 h-[2px] rounded-full bg-surface-variant" />
              </div>
            </div>

            {/* Destination */}
            <div className="w-16 h-16 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] border border-surface-container-low">
              <span className="material-symbols-outlined text-outline text-2xl" style={{ fontVariationSettings: "'wght' 200" }}>public</span>
            </div>
          </div>

          {/* Typography content */}
          <div className="text-center space-y-4 w-full">
            <h1 className="text-2xl md:text-3xl font-headline font-semibold tracking-tight text-on-surface">
              Orijinal adrese yönlendiriliyorsunuz...
            </h1>
            <div className="pt-4 flex flex-col items-center gap-2">
              <span className="font-label text-sm text-on-surface-variant">Hedef:</span>
              <div className="px-4 py-2 bg-surface-container-low rounded-lg inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-outline-variant text-sm">lock</span>
                <span className="font-mono text-primary text-sm tracking-wide">{targetUrl}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center text-center px-4">
        <span className="font-label text-xs tracking-wider text-outline-variant">Kısa Link Güvenli Yönlendirme Servisi</span>
      </div>
    </div>
  )
}

export default YonlendirmeEkrani
