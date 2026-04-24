import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLinkHistory } from './useLinkHistory'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useLinkHistory', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty history', () => {
      const { result } = renderHook(() => useLinkHistory())
      expect(result.current.history).toEqual([])
    })
  })

  describe('addLink', () => {
    it('adds a new link to history', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com')
      })
      expect(result.current.history).toHaveLength(1)
      expect(result.current.history[0].originalUrl).toBe('https://example.com')
    })

    it('adds link at the beginning of history', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://first.com')
      })
      act(() => {
        result.current.addLink('https://second.com')
      })
      expect(result.current.history[0].originalUrl).toBe('https://second.com')
      expect(result.current.history[1].originalUrl).toBe('https://first.com')
    })

    it('uses provided shortCode when given', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com', 'custom')
      })
      expect(result.current.history[0].shortCode).toBe('custom')
    })

    it('generates random shortCode when not provided', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com')
      })
      expect(result.current.history[0].shortCode).toHaveLength(5)
    })

    it('sets createdAt to current date', () => {
      const before = new Date()
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com')
      })
      const after = new Date()
      const entry = result.current.history[0]
      expect(entry.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(entry.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('initializes clickCount to 0', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com')
      })
      expect(result.current.history[0].clickCount).toBe(0)
    })

    it('generates unique ids for each entry', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://first.com')
      })
      act(() => {
        result.current.addLink('https://second.com')
      })
      expect(result.current.history[0].id).not.toBe(result.current.history[1].id)
    })
  })

  describe('removeLink', () => {
    it('removes a link by id', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com')
      })
      const id = result.current.history[0].id
      act(() => {
        result.current.removeLink(id)
      })
      expect(result.current.history).toHaveLength(0)
    })

    it('does not affect other links when one is removed', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://first.com')
      })
      act(() => {
        result.current.addLink('https://second.com')
      })
      const firstId = result.current.history[1].id
      act(() => {
        result.current.removeLink(firstId)
      })
      expect(result.current.history).toHaveLength(1)
      expect(result.current.history[0].originalUrl).toBe('https://second.com')
    })
  })

  describe('clearHistory', () => {
    it('removes all links', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://first.com')
      })
      act(() => {
        result.current.addLink('https://second.com')
      })
      act(() => {
        result.current.clearHistory()
      })
      expect(result.current.history).toHaveLength(0)
    })
  })

  describe('getLink', () => {
    it('returns the link with given id', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com')
      })
      const id = result.current.history[0].id
      const link = result.current.getLink(id)
      expect(link?.originalUrl).toBe('https://example.com')
    })

    it('returns undefined for non-existent id', () => {
      const { result } = renderHook(() => useLinkHistory())
      const link = result.current.getLink('non-existent')
      expect(link).toBeUndefined()
    })
  })

  describe('getLinkByShortCode', () => {
    it('returns the link with given shortCode', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com', 'test12')
      })
      const link = result.current.getLinkByShortCode('test12')
      expect(link?.originalUrl).toBe('https://example.com')
    })

    it('returns undefined for non-existent shortCode', () => {
      const { result } = renderHook(() => useLinkHistory())
      const link = result.current.getLinkByShortCode('none')
      expect(link).toBeUndefined()
    })
  })

  describe('persistence', () => {
    it('stores history in localStorage', () => {
      const { result } = renderHook(() => useLinkHistory())
      act(() => {
        result.current.addLink('https://example.com')
      })
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'link-history',
        expect.any(String)
      )
    })
  })
})