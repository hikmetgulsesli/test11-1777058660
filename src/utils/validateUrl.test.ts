import { describe, it, expect } from 'vitest'
import { validateUrl, isValidUrl } from './validateUrl'

describe('validateUrl', () => {
  describe('valid URLs', () => {
    it('accepts a valid https URL', () => {
      const result = validateUrl('https://www.example.com')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('accepts a valid http URL', () => {
      const result = validateUrl('http://www.example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL with path', () => {
      const result = validateUrl('https://www.example.com/路徑/頁面')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL with query parameters', () => {
      const result = validateUrl('https://example.com/search?q=test&page=1')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL with port number', () => {
      const result = validateUrl('https://example.com:8080')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL with fragment', () => {
      const result = validateUrl('https://example.com/page#section')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL with subdomain', () => {
      const result = validateUrl('https://subdomain.example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL with authentication credentials', () => {
      const result = validateUrl('https://user:pass@example.com')
      expect(result.isValid).toBe(true)
    })

    it('accepts localhost URL', () => {
      const result = validateUrl('http://localhost:3000')
      expect(result.isValid).toBe(true)
    })

    it('accepts IP address URL', () => {
      const result = validateUrl('http://192.168.1.1:5000')
      expect(result.isValid).toBe(true)
    })

    it('accepts URL with spaces encoded', () => {
      const result = validateUrl('https://example.com/path%20with%20spaces')
      expect(result.isValid).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('rejects empty string', () => {
      const result = validateUrl('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('URL boş bırakılamaz')
    })

    it('rejects whitespace-only string', () => {
      const result = validateUrl('   ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('URL boş bırakılamaz')
    })

    it('rejects null-like input', () => {
      const result = validateUrl('   \n\t  ')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('URL boş bırakılamaz')
    })

    it('rejects URL without protocol', () => {
      const result = validateUrl('www.example.com')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('URL http:// veya https:// ile başlamalıdır')
    })

    it('rejects URL with invalid protocol', () => {
      const result = validateUrl('ftp://example.com')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Sadece http:// veya https:// protokolleri kabul edilir')
    })

    it('rejects URL with file protocol', () => {
      const result = validateUrl('file:///path/to/file')
      expect(result.isValid).toBe(false)
    })

    it('rejects URL with javascript protocol', () => {
      const result = validateUrl('javascript:void(0)')
      expect(result.isValid).toBe(false)
    })

    it('rejects plain text', () => {
      const result = validateUrl('this is not a url')
      expect(result.isValid).toBe(false)
    })

    it('rejects random characters', () => {
      const result = validateUrl('!@#$%^&*()')
      expect(result.isValid).toBe(false)
    })

    it('rejects single word', () => {
      const result = validateUrl('example')
      expect(result.isValid).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('trims whitespace before validation', () => {
      const result = validateUrl('  https://example.com  ')
      expect(result.isValid).toBe(true)
    })

    it('handles unicode domain withpunycode equivalent', () => {
      const result = validateUrl('https://münchen.example.com')
      expect(result.isValid).toBe(true)
    })

    it('handles URL with plus sign in query', () => {
      const result = validateUrl('https://example.com/search?q=test+value')
      expect(result.isValid).toBe(true)
    })
  })
})

describe('isValidUrl', () => {
  it('returns true for valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })

  it('returns false for invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidUrl('')).toBe(false)
  })

  it('returns false for whitespace', () => {
    expect(isValidUrl('   ')).toBe(false)
  })
})
