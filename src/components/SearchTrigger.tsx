"use client"

import { Search as MagnifyingGlass } from "lucide-react"
import { useUI } from "@/hooks/useUI"

export function SearchTrigger() {
    const { toggleCommandPalette } = useUI()

    return (
        <button
            onClick={toggleCommandPalette}
            className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors text-muted-foreground group"
            aria-label="Busca rápida"
        >
            <MagnifyingGlass size={18} className="group-hover:text-primary transition-colors" />
            <span className="hidden md:inline text-xs font-semibold">Busca rápida</span>
            <div className="hidden lg:flex items-center gap-1 ml-2">
                <span className="text-[10px] bg-card px-1 py-0.5 rounded border border-border">Ctrl</span>
                <span className="text-[10px] bg-card px-1 py-0.5 rounded border border-border">K</span>
            </div>
        </button>
    )
}
