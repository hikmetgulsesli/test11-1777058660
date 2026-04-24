import { useState, useCallback } from 'react'

export interface UseClipboardOptions {
  timeout?: number
}

export interface UseClipboardReturn {
  copy: (text: string) => Promise<void>
  copied: boolean
  error: Error | null
}

/**
 * A React hook for copying text to the clipboard.
 * @param options - Optional configuration (e.g., timeout for copied state reset)
 * @returns copy function, copied state, and error state
 */
export function useClipboard(options?: UseClipboardOptions): UseClipboardReturn {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const copy = useCallback(async (text: string) => {
    setError(null)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      const timeout = options?.timeout ?? 2000
      setTimeout(() => setCopied(false), timeout)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Kopyalama başarısız oldu')
      setError(error)
      setCopied(false)
    }
  }, [options?.timeout])

  return { copy, copied, error }
}