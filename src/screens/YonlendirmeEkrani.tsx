import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface YonlendirmeEkraniProps {
  onRedirect?: (shortCode: string) => void
}

export function YonlendirmeEkrani({ onRedirect }: YonlendirmeEkraniProps) {
  const { shortCode } = useParams<{ shortCode: string }>()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (shortCode) {
      // Simulate redirect lookup
      const timer = setTimeout(() => {
        setStatus('success')
        if (onRedirect) onRedirect(shortCode)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [shortCode, onRedirect])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1326]">
      <div className="flex flex-col items-center gap-6">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-body text-on-surface-variant">Yönlendiriliyor...</p>
          </>
        )}
        {status === 'success' && (
          <p className="font-body text-on-surface">Yönlendirme başarılı!</p>
        )}
        {status === 'error' && (
          <p className="font-body text-error">Yönlendirme başarısız.</p>
        )}
      </div>
    </div>
  )
}

export default YonlendirmeEkrani