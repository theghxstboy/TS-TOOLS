"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

interface UIContextType {
    isCommandPaletteOpen: boolean
    setCommandPaletteOpen: (open: boolean) => void
    toggleCommandPalette: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isCommandPaletteOpen, setOpen] = useState(false)

    const toggleCommandPalette = useCallback(() => setOpen(prev => !prev), [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                toggleCommandPalette()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleCommandPalette])

    return (
        <UIContext.Provider value= {{
        isCommandPaletteOpen,
            setCommandPaletteOpen: setOpen,
                toggleCommandPalette
    }
}>
    { children }
    </UIContext.Provider>
    )
}

export function useUI() {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider")
    }
    return context
}
