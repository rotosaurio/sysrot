import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing localStorage with TypeScript support
 * 
 * Features:
 * - Type-safe localStorage operations
 * - SSR compatibility (no errors during server-side rendering)
 * - Automatic JSON serialization/deserialization
 * - Error handling for quota exceeded and invalid JSON
 * - Synchronization across browser tabs
 * 
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue] tuple
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get value from localStorage on mount
  useEffect(() => {
    if (!isClient) return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsedItem = JSON.parse(item)
        setStoredValue(parsedItem)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      // If error, use initial value
      setStoredValue(initialValue)
    }
  }, [key, initialValue, isClient])

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    if (!isClient) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, isClient])

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (!isClient) return

    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent(`localStorage-${key}`, {
        detail: valueToStore
      }))
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        console.error(`localStorage quota exceeded for key "${key}"`)
        // Optionally, you could implement a cleanup strategy here
      } else {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    }
  }, [key, storedValue, isClient])

  // Function to remove the key from localStorage
  const removeValue = useCallback(() => {
    if (!isClient) return

    try {
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent(`localStorage-${key}`, {
        detail: initialValue
      }))
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue, isClient])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing localStorage with expiration
 * 
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist or is expired
 * @param ttl - Time to live in milliseconds
 * @returns [value, setValue, removeValue, isExpired] tuple
 */
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  ttl: number = 24 * 60 * 60 * 1000 // 24 hours default
): [T, (value: T) => void, () => void, boolean] {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const expiryKey = `${key}-expiry`
    const expiryTime = localStorage.getItem(expiryKey)
    
    if (expiryTime) {
      const now = Date.now()
      const expiry = parseInt(expiryTime, 10)
      
      if (now > expiry) {
        setIsExpired(true)
        removeValue()
        localStorage.removeItem(expiryKey)
      }
    }
  }, [key, removeValue])

  const setValueWithExpiry = useCallback((newValue: T) => {
    setValue(newValue)
    const expiryTime = Date.now() + ttl
    localStorage.setItem(`${key}-expiry`, expiryTime.toString())
    setIsExpired(false)
  }, [setValue, key, ttl])

  const removeValueWithExpiry = useCallback(() => {
    removeValue()
    localStorage.removeItem(`${key}-expiry`)
    setIsExpired(false)
  }, [removeValue, key])

  return [value, setValueWithExpiry, removeValueWithExpiry, isExpired]
}

/**
 * Hook for managing multiple localStorage keys as a single object
 * 
 * @param keys - Array of localStorage keys to manage
 * @param initialValues - Object with initial values for each key
 * @returns Object with current values and update function
 */
export function useMultipleLocalStorage<T extends Record<string, any>>(
  keys: (keyof T)[],
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues)

  useEffect(() => {
    const loadedValues = { ...initialValues }
    
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key as string)
        if (item) {
          loadedValues[key] = JSON.parse(item)
        }
      } catch (error) {
        console.error(`Error loading localStorage key "${String(key)}":`, error)
      }
    })
    
    setValues(loadedValues)
  }, [keys])

  const updateValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    try {
      localStorage.setItem(key as string, JSON.stringify(value))
      setValues(prev => ({ ...prev, [key]: value }))
    } catch (error) {
      console.error(`Error setting localStorage key "${String(key)}":`, error)
    }
  }, [])

  const updateMultiple = useCallback((updates: Partial<T>) => {
    try {
      Object.entries(updates).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
      setValues(prev => ({ ...prev, ...updates }))
    } catch (error) {
      console.error('Error updating multiple localStorage keys:', error)
    }
  }, [])

  return { values, updateValue, updateMultiple }
}

/**
 * Utility functions for localStorage management
 */
export const localStorageUtils = {
  /**
   * Get localStorage size in bytes
   */
  getSize(): number {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  },

  /**
   * Clear all localStorage data
   */
  clearAll(): void {
    localStorage.clear()
  },

  /**
   * Get all localStorage keys
   */
  getAllKeys(): string[] {
    return Object.keys(localStorage)
  },

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, 'test')
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },

  /**
   * Get localStorage usage percentage
   */
  getUsagePercentage(): number {
    if (!this.isAvailable()) return 0
    
    const used = this.getSize()
    const quota = 5 * 1024 * 1024 // 5MB typical quota
    return Math.round((used / quota) * 100)
  }
}