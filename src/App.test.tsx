import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { ShortLink, copyToClipboard, generateShortCode } from './types'

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

describe('App', () => {
  it('renders home page with URL input', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Uzun URL\'nizi yapıştırın...')
    expect(input).toBeTruthy()
  })

  it('renders navigation with logo', () => {
    render(<App />)
    const logo = screen.getByText('Kısa Link')
    expect(logo).toBeTruthy()
  })

  it('renders history section heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: 'Geçmiş' })
    expect(heading).toBeTruthy()
  })
})

describe('ShortLink type', () => {
  it('has required properties', () => {
    const link: ShortLink = {
      id: '1',
      shortCode: 'abc',
      originalUrl: 'https://test.com',
      createdAt: new Date(),
      clickCount: 0
    }
    expect(link.id).toBe('1')
    expect(link.shortCode).toBe('abc')
    expect(link.originalUrl).toBe('https://test.com')
  })
})

describe('copyToClipboard', () => {
  it('calls navigator.clipboard.writeText', async () => {
    const testText = 'kisa.link/test'
    await copyToClipboard(testText)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText)
  })
})

describe('generateShortCode', () => {
  it('generates code of default length 5', () => {
    const code = generateShortCode()
    expect(code.length).toBe(5)
  })

  it('generates code of specified length', () => {
    const code = generateShortCode(8)
    expect(code.length).toBe(8)
  })

  it('contains only alphanumeric characters', () => {
    const code = generateShortCode()
    expect(code).toMatch(/^[a-z0-9]+$/)
  })
})
