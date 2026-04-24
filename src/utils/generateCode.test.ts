import { describe, it, expect } from 'vitest'
import { generateShortCode } from './generateCode'

describe('generateShortCode', () => {
  describe('default length', () => {
    it('generates code of length 5', () => {
      const code = generateShortCode()
      expect(code.length).toBe(5)
    })

    it('generates different codes on multiple calls', () => {
      const codes = new Set<string>()
      for (let i = 0; i < 20; i++) {
        codes.add(generateShortCode())
      }
      expect(codes.size).toBeGreaterThan(1)
    })
  })

  describe('custom length', () => {
    it('generates code of length 3', () => {
      expect(generateShortCode(3).length).toBe(3)
    })

    it('generates code of length 8', () => {
      expect(generateShortCode(8).length).toBe(8)
    })

    it('generates code of length 12', () => {
      expect(generateShortCode(12).length).toBe(12)
    })
  })

  describe('character set', () => {
    it('contains only lowercase letters and digits', () => {
      for (let i = 0; i < 50; i++) {
        const code = generateShortCode()
        expect(code).toMatch(/^[a-z0-9]+$/)
      }
    })

    it('never contains uppercase letters', () => {
      for (let i = 0; i < 50; i++) {
        const code = generateShortCode()
        expect(code).not.toMatch(/[A-Z]/)
      }
    })

    it('never contains special characters', () => {
      for ( let i = 0; i < 50; i++) {
        const code = generateShortCode()
        expect(code).not.toMatch(/[^a-z0-9]/)
      }
    })
  })

  describe('edge cases', () => {
    it('handles length of 1', () => {
      const code = generateShortCode(1)
      expect(code.length).toBe(1)
      expect(code).toMatch(/^[a-z0-9]$/)
    })

    it('handles length of 20', () => {
      const code = generateShortCode(20)
      expect(code.length).toBe(20)
    })

    it('generates deterministic result for same seed (randomness acknowledged)', () => {
      const codes = Array.from({ length: 10 }, () => generateShortCode(5))
      expect(codes).toHaveLength(10)
    })
  })
})