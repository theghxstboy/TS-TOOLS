"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { SubmitToolModal } from "@/components/SubmitToolModal"
import { Tool } from "@/lib/tools"
import { ArrowUpRight, Plus, Folder, Search as MagnifyingGlass, Star, ChevronLeft, ChevronRight, Globe } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const FAVORITES_KEY = "ts_tools_community_favorites"
const ITEMS_PER_PAGE = 9

// Shimmer skeleton replicating the real tool card layou
function ToolCardSkeleton({ index }: { index: number }) {
    return (
        <div
            className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden animate-fade-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="h-40 bg-muted skeleton-shimmer" />
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="skeleton-shimmer h-5 w-20 rounded-md" />
                    <div className="flex gap-2">
                        <div className="skeleton-shimmer h-8 w-8 rounded-xl" />
                    </div>
                </div>
                <div className="skeleton-shimmer h-6 w-3/4 mb-2 rounded-md" />
                <div className="space-y-1.5 mb-6 flex-1">
                    <div className="skeleton-shimmer h-3.5 w-full rounded" />
                    <div className="skeleton-shimmer h-3.5 w-5/6 rounded" />
                </div>
                <div className="border-t border-border pt-4 flex items-center gap-2">
                    <div className="skeleton-shimmer h-6 w-6 rounded-full" />
                    <div className="skeleton-shimmer h-3.5 w-28 rounded" />
                </div>
            </div>
        </div>
    )
}

export default function FerramentasHubPage() {
    const { data: session } = useSession();
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTools();
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem(FAVORITES_KEY)
        if (stored) {
            try { setFavorites(new Set(JSON.parse(stored))) } catch { localStorage.removeItem(FAVORITES_KEY) }
        }
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const toggleFavorite = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => {
            const next = new Set(prev);
            const added = !next.has(id);
            if (added) { next.add(id) } else { next.delete(id) }
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
            toast(added ? "Adicionado aos favoritos" : "Removido dos favoritos", { icon: added ? "⭐" : "🗑️" });
            return next;
        });
    };

    const fetchTools = async () => {
        try {
            const res = await fetch("/api/tools");
            if (res.ok) {
                const data = await res.json();
                setTools(data);
            } else {
                toast.error("Não foi possível carregar as ferramentas.");
            }
        } catch (error) {
            console.error("Failed to fetch tools", error);
            toast.error("Erro de conexão ao carregar ferramentas.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessSubmit = () => {
        toast.success("Sugestão enviada!", {
            description: 'Sua ferramenta foi enviada para análise. Acompanhe em "Minhas Sugestões".',
        });
    };

    const isAdmin = (session?.user as { role?: string })?.role === "admin";

    const filteredTools = useMemo(() => {
        return tools
            .filter(tool => {
                const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tool.category.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "all" || tool.category.toLowerCase() === selectedCategory.toLowerCase();
                return matchesSearch && matchesCategory && (tool.status === "approved" || isAdmin);
            })
            .sort((a, b) => {
                const aFav = favorites.has(a.id) ? 0 : 1;
                const bFav = favorites.has(b.id) ? 0 : 1;
                return aFav - bFav || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }, [tools, searchQuery, selectedCategory, favorites, isAdmin]);

    const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
    const paginatedTools = filteredTools.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getThumbnailUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return null;
        }
    };

    return (
        <div className="min-h-screen bg-input font-sans text-foreground pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8 animate-fade-up">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[0.65rem] font-bold uppercase tracking-widest mb-4">
                            <Folder size={14} />
                            Comunidade TS
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
                            Hub de <span className="text-primary">Ferramentas</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Links, softwares e recursos validados pela equipe e comunidade TS para escalar seus resultados.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        {session && (
                            <Link
                                href="/ferramentas/minhas"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                            >
                                Minhas Sugestões
                            </Link>
                        )}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            <Plus size={18} />
                            Sugerir Ferramenta
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-3 animate-fade-up" style={{ animationDelay: "40ms" }}>
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar ferramenta, categoria ou descrição..."
                            className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all placeholder:text-muted-foreground/50 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select
                            className="appearance-none bg-card border border-border rounded-xl pl-4 pr-10 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all min-w-[200px] capitalize cursor-pointer shadow-sm"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Todas as Categorias</option>
                            {Array.from(new Set(tools.map(t => t.category))).filter(Boolean).sort().map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <ChevronRight size={16} className="rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <ToolCardSkeleton key={i} index={i} />
                        ))}
                    </div>
                ) : filteredTools.length === 0 ? (
                    <div className="text-center py-24 bg-card rounded-3xl border border-border border-dashed animate-fade-up">
                        <Folder className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                        <h3 className="text-xl font-bold text-foreground">Ainda não encontramos nada</h3>
                        <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
                            Tente ajustar seus filtros ou buscar por termos mais genéricos.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedTools.map((tool, index) => (
                                <div
                                    key={tool.id}
                                    className={`group flex flex-col bg-card rounded-2xl border overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative animate-fade-up ${favorites.has(tool.id)
                                        ? 'border-primary/30 ring-1 ring-primary/10'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    {/* Tool Preview Header */}
                                    <div className="h-44 relative overflow-hidden bg-muted flex items-center justify-center border-b border-border">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-black/20 z-10" />
                                        <img
                                            src={`https://api.microlink.io?url=${encodeURIComponent(tool.url)}&screenshot=true&embed=screenshot.url`}
                                            alt={tool.title}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop`;
                                                (e.target as HTMLImageElement).classList.add('opacity-40');
                                            }}
                                        />
                                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                                            <button
                                                onClick={(e) => toggleFavorite(e, tool.id)}
                                                className={`p-2.5 rounded-xl backdrop-blur-md shadow-lg transition-all duration-300 ${favorites.has(tool.id)
                                                    ? 'text-yellow-400 bg-yellow-400/20 border border-yellow-400/30'
                                                    : 'text-white/70 bg-black/40 border border-white/10 hover:text-white hover:bg-black/60'
                                                    }`}
                                            >
                                                <Star size={18} className={favorites.has(tool.id) ? 'fill-current' : ''} />
                                            </button>
                                        </div>
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1 rounded-lg backdrop-blur-md bg-black/40 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                {tool.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-input border border-border-muted flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-primary/30 transition-colors">
                                                <img
                                                    src={getThumbnailUrl(tool.url) || ""}
                                                    alt=""
                                                    className="w-6 h-6 object-contain"
                                                    onError={(e) => (e.target as any).style.display = 'none'}
                                                />
                                                <Globe size={20} className="text-muted-foreground/30 absolute" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1">
                                                {tool.title}
                                            </h3>
                                        </div>

                                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1 line-clamp-3 font-medium">
                                            {tool.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[11px] font-bold shrink-0">
                                                    {tool.submittedBy.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-[11px] text-muted-foreground">
                                                    Por <span className="text-foreground font-bold">{tool.submittedBy}</span>
                                                </span>
                                            </div>

                                            <a
                                                href={tool.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-all group/link"
                                            >
                                                Acessar Site
                                                <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-2 animate-fade-up">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-primary/50"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2 mx-4">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1
                                                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                                    : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:border-primary/50"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <SubmitToolModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccessSubmit}
            />
        </div>
    )
}
