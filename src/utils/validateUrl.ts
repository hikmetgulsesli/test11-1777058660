export interface ValidationResult {
  isValid: boolean
  error?: string
}

const URL_ERROR_MESSAGES = {
  EMPTY: 'URL boş bırakılamaz',
  INVALID_FORMAT: 'Geçerli bir URL giriniz',
  MISSING_PROTOCOL: 'URL http:// veya https:// ile başlamalıdır',
  INVALID_PROTOCOL: 'Sadece http:// veya https:// protokolleri kabul edilir',
} as const

/**
 * Validates a URL string.
 * @param url - The URL to validate
 * @returns ValidationResult with isValid true if URL is valid, false otherwise
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return { isValid: false, error: URL_ERROR_MESSAGES.EMPTY }
  }

  const trimmedUrl = url.trim()

  try {
    const urlObject = new URL(trimmedUrl)

    if (!['http:', 'https:'].includes(urlObject.protocol)) {
      return { isValid: false, error: URL_ERROR_MESSAGES.INVALID_PROTOCOL }
    }

    if (!urlObject.hostname || urlObject.hostname.length === 0) {
      return { isValid: false, error: URL_ERROR_MESSAGES.INVALID_FORMAT }
    }

    return { isValid: true }
  } catch {
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return { isValid: false, error: URL_ERROR_MESSAGES.MISSING_PROTOCOL }
    }
    return { isValid: false, error: URL_ERROR_MESSAGES.INVALID_FORMAT }
  }
}

/**
 * Checks if a URL string is valid without returning error details.
 * @param url - The URL to check
 * @returns true if valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  return validateUrl(url).isValid
}
