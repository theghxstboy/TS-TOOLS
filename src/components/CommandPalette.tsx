"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Search as MagnifyingGlass,
    Wand2 as MagicWand,
    ArrowRightLeft,
    MonitorPlay,
    UserSquare2 as UserFocus,
    Building2 as Buildings,
    BookOpen as BookOpenText,
    PackageSearch,
    History as ClockCounterClockwise,
    ListTodo,
    MonitorSmartphone,
    Star,
    ArrowRight
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/hooks/useFavorites"
import { useUI } from "@/hooks/useUI"
import { CommandAction } from "@/types/generator"
import { nichesData } from "@/data/niches"

const STATIC_ACTIONS: CommandAction[] = [
    {
        id: "gerador",
        title: "Gerador de Imagens",
        description: "Crie prompts para anúncios de alto impacto",
        icon: <MagicWand size={20} />,
        href: "/gerador",
        category: "Ferramentas"
    },
    {
        id: "antes-depois",
        title: "Antes & Depois",
        description: "Gere imagens comparativas perfeitas",
        icon: <ArrowRightLeft size={20} />,
        href: "/antes-depois",
        category: "Ferramentas"
    },
    {
        id: "gerador-video",
        title: "Gerador de Vídeos",
        description: "Roteiros e direções para vídeos por IA",
        icon: <MonitorPlay size={20} />,
        href: "/gerador-video",
        category: "Ferramentas"
    },
    {
        id: "gerador-humano",
        title: "Humanizador",
        description: "Prompts de pessoas ultra-realistas",
        icon: <UserFocus size={20} />,
        href: "/gerador-humano",
        category: "Ferramentas"
    },
    {
        id: "meu-checklist",
        title: "Meu Checklist",
        description: "Organize suas tarefas de operação",
        icon: <ListTodo size={20} />,
        href: "/meu-checklist",
        category: "Utilidades"
    },
    {
        id: "checklist-webdesign",
        title: "Checklist Webdesign",
        description: "Setup completo para entrega de LPs",
        icon: <MonitorSmartphone size={20} />,
        href: "/checklist-webdesign",
        category: "Utilidades"
    },
    {
        id: "gerador-webdesign",
        title: "Web Design Generator",
        description: "Prompts de código para v0, Lovable e Bolt",
        icon: <MagicWand size={20} className="text-blue-500" />,
        href: "/gerador-webdesign",
        category: "Ferramentas"
    },
    {
        id: "nichos",
        title: "Manual dos Nichos",
        description: "Workflow e vocabulário técnico",
        icon: <Buildings size={20} />,
        href: "/docs/nichos",
        category: "Conhecimento"
    },
    {
        id: "academy",
        title: "Prompt Academy",
        description: "Documentação técnica completa",
        icon: <BookOpenText size={20} />,
        href: "/docs",
        category: "Conhecimento"
    },
    {
        id: "hub",
        title: "Hub de Ferramentas",
        description: "Recursos validados pela equipe",
        icon: <PackageSearch size={20} />,
        href: "/ferramentas",
        category: "Conhecimento"
    },
    {
        id: "historico",
        title: "Ver Todo Histórico",
        description: "Acesse suas gerações anteriores",
        icon: <ClockCounterClockwise size={20} />,
        href: "/historico",
        category: "Navegação"
    }
]

export function CommandPalette() {
    const { isCommandPaletteOpen: open, setCommandPaletteOpen: setOpen } = useUI()
    const [search, setSearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { favorites } = useFavorites()
    const router = useRouter()

    const nicheActions: CommandAction[] = useMemo(() => nichesData.map(niche => ({
        id: `niche-${niche.id}`,
        title: niche.title,
        description: niche.subtitle,
        icon: <niche.icon size={20} />,
        href: `/docs/nichos/${niche.id}`,
        category: "Nichos (Academy)"
    })), [])

    const favoriteActions: CommandAction[] = useMemo(() => favorites.map(fav => ({
        id: fav.id,
        title: fav.title,
        description: fav.prompt.substring(0, 60) + "...",
        icon: <Star size={20} fill="currentColor" className="text-yellow-500" />,
        category: "Favoritos",
        onSelect: () => {
            router.push(`/${fav.generatorId}?restore_id=${fav.id}&is_fav=true`)
        },
        payload: fav
    })), [favorites, router])

    const allActions = useMemo(() => [...favoriteActions, ...STATIC_ACTIONS, ...nicheActions], [favoriteActions, nicheActions])

    const filteredActions = useMemo(() =>
        allActions.filter(action =>
            action.title.toLowerCase().includes(search.toLowerCase()) ||
            action.description.toLowerCase().includes(search.toLowerCase()) ||
            action.category.toLowerCase().includes(search.toLowerCase())
        ),
        [allActions, search])

    useEffect(() => {
        setSelectedIndex(0)
    }, [search, open])

    const handleSelect = useCallback((action: CommandAction) => {
        setOpen(false)
        setSearch("")
        if (action.href) {
            router.push(action.href)
        } else if (action.onSelect) {
            action.onSelect(action)
        }
    }, [router, setOpen])

    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault()
                setSelectedIndex(i => (i + 1) % filteredActions.length)
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length)
            } else if (e.key === "Enter") {
                e.preventDefault()
                if (filteredActions[selectedIndex]) {
                    handleSelect(filteredActions[selectedIndex])
                }
            } else if (e.key === "Escape") {
                setOpen(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, filteredActions, selectedIndex, handleSelect, setOpen])

    const categories = useMemo(() =>
        Array.from(new Set(filteredActions.map(a => a.category))),
        [filteredActions])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-none top-[15%] translate-y-0 focus:outline-none">
                <DialogTitle className="sr-only">Busca Global</DialogTitle>
                <div className="w-full bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center px-4 py-4 border-b border-border gap-3">
                        <MagnifyingGlass size={22} className="text-muted-foreground" />
                        <input
                            autoFocus
                            placeholder="O que você está procurando? (Ctrl + K)"
                            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg focus:ring-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Esc
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                        {filteredActions.length === 0 ? (
                            <div className="py-12 text-center">
                                <MagnifyingGlass size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground font-medium">Nenhum resultado encontrado para "{search}"</p>
                            </div>
                        ) : (
                            categories.map(category => (
                                <div key={category} className="mb-4 last:mb-0">
                                    <h3 className="px-3 py-2 text-[10px] font-extrabold text-primary uppercase tracking-widest opacity-70">
                                        {category}
                                    </h3>
                                    <div className="space-y-1">
                                        {filteredActions
                                            .filter(a => a.category === category)
                                            .map((action) => {
                                                const isSelected = filteredActions[selectedIndex]?.id === action.id
                                                return (
                                                    <button
                                                        key={action.id}
                                                        onClick={() => handleSelect(action)}
                                                        className={cn(
                                                            "w-full flex items-center gap-4 px-3 py-3 rounded-xl text-left transition-all group relative",
                                                            isSelected ? "bg-primary text-black shadow-lg scale-[1.01]" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "size-10 rounded-lg flex items-center justify-center transition-colors",
                                                            isSelected ? "bg-black/10" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                                                        )}>
                                                            {action.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold truncate">{action.title}</span>
                                                                {action.badge && (
                                                                    <span className={cn(
                                                                        "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                                                                        isSelected ? "bg-black/20 text-black" : "bg-cyan-500/10 text-cyan-500"
                                                                    )}>
                                                                        {action.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={cn(
                                                                "text-xs truncate",
                                                                isSelected ? "text-black/70" : "text-muted-foreground"
                                                            )}>
                                                                {action.description}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <ArrowRight size={18} className="animate-in slide-in-from-left-2" />
                                                        )}
                                                    </button>
                                                )
                                            })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 border-t border-border flex items-center justify-between bg-muted/30">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded bg-muted text-[10px] font-bold text-muted-foreground border border-border/50">↑↓</div>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Navegar</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="p-1 rounded bg-muted text-[10px] font-bold text-muted-foreground border border-border/50">Enter</div>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Selecionar</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest flex items-center gap-2">
                            TS-TOOLS SEARCH
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
