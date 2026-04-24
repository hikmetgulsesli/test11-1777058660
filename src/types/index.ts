export interface ShortLink {
  id: string
  shortCode: string
  originalUrl: string
  createdAt: Date
  clickCount: number
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function generateShortCode(length: number = 5): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export type ValidationResult = {
  valid: boolean
  error?: string
}

export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL boş olamaz' }
  }

  const trimmed = url.trim()
  let hasProtocol = false

  // Only accept http:// and https:// protocols
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    hasProtocol = true
  } else if (trimmed.includes('://')) {
    // Has a protocol but it's not http or https (e.g., ftp://, ws://)
    return { valid: false, error: 'Geçerli bir URL giriniz (örn: https://example.com)' }
  }

  // Try URL constructor
  try {
    const testUrl = hasProtocol ? trimmed : 'https://' + trimmed
    const parsed = new URL(testUrl)

    // Must have valid hostname
    if (!parsed.hostname || parsed.hostname.length < 2) {
      return { valid: false, error: 'Geçerli bir alan adı giriniz' }
    }

    // Basic hostname validation - must contain at least one dot for TLD
    if (!parsed.hostname.includes('.')) {
      return { valid: false, error: 'Geçerli bir alan adı giriniz' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Geçerli bir URL giriniz (örn: https://example.com)' }
  }
}
