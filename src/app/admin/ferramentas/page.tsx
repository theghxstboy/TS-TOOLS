"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tool } from "@/lib/tools"
import { ShieldCheck, Check, X, CircleDashed, Link as LinkIcon } from "@phosphor-icons/react"

export default function AdminFerramentasPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pendingTools, setPendingTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        // Redirect if not authenticated or not the specific admin
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/admin/ferramentas");
            return;
        }

        if (status === "authenticated") {
            // Check if the user is the admin (matching our simplified auth logic)
            // In a real prod environment, you'd use a role claim in the token
            const isAdmin = session?.user?.email === "admin@tstools.com" || session?.user?.email === "rodrigocostamarketing@gmail.com";

            if (!isAdmin) {
                router.push("/");
                return;
            }

            fetchPendingTools();
        }
    }, [status, session, router]);

    const fetchPendingTools = async () => {
        try {
            const res = await fetch("/api/admin/tools");
            if (res.ok) {
                const data = await res.json();
                setPendingTools(data);
            }
        } catch (error) {
            console.error("Failed to fetch pending tools", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        setProcessingId(id);
        try {
            const res = await fetch("/api/admin/tools", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: action }),
            });

            if (res.ok) {
                // Remove the tool from the pending list
                setPendingTools(prev => prev.filter(tool => tool.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao processar a ação");
            }
        } catch (error) {
            console.error(`Failed to ${action} tool:`, error);
            alert("Erro de conexão ao processar a ação");
        } finally {
            setProcessingId(null);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-input font-sans pt-32 px-6 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-input font-sans text-foreground pb-20">
            <div className="max-w-5xl mx-auto px-6 pt-16 md:pt-24">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <ShieldCheck size={28} weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                            Moderação de Ferramentas
                        </h1>
                        <p className="text-muted-foreground">Analise as sugestões da comunidade antes de publicá-las no Hub.</p>
                    </div>
                </div>

                {pendingTools.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <Check size={32} weight="bold" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Tudo limpo!</h3>
                        <p className="text-muted-foreground mt-2">
                            Não há ferramentas pendentes de aprovação no momento.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {pendingTools.map((tool) => (
                            <div key={tool.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-foreground">{tool.title}</h3>
                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[0.65rem] font-bold uppercase tracking-wider">
                                            {tool.category}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        {tool.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center text-xs">
                                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg">
                                            <LinkIcon size={14} />
                                            Testar Link
                                        </a>
                                        <div className="text-muted-foreground">
                                            Sugerido por: <strong className="text-foreground">{tool.submittedBy}</strong> ({tool.userId})
                                        </div>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col items-center gap-3 shrink-0 md:pl-6 md:border-l border-border pt-4 md:pt-0 border-t md:border-t-0">
                                    <button
                                        onClick={() => handleAction(tool.id, 'approved')}
                                        disabled={processingId === tool.id}
                                        className="flex-1 sm:flex-none w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 font-bold transition-colors disabled:opacity-50"
                                    >
                                        {processingId === tool.id ? <CircleDashed className="animate-spin" /> : <Check weight="bold" />}
                                        Aprovar
                                    </button>
                                    <button
                                        onClick={() => handleAction(tool.id, 'rejected')}
                                        disabled={processingId === tool.id}
                                        className="flex-1 sm:flex-none w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 font-bold transition-colors disabled:opacity-50"
                                    >
                                        {processingId === tool.id ? <CircleDashed className="animate-spin" /> : <X weight="bold" />}
                                        Rejeitar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
