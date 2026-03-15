"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    History as ClockCounterClockwise,
    Trash2 as Trash,
    Copy,
    Check,
    Search as MagnifyingGlass,
    Wand2 as MagicWand,
    UserSquare2 as UserFocus,
    Video as VideoCamera,
    Image as Images,
    RotateCcw as Workflow,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { HistoryItem } from "@/types/generator"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useClipboard } from "@/hooks/useClipboard"
import { toast } from "sonner"

type GeneratorTab = "gerador" | "gerador-humano" | "gerador-video" | "antes-depois" | "workflow";

const TABS = [
    { id: "gerador" as GeneratorTab, label: "Imagens", icon: MagicWand },
    { id: "gerador-humano" as GeneratorTab, label: "Humano", icon: UserFocus },
    { id: "gerador-video" as GeneratorTab, label: "Vídeo", icon: VideoCamera },
    { id: "antes-depois" as GeneratorTab, label: "Antes & Depois", icon: Images },
    { id: "workflow" as GeneratorTab, label: "Workflow", icon: Workflow },
]

// Shimmer skeleton replicating history item layout
function HistorySkeleton({ index }: { index: number }) {
    return (
        <div
            className="bg-card border border-border rounded-xl p-5 animate-fade-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="skeleton-shimmer h-5 w-16 rounded-md" />
                        <div className="skeleton-shimmer h-4 w-28 rounded" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="skeleton-shimmer h-3.5 w-full rounded" />
                        <div className="skeleton-shimmer h-3.5 w-4/5 rounded" />
                    </div>
                </div>
                <div className="flex gap-2 md:flex-col">
                    <div className="skeleton-shimmer h-9 w-36 rounded-lg" />
                    <div className="skeleton-shimmer h-9 w-28 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

function HistoricoContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [activeTab, setActiveTab] = useState<GeneratorTab>("gerador")
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const { isCopied, copy } = useClipboard()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const tabParam = searchParams.get('gerador') as GeneratorTab
        if (tabParam && ["gerador", "gerador-humano", "gerador-video", "antes-depois", "workflow"].includes(tabParam)) {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    useEffect(() => {
        setIsLoaded(false)
        try {
            const storedHistory = localStorage.getItem(`ts-tools-history-${activeTab}`)
            setHistoryItems(storedHistory ? JSON.parse(storedHistory) : [])
        } catch (error) {
            console.error("Failed to parse history", error)
            localStorage.removeItem(`ts-tools-history-${activeTab}`)
            setHistoryItems([])
        } finally {
            setIsLoaded(true)
        }
    }, [activeTab])

    const handleClearHistory = () => {
        localStorage.removeItem(`ts-tools-history-${activeTab}`)
        setHistoryItems([])
        toast.success("Histórico apagado.")
    }

    const handleRestore = (item: HistoryItem) => {
        const pathMap: Record<GeneratorTab, string> = {
            "gerador": "/gerador",
            "gerador-humano": "/gerador-humano",
            "gerador-video": "/gerador-video",
            "antes-depois": "/antes-depois",
            "workflow": "/workflow",
        }
        router.push(`${pathMap[activeTab]}?restore_id=${item.id}`)
    }

    const handleCopy = (prompt: string, e: React.MouseEvent) => {
        e.stopPropagation();
        copy(prompt);
    }

    const filteredItems = historyItems.filter(item =>
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 w-full font-sans">
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">

                {/* Header */}
                <div className="mb-8 animate-fade-up">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <ClockCounterClockwise size={28} className="text-primary" />
                        Histórico
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Acesse e recupere até os últimos 50 prompts gerados em cada ferramenta.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-card rounded-xl border border-border p-1 mb-6 gap-1 overflow-x-auto no-scrollbar animate-fade-up" style={{ animationDelay: "40ms" }}>
                    {TABS.map(tab => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-max flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === tab.id ? 'bg-primary text-black shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mb-5 animate-fade-up" style={{ animationDelay: "80ms" }}>
                    <div className="relative w-full md:w-80">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar no histórico..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-card border-border focus-visible:ring-ring"
                        />
                    </div>

                    {historyItems.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="w-full md:w-auto flex items-center gap-2 bg-red-950/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-900/30 focus-visible:ring-ring"
                                >
                                    <Trash size={16} />
                                    Limpar Histórico
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apagar histórico?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Isso removerá permanentemente todos os {historyItems.length} prompt{historyItems.length !== 1 ? 's' : ''} salvos nesta aba. Essa ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-input border-border hover:bg-muted">
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleClearHistory}
                                        className="bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600"
                                    >
                                        Sim, apagar tudo
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {/* List */}
                {!isLoaded ? (
                    <div className="grid gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <HistorySkeleton key={i} index={i} />
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-card/50 border border-border border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center animate-fade-up">
                        <ClockCounterClockwise size={40} className="text-muted-foreground/40 mb-4" />
                        <h3 className="text-base font-bold text-foreground mb-2">Nenhum histórico encontrado</h3>
                        <p className="text-muted-foreground text-sm max-w-md">
                            {searchQuery ? "Sua busca não retornou resultados." : "Você ainda não gerou prompts com esta ferramenta."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filteredItems.map((item, index) => {
                            const date = new Date(item.timestamp)
                            const formattedDate = format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
                            const timeAgo = formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })

                            return (
                                <div
                                    key={item.id}
                                    className="bg-card border border-border hover:border-primary/50 rounded-xl p-5 transition-all group cursor-pointer animate-fade-up"
                                    onClick={() => handleRestore(item)}
                                    title="Clique para restaurar este prompt no gerador"
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-md text-muted-foreground uppercase tracking-wider shrink-0">
                                                    {timeAgo}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {formattedDate}
                                                </span>
                                            </div>
                                            <p className="text-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-primary/90 transition-colors">
                                                {item.prompt}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 md:shrink-0 border-t md:border-t-0 border-border pt-3 md:pt-0">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-black border-none focus-visible:ring-ring"
                                                onClick={(e) => { e.stopPropagation(); handleRestore(item) }}
                                            >
                                                <ClockCounterClockwise size={14} />
                                                Restaurar
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`flex-1 md:flex-none flex items-center justify-center gap-2 focus-visible:ring-ring ${isCopied ? 'bg-emerald-600/20 text-emerald-500 border-emerald-600/30' : 'bg-input border-border text-foreground hover:bg-muted'}`}
                                                onClick={(e) => handleCopy(item.prompt, e)}
                                            >
                                                {isCopied ? (
                                                    <><Check size={14} /> Copiado</>
                                                ) : (
                                                    <><Copy size={14} /> Copiar</>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function HistoricoPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
                <div className="grid gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <HistorySkeleton key={i} index={i} />
                    ))}
                </div>
            </div>
        }>
            <HistoricoContent />
        </Suspense>
    )
}
