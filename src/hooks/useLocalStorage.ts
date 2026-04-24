import { useState, useEffect, useCallback } from 'react'

export interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
}

const defaultSerializer = <T>(value: T): string => {
  return JSON.stringify(value)
}

const defaultDeserializer = <T>(value: string): T => {
  return JSON.parse(value) as T
}

/**
 * A React hook for persisting state in localStorage.
 * @param key - The localStorage key
 * @param initialValue - The initial value if key doesn't exist
 * @param options - Optional serializer/deserializer functions
 * @returns [value, setValue, removeValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
  } = options ?? {}

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? deserializer(item) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: Hata oluştu "${key}" okunurken:`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value

        if (typeof window !== 'undefined') {
          if (valueToStore === null || valueToStore === undefined) {
            window.localStorage.removeItem(key)
          } else {
            const serializedValue = serializer(valueToStore)
            const existingItem = window.localStorage.getItem(key)
            if (existingItem !== serializedValue) {
              window.localStorage.setItem(key, serializedValue)
            }
          }
        }
        setStoredValue(valueToStore)
      } catch (error) {
        console.warn(`useLocalStorage: Hata oluştu "${key}" yazılırken:`, error)
      }
    },
    [key, serializer, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`useLocalStorage: Hata oluştu "${key}" silinirken:`, error)
    }
  }, [key, initialValue])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue))
        } catch {
          setStoredValue(initialValue)
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserializer, initialValue])

  return [storedValue, setValue, removeValue]
}
