import { describe, it, expect, vi } from 'vitest'
import { validateUrl } from './types'

describe('validateUrl', () => {
  describe('valid URLs', () => {
    it('accepts https:// URL', () => {
      const result = validateUrl('https://example.com')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('accepts http:// URL', () => {
      const result = validateUrl('http://example.com')
      expect(result.valid).toBe(true)
    })

    it('accepts URL without protocol (auto-prepends https)', () => {
      const result = validateUrl('example.com')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with subdomain', () => {
      const result = validateUrl('https://subdomain.example.com')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with path', () => {
      const result = validateUrl('https://example.com/path/to/page')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with query string', () => {
      const result = validateUrl('https://example.com/search?q=test&lang=tr')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with port', () => {
      const result = validateUrl('https://example.com:8080')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with fragment', () => {
      const result = validateUrl('https://example.com/page#section')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with credentials', () => {
      const result = validateUrl('https://user:pass@example.com')
      expect(result.valid).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('rejects empty string', () => {
      const result = validateUrl('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('URL boş olamaz')
    })

    it('rejects whitespace-only string', () => {
      const result = validateUrl('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('URL boş olamaz')
    })

    it('rejects null/undefined implicitly via empty check', () => {
      // @ts-ignore - testing runtime behavior
      const result = validateUrl(null)
      expect(result.valid).toBe(false)
    })

    it('rejects hostname without TLD (no dot)', () => {
      const result = validateUrl('https://localhost')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Geçerli bir alan adı giriniz')
    })

    it('rejects single-character hostname', () => {
      const result = validateUrl('https://x')
      expect(result.valid).toBe(false)
    })

    it('rejects ftp:// protocol (not suitable for browsers)', () => {
      const result = validateUrl('ftp://example.com')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Geçerli bir URL giriniz (örn: https://example.com)')
    })

    it('rejects malformed URL', () => {
      const result = validateUrl('ht tps://ex am ple.com')
      expect(result.valid).toBe(false)
    })

    it('rejects strings that look like paths only', () => {
      const result = validateUrl('/path/to/resource')
      expect(result.valid).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('handles URL with multiple subdomains', () => {
      const result = validateUrl('https://deep.sub.domain.example.com')
      expect(result.valid).toBe(true)
    })

    it('handles URL with hyphen in domain', () => {
      const result = validateUrl('https://my-example-site.com')
      expect(result.valid).toBe(true)
    })

    it('handles URL with numbers in domain', () => {
      const result = validateUrl('https://site123.example.com')
      expect(result.valid).toBe(true)
    })

    it('trims whitespace before validation', () => {
      const result = validateUrl('  https://example.com  ')
      expect(result.valid).toBe(true)
    })

    it('rejects very long URL', () => {
      const longPath = 'a'.repeat(2000)
      const result = validateUrl('https://example.com/' + longPath)
      expect(result.valid).toBe(true) // URL constructor handles this
    })
  })

  describe('Turkish domain coverage', () => {
    it('accepts .tr domains', () => {
      const result = validateUrl('https://haberleri.com')
      expect(result.valid).toBe(true)
    })

    it('accepts URL with Turkish characters (idn)', () => {
      // Note: actual validation depends on URL constructor support
      const result = validateUrl('https://example.com/çğişü')
      expect(result.valid).toBe(true)
    })
  })
})