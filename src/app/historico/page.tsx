"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
    ArrowLeft,
    History as ClockCounterClockwise,
    Trash2 as Trash,
    CheckCircle2 as CheckCircle,
    Copy,
    Check,
    Search as MagnifyingGlass,
    Wand2 as MagicWand,
    UserSquare2 as UserFocus,
    Video as VideoCamera,
    Image as Images
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HistoryItem } from "@/types/generator"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useClipboard } from "@/hooks/useClipboard"
import { useLocalStorage } from "@/hooks/useLocalStorage"

type GeneratorTab = "gerador" | "gerador-humano" | "gerador-video" | "antes-depois";

function HistoricoContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [activeTab, setActiveTab] = useState<GeneratorTab>("gerador")
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const { isCopied, copy } = useClipboard()
    const [isLoaded, setIsLoaded] = useState(false)

    // Sync tab from URL on mount
    useEffect(() => {
        const tabParam = searchParams.get('gerador') as GeneratorTab
        if (tabParam && ["gerador", "gerador-humano", "gerador-video", "antes-depois"].includes(tabParam)) {
            setActiveTab(tabParam)
        }
    }, [searchParams])

    // Load history for active tab
    useEffect(() => {
        setIsLoaded(false)
        try {
            const storedHistory = localStorage.getItem(`ts-tools-history-${activeTab}`)
            if (storedHistory) {
                setHistoryItems(JSON.parse(storedHistory))
            } else {
                setHistoryItems([])
            }
        } catch (error) {
            console.error("Failed to parse history", error)
            setHistoryItems([])
        } finally {
            setIsLoaded(true)
        }
    }, [activeTab])

    const handleClearHistory = () => {
        if (confirm("Tem certeza que deseja apagar todo o histórico deste gerador?")) {
            localStorage.removeItem(`ts-tools-history-${activeTab}`)
            setHistoryItems([])
        }
    }

    const handleRestore = (item: HistoryItem) => {
        // Redirect to the appropriate generator with the restore ID in the URL
        let path = ""
        switch (activeTab) {
            case "gerador": path = "/gerador"; break;
            case "gerador-humano": path = "/gerador-humano"; break;
            case "gerador-video": path = "/gerador-video"; break;
            case "antes-depois": path = "/antes-depois"; break;
        }

        router.push(`${path}?restore_id=${item.id}`)
    }

    const handleCopy = (prompt: string, id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent restore action
        copy(prompt);
    }

    const filteredItems = historyItems.filter(item =>
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 w-full relative font-sans">
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors bg-card/50 backdrop-blur-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <ClockCounterClockwise size={32} className="text-primary" />
                            Histórico de Gerações
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Acesse e recupere até os últimos 50 prompts gerados em cada ferramenta.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-card rounded-xl border border-border p-1 mb-8 max-w-3xl">
                    <button
                        onClick={() => setActiveTab("gerador")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'gerador' ? 'bg-primary text-black shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                    >
                        <MagicWand size={18} />
                        Gerador PRO
                    </button>
                    <button
                        onClick={() => setActiveTab("gerador-humano")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'gerador-humano' ? 'bg-primary text-black shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                    >
                        <UserFocus size={18} />
                        Gerador Humano
                    </button>
                    <button
                        onClick={() => setActiveTab("gerador-video")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'gerador-video' ? 'bg-primary text-black shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                    >
                        <VideoCamera size={18} />
                        Gerador Vídeo
                    </button>
                    <button
                        onClick={() => setActiveTab("antes-depois")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'antes-depois' ? 'bg-primary text-black shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                    >
                        <Images size={18} />
                        Antes & Depois
                    </button>
                </div>

                {/* Tools & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                        <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar no histórico..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-card border-border"
                        />
                    </div>

                    {historyItems.length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={handleClearHistory}
                            className="w-full md:w-auto flex items-center gap-2 bg-red-950/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-900/30"
                        >
                            <Trash size={18} /> Limpar Histórico Atual
                        </Button>
                    )}
                </div>

                {/* List View */}
                {!isLoaded ? (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                        Carregando histórico...
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-card/50 border border-border border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center">
                        <ClockCounterClockwise size={48} className="text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Nenhum histórico encontrado</h3>
                        <p className="text-muted-foreground text-sm max-w-md">
                            {searchQuery ? "Sua busca não retornou resultados." : "Você ainda não gerou prompts com esta ferramenta. Quando gerar, eles aparecerão aqui."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredItems.map((item) => {
                            const date = new Date(item.timestamp)
                            const formattedDate = format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
                            const timeAgo = formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })

                            return (
                                <div
                                    key={item.id}
                                    className="bg-card border border-border hover:border-primary/50 rounded-xl p-5 transition-colors group cursor-pointer"
                                    onClick={() => handleRestore(item)}
                                    title="Clique para restaurar este prompt no gerador"
                                >
                                    <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-bold bg-muted px-2 py-1 rounded-md text-muted-foreground uppercase tracking-wider">
                                                    {timeAgo}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formattedDate}
                                                </span>
                                            </div>
                                            <p className="text-foreground text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-none group-hover:text-primary/90 transition-colors">
                                                {item.prompt}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 md:flex-col md:items-end w-full md:w-auto border-t md:border-t-0 border-border pt-4 md:pt-0">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 md:w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-black border-none"
                                                onClick={(e) => {
                                                    e.stopPropagation() // Prevent div click
                                                    handleRestore(item)
                                                }}
                                            >
                                                <ClockCounterClockwise size={16} />
                                                Restaurar Opções
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`flex-1 md:w-full flex items-center justify-center gap-2 ${isCopied ? 'bg-green-600/20 text-green-500 border-green-600/30' : 'bg-input border-border text-foreground hover:bg-muted'}`}
                                                onClick={(e) => handleCopy(item.prompt, item.id, e)}
                                            >
                                                {isCopied ? (
                                                    <><Check size={16} /> Copiado</>
                                                ) : (
                                                    <><Copy size={16} /> Copiar Apenas</>
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
        <Suspense fallback={<div className="flex items-center justify-center p-10 h-screen">Carregando histórico...</div>}>
            <HistoricoContent />
        </Suspense>
    )
}
