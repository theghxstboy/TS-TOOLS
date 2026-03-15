"use client"

import { Search as MagnifyingGlass } from "lucide-react"
import { useUI } from "@/hooks/useUI"

export function SearchTrigger() {
    const { toggleCommandPalette } = useUI()

    return (
        <button
            onClick={toggleCommandPalette}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-all duration-300 text-muted-foreground group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 w-full max-w-[280px]"
            aria-label="Busca rápida"
        >
            <MagnifyingGlass size={20} className="group-hover:text-primary transition-colors shrink-0" />
            <span className="hidden md:inline text-sm font-bold tracking-tight">Busca rápida</span>
            <div className="hidden lg:flex items-center gap-1.5 ml-auto border-l border-border pl-3">
                <span className="text-[10px] font-bold bg-card px-1.5 py-0.5 rounded border border-border">Ctrl</span>
                <span className="text-[10px] font-bold bg-card px-1.5 py-0.5 rounded border border-border">K</span>
            </div>
        </button>
    )
}
