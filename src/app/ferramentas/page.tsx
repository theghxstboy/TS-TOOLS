"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { SubmitToolModal } from "@/components/SubmitToolModal"
import { Tool } from "@/lib/tools"
import { ArrowLeft, ArrowUpRight, Plus, Folder, MagnifyingGlass, ClockCounterClockwise, CheckCircle, Check, X, ShieldCheck } from "@phosphor-icons/react"

export default function FerramentasHubPage() {
    const { data: session } = useSession();
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const res = await fetch("/api/tools");
            if (res.ok) {
                const data = await res.json();
                setTools(data);
            }
        } catch (error) {
            console.error("Failed to fetch tools", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessSubmit = () => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
    };

    const isAdmin = (session?.user as any)?.role === "admin";

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || tool.category.toLowerCase() === selectedCategory.toLowerCase();

        // Hide pending tools from the main hub for everyone (admins see them in the dashboard now)
        // If you still want admins to see them in the hub, we can allow it, but let's only show approved here for a cleaner hub.
        return matchesSearch && matchesCategory && (tool.status === "approved" || isAdmin);
    });

    const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const res = await fetch(`/api/tools/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Refresh list
                fetchTools();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };


    return (
        <div className="min-h-screen bg-input font-sans text-foreground pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[0.65rem] font-bold uppercase tracking-widest mb-6">
                            <Folder size={14} weight="fill" />
                            Comunidade TS
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                            Hub de <span className="text-primary">Ferramentas</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                            Um repositório colaborativo dos melhores links, softwares e recursos validados pela equipe e comunidade TS TOOLS.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        {session && (
                            <Link href="/ferramentas/minhas" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-primary/50 transition-colors">
                                <ClockCounterClockwise size={20} weight="bold" />
                                Minhas Sugestões
                            </Link>
                        )}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            <Plus size={20} weight="bold" />
                            Sugerir Ferramenta
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar ferramenta, categoria ou descrição..."
                            className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-w-[200px] capitalize cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">Todas as Categorias</option>
                        {Array.from(new Set(tools.map(t => t.category))).filter(Boolean).sort().map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Tools Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-card rounded-2xl border border-border animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredTools.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
                        <Folder className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-bold text-foreground">Nenhuma ferramenta encontrada</h3>
                        <p className="text-muted-foreground mt-2">
                            {searchQuery ? "Tente buscar por termos diferentes." : "Ainda não há ferramentas aprovadas no Hub."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map(tool => (
                            <div
                                key={tool.id}
                                className="group flex flex-col bg-card rounded-2xl border border-border hover:border-primary p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex flex-col gap-2">
                                        <span className="px-3 py-1 rounded-lg bg-input text-muted-foreground text-[0.65rem] font-bold uppercase tracking-wider group-hover:text-primary group-hover:bg-primary/10 transition-colors w-fit">
                                            {tool.category}
                                        </span>
                                        {tool.status === 'pending' && isAdmin && (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                                <ClockCounterClockwise size={12} weight="bold" />
                                                Pendente
                                            </span>
                                        )}
                                    </div>
                                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-input rounded-xl text-muted-foreground hover:text-primary transition-colors">
                                        <ArrowUpRight size={20} weight="bold" />
                                    </a>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                    {tool.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {tool.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                                            {tool.submittedBy.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium truncate">Sugerido por <span className="text-foreground">{tool.submittedBy}</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <SubmitToolModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccessSubmit}
            />

            {/* Success Toast Configuration */}
            {showSuccessToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-card border border-emerald-500/30 shadow-lg shadow-emerald-500/10 rounded-xl p-4 flex items-start gap-3 w-80">
                        <CheckCircle size={24} weight="fill" className="text-emerald-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-foreground text-sm">Sugestão Enviada!</h4>
                            <p className="text-xs text-muted-foreground mt-1">Sua ferramenta foi enviada para análise. Você pode acompanhar o status na seção "Minhas Sugestões".</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
