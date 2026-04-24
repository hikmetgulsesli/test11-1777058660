import { useState, useCallback } from 'react'
import { validateUrl } from '../../utils/validateUrl'

interface UrlInputProps {
  onSubmit: (url: string) => void
  disabled?: boolean
}

export function UrlInput({ onSubmit, disabled = false }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('URL boş bırakılamaz')
      return
    }

    const validation = validateUrl(trimmedUrl)
    if (!validation.isValid) {
      setError(validation.error ?? 'Geçerli bir URL giriniz')
      return
    }

    onSubmit(trimmedUrl)
  }, [url, onSubmit])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (error) setError(null)
  }, [error])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 relative">
      <div className="flex-grow relative group">
        <input
          type="url"
          value={url}
          onChange={handleChange}
          placeholder="Uzun URL'nizi yapıştırın..."
          disabled={disabled}
          className="w-full bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 placeholder:font-body font-mono text-lg px-6 py-4 rounded-xl border-none focus:ring-0 outline-none transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50"
        />
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-outline-variant/15 group-focus-within:ring-primary-container/50 transition-colors" />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="bg-primary-container text-on-primary-container font-headline font-semibold px-8 py-4 rounded-xl hover:bg-on-primary-fixed-variant hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Kısalt
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
      </button>
      {error && (
        <p role="alert" className="text-error text-sm font-body absolute -bottom-6 left-0">
          {error}
        </p>
      )}
    </form>
  )
}

export default UrlInput