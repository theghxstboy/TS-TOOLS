"use client"

import { useState, useCallback } from "react"

export function useClipboard(timeout = 2000) {
    const [isCopied, setIsCopied] = useState(false)

    const copy = useCallback(async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text)
            } else {
                const textArea = document.createElement("textarea")
                textArea.value = text
                textArea.style.position = "fixed"
                textArea.style.left = "-9999px"
                textArea.style.top = "0"
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
            }
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), timeout)
            return true
        } catch (error) {
            console.error("Failed to copy text: ", error)
            return false
        }
    }, [timeout])

    return { isCopied, copy }
}
