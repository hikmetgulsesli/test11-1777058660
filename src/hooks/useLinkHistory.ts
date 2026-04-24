import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { ShortLink } from '../types'

export interface LinkHistoryEntry {
  id: string
  shortCode: string
  originalUrl: string
  createdAt: Date
  clickCount: number
}

export interface UseLinkHistoryReturn {
  history: LinkHistoryEntry[]
  addLink: (url: string, shortCode?: string) => void
  removeLink: (id: string) => void
  clearHistory: () => void
  getLink: (id: string) => LinkHistoryEntry | undefined
  getLinkByShortCode: (shortCode: string) => LinkHistoryEntry | undefined
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

const generateShortCode = (length: number = 5): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function useLinkHistory(): UseLinkHistoryReturn {
  const [history, setHistory] = useLocalStorage<LinkHistoryEntry[]>('link-history', [])

  const addLink = useCallback((url: string, shortCode?: string) => {
    const newEntry: LinkHistoryEntry = {
      id: generateId(),
      shortCode: shortCode ?? generateShortCode(),
      originalUrl: url,
      createdAt: new Date(),
      clickCount: 0,
    }
    setHistory(prev => [newEntry, ...prev])
  }, [setHistory])

  const removeLink = useCallback((id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id))
  }, [setHistory])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [setHistory])

  const getLink = useCallback((id: string) => {
    return history.find(entry => entry.id === id)
  }, [history])

  const getLinkByShortCode = useCallback((shortCode: string) => {
    return history.find(entry => entry.shortCode === shortCode)
  }, [history])

  return {
    history,
    addLink,
    removeLink,
    clearHistory,
    getLink,
    getLinkByShortCode,
  }
}