import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useClipboard } from './useClipboard'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('useClipboard', () => {
  let clipboardMock: {
    writeText: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    clipboardMock = {
      writeText: vi.fn().mockResolvedValue(undefined),
    }
    Object.assign(navigator, {
      clipboard: clipboardMock,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('copy', () => {
    it('writes text to clipboard', async () => {
      const { result } = renderHook(() => useClipboard())
      await act(async () => {
        await result.current.copy('kisa.link/test')
      })
      expect(clipboardMock.writeText).toHaveBeenCalledWith('kisa.link/test')
    })

    it('sets copied state to true after successful copy', async () => {
      const { result } = renderHook(() => useClipboard())
      await act(async () => {
        await result.current.copy('https://example.com')
      })
      expect(result.current.copied).toBe(true)
    })

    it('resets copied state after timeout', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() => useClipboard({ timeout: 2000 }))
      await act(async () => {
        await result.current.copy('test')
      })
      expect(result.current.copied).toBe(true)
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(result.current.copied).toBe(false)
      vi.useRealTimers()
    })

    it('uses default timeout of 2000ms', async () => {
      vi.useFakeTimers()
      const { result } = renderHook(() => useClipboard())
      await act(async () => {
        await result.current.copy('test')
      })
      act(() => {
        vi.advanceTimersByTime(1999)
      })
      expect(result.current.copied).toBe(true)
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.copied).toBe(false)
      vi.useRealTimers()
    })

    it('sets error state on failure', async () => {
      const testError = new Error('Clipboard access denied')
      clipboardMock.writeText.mockRejectedValue(testError)
      const { result } = renderHook(() => useClipboard())
      await act(async () => {
        await result.current.copy('test')
      })
      expect(result.current.error).toBe(testError)
      expect(result.current.copied).toBe(false)
    })

    it('clears previous error on new copy attempt', async () => {
      clipboardMock.writeText.mockRejectedValueOnce(new Error('fail'))
      const { result } = renderHook(() => useClipboard())
      await act(async () => {
        await result.current.copy('test1')
      })
      expect(result.current.error).toBeTruthy()
      clipboardMock.writeText.mockResolvedValue(undefined)
      await act(async () => {
        await result.current.copy('test2')
      })
      expect(result.current.error).toBeNull()
    })
  })

  describe('copied state', () => {
    it('starts as false', () => {
      const { result } = renderHook(() => useClipboard())
      expect(result.current.copied).toBe(false)
    })
  })

  describe('error state', () => {
    it('starts as null', () => {
      const { result } = renderHook(() => useClipboard())
      expect(result.current.error).toBeNull()
    })
  })
})