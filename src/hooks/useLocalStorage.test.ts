import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

const TEST_KEY = 'test-local-storage-key'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  describe('initialization', () => {
    it('returns initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'varsayılan'))
      expect(result.current[0]).toBe('varsayılan')
    })

    it('reads existing value from localStorage', () => {
      localStorageMock.setItem(TEST_KEY, JSON.stringify('kayıtlı-değer'))
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'varsayılan'))
      expect(result.current[0]).toBe('kayıtlı-değer')
    })

    it('parses JSON objects correctly', () => {
      const testObj = { name: 'Elif Yılmaz', age: 28 }
      localStorageMock.setItem(TEST_KEY, JSON.stringify(testObj))
      const { result } = renderHook(() => useLocalStorage<typeof testObj>(TEST_KEY, {}))
      expect(result.current[0]).toEqual(testObj)
    })

    it('parses JSON arrays correctly', () => {
      const testArray = [1, 2, 3, 'dört', 'beş']
      localStorageMock.setItem(TEST_KEY, JSON.stringify(testArray))
      const { result } = renderHook(() => useLocalStorage<typeof testArray>(TEST_KEY, []))
      expect(result.current[0]).toEqual(testArray)
    })

    it('handles invalid JSON in localStorage gracefully', () => {
      localStorageMock.setItem(TEST_KEY, 'geçersiz-json{')
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'fallback'))
      expect(result.current[0]).toBe('fallback')
    })

    it('returns initial value for number type', () => {
      const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 42))
      expect(result.current[0]).toBe(42)
    })

    it('returns initial value for boolean type', () => {
      const { result } = renderHook(() => useLocalStorage<boolean>(TEST_KEY, false))
      expect(result.current[0]).toBe(false)
    })
  })

  describe('setValue', () => {
    it('updates state and localStorage with string value', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'başlangıç'))
      act(() => {
        result.current[1]('güncellendi')
      })
      expect(result.current[0]).toBe('güncellendi')
      expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, JSON.stringify('güncellendi'))
    })

    it('updates state and localStorage with number value', () => {
      const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 0))
      act(() => {
        result.current[1](100)
      })
      expect(result.current[0]).toBe(100)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, JSON.stringify(100))
    })

    it('updates state and localStorage with object value', () => {
      const { result } = renderHook(() => useLocalStorage<{x: number}>(TEST_KEY, { x: 0 }))
      act(() => {
        result.current[1]({ x: 99 })
      })
      expect(result.current[0]).toEqual({ x: 99 })
    })

    it('uses functional update when value is a function', () => {
      const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 10))
      act(() => {
        result.current[1]((prev: number) => prev + 5)
      })
      expect(result.current[0]).toBe(15)
    })

    it('removes item from localStorage when value is null', () => {
      localStorageMock.setItem(TEST_KEY, JSON.stringify('test'))
      const { result } = renderHook(() => useLocalStorage<string | null>(TEST_KEY, null))
      act(() => {
        result.current[1](null)
      })
      expect(result.current[0]).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TEST_KEY)
    })

    it('removes item from localStorage when value is undefined', () => {
      localStorageMock.setItem(TEST_KEY, JSON.stringify('test'))
      const { result } = renderHook(() => useLocalStorage<string | undefined>(TEST_KEY, undefined))
      act(() => {
        result.current[1](undefined)
      })
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TEST_KEY)
    })

    it('does not write to localStorage when value equals stored value', () => {
      localStorageMock.setItem(TEST_KEY, JSON.stringify('same'))
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'different'))
      act(() => {
        result.current[1]('same')
      })
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
    })
  })

  describe('removeValue', () => {
    it('resets state to initial value and removes from localStorage', () => {
      localStorageMock.setItem(TEST_KEY, JSON.stringify('stored'))
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
      act(() => {
        result.current[2]()
      })
      expect(result.current[0]).toBe('initial')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TEST_KEY)
    })
  })

  describe('custom serializer/deserializer', () => {
    it('uses custom serializer', () => {
      const customSerializer = (value: string) => value.toUpperCase()
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, ' başlangıç ', { serializer: customSerializer })
      )
      act(() => {
        result.current[1]('test')
      })
      expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, 'TEST')
    })

    it('uses custom deserializer', () => {
      const customDeserializer = (value: string) => value.trim()
      localStorageMock.setItem(TEST_KEY, '  padded  ')
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, '', { deserializer: customDeserializer })
      )
      expect(result.current[0]).toBe('padded')
    })
  })

  describe('storage event synchronization', () => {
    it('listens to storage events from other tabs', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
      expect(result.current[0]).toBe('initial')

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: TEST_KEY,
            newValue: JSON.stringify('diğer-sekmeden'),
          })
        )
      })
      expect(result.current[0]).toBe('diğer-sekmeden')
    })

    it('resets to initial when storage event has null value', () => {
      localStorageMock.setItem(TEST_KEY, JSON.stringify('stored'))
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'))
      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: TEST_KEY,
            newValue: null,
          })
        )
      })
      expect(result.current[0]).toBe('initial')
    })
  })
})
