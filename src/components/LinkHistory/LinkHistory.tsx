import { useCallback } from 'react'
import type { LinkHistoryEntry } from '../../hooks/useLinkHistory'

interface LinkHistoryProps {
  history: LinkHistoryEntry[]
  onDelete?: (id: string) => void
  onClearAll?: () => void
  onCopy?: (text: string) => void
  maxItems?: number
}

function getRelativeTime(date: Date): string {
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

export function LinkHistory({ history, onDelete, onClearAll, onCopy, maxItems }: LinkHistoryProps) {
  const items = maxItems ? history.slice(0, maxItems) : history

  const handleCopy = useCallback((shortCode: string) => {
    if (onCopy) {
      onCopy(`kisa.link/${shortCode}`)
    } else {
      navigator.clipboard.writeText(`kisa.link/${shortCode}`)
    }
  }, [onCopy])

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-4 relative z-10">
        <p className="text-on-surface-variant text-center py-8">Henüz hiç kısa link oluşturmadınız.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 relative z-10">
      {items.map((link, index) => (
        <div 
          key={link.id} 
          className="bg-surface-container-lowest p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-surface-container-high transition-colors"
        >
          <div className="flex flex-col gap-2 min-w-0 flex-grow">
            <div className="flex items-center gap-3">
              <a 
                href={`/${link.shortCode}`}
                className="font-mono text-lg text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer"
              >
                kisa.link/{link.shortCode}
              </a>
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
                onClick={() => handleCopy(link.shortCode)}
                className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer"
                title="Kopyala"
                aria-label="Kısa linki kopyala"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(link.id)}
                  className="text-on-surface-variant hover:text-error p-2 rounded-lg hover:bg-error/10 transition-colors cursor-pointer"
                  title="Sil"
                  aria-label="Linki sil"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LinkHistory