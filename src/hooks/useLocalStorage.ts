"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(initialValue)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key)
            if (item) {
                setStoredValue(JSON.parse(item))
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
        } finally {
            setIsLoaded(true)
        }
    }, [key])

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        setStoredValue((prev) => {
            try {
                // Allow value to be a function so we have same API as useState
                const valueToStore = value instanceof Function ? value(prev) : value
                // Save to local storage
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore))
                }
                return valueToStore
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error)
                return prev
            }
        })
    }, [key])

    const remove = useCallback(() => {
        try {
            window.localStorage.removeItem(key)
            setStoredValue(initialValue)
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error)
        }
    }, [key, initialValue])

    return { value: storedValue, setValue, remove, isLoaded }
}
