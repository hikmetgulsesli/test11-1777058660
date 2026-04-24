import { useCallback } from 'react'
import { useClipboard } from '../../hooks/useClipboard'

interface ShortLinkResultProps {
  shortCode: string
  originalUrl: string
}

export function ShortLinkResult({ shortCode, originalUrl }: ShortLinkResultProps) {
  const { copy, copied } = useClipboard()

  const handleCopy = useCallback(() => {
    copy(`kisa.link/${shortCode}`)
  }, [copy, shortCode])

  return (
    <div className="bg-surface-container-highest p-4 rounded-xl flex items-center justify-between gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/10 mt-4 backdrop-blur-md">
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Your Monolith</span>
        <a
          href={`/${shortCode}`}
          className="font-mono text-xl text-primary font-medium truncate hover:underline underline-offset-4 decoration-primary/50 cursor-pointer"
        >
          kisa.link/{shortCode}
        </a>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface px-4 py-2 rounded-lg transition-colors border border-outline-variant/20 font-body text-sm font-medium cursor-pointer"
        aria-label={copied ? 'Kopyalandı' : 'Kısa linki kopyala'}
      >
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>
          {copied ? 'check' : 'content_copy'}
        </span>
        {copied ? 'Kopyalandı' : 'Kopyala'}
      </button>
    </div>
  )
}

export default ShortLinkResult