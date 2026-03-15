"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tool } from "@/lib/tools"
import { CheckCircle2 as CheckCircle, XCircle, Loader2, ArrowUpRight } from "lucide-react"

// Skeleton card replicating the real "Minhas Sugestões" card layout
function SuggestionSkeleton({ index }: { index: number }) {
    return (
        <div
            className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 mb-3">
                    <div className="skeleton-shimmer h-5 w-40 rounded-md" />
                    <div className="skeleton-shimmer h-4 w-16 rounded" />
                </div>
                <div className="skeleton-shimmer h-3.5 w-full rounded" />
                <div className="skeleton-shimmer h-3.5 w-3/4 rounded" />
                <div className="skeleton-shimmer h-3 w-48 rounded mt-2" />
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 md:pl-6 md:border-l border-border">
                <div className="skeleton-shimmer h-6 w-20 rounded-full" />
                <div className="skeleton-shimmer h-3 w-24 rounded" />
            </div>
        </div>
    )
}

const StatusBadge = ({ status }: { status: Tool['status'] }) => {
    switch (status) {
        case "approved":
            return (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 shrink-0">
                    <CheckCircle size={13} /> Aprovada
                </div>
            );
        case "rejected":
            return (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 shrink-0">
                    <XCircle size={13} /> Rejeitada
                </div>
            );
        default:
            return (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 shrink-0">
                    <Loader2 size={13} className="animate-spin" /> Em Análise
                </div>
            );
    }
};

export default function MinhasFerramentasPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/ferramentas/minhas");
            return;
        }
        if (status === "authenticated") {
            fetchUserTools();
        }
    }, [status, router]);

    const fetchUserTools = async () => {
        try {
            const res = await fetch("/api/tools/me");
            if (res.ok) {
                const data = await res.json();
                setTools(data);
            }
        } catch (error) {
            console.error("Failed to fetch user tools", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-input font-sans text-foreground pb-20">
                <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-24">
                    <div className="flex items-center gap-4 mb-8 animate-fade-up">
                        <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
                        <div className="space-y-2">
                            <div className="skeleton-shimmer h-7 w-48 rounded-md" />
                            <div className="skeleton-shimmer h-4 w-64 rounded" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <SuggestionSkeleton key={i} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-input font-sans text-foreground pb-20">
            <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-24">

                {/* Header */}
                <div className="flex items-start gap-4 mb-8 animate-fade-up">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CheckCircle size={26} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                            Minhas Sugestões
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            Acompanhe o status das ferramentas que você enviou para o Hub.
                        </p>
                    </div>
                </div>

                {tools.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed animate-fade-up">
                        <p className="text-muted-foreground">Você ainda não sugeriu nenhuma ferramenta.</p>
                        <Link
                            href="/ferramentas"
                            className="inline-flex items-center gap-1.5 mt-4 text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        >
                            Sugerir uma no Hub <ArrowUpRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tools.map((tool, index) => (
                            <div
                                key={tool.id}
                                className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-up"
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-lg font-bold text-foreground">{tool.title}</h3>
                                        <span className="px-2 py-0.5 rounded bg-input text-muted-foreground text-[0.65rem] font-bold uppercase tracking-wider shrink-0">
                                            {tool.category}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                                        {tool.description}
                                    </p>
                                    <a
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline truncate inline-block max-w-[300px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {tool.url}
                                    </a>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 md:pl-6 md:border-l border-border">
                                    <StatusBadge status={tool.status} />
                                    <span className="text-[0.65rem] text-muted-foreground whitespace-nowrap">
                                        {new Date(tool.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
