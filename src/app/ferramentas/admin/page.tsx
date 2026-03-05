"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tool } from "@/lib/tools"
import { ArrowLeft, Check, X, ShieldCheck, ClockCounterClockwise, CheckCircle, XCircle, DotsThree, Trash, PencilSimple } from "@phosphor-icons/react"
import { EditToolModal } from "@/components/EditToolModal"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminFerramentasPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTool, setEditingTool] = useState<Tool | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/ferramentas/admin");
            return;
        }

        if (status === "authenticated") {
            if ((session?.user as any)?.role !== "admin") {
                router.push("/ferramentas");
                return;
            }
            fetchTools();
        }
    }, [status, router, session]);

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

    const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const res = await fetch(`/api/tools/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh list
                fetchTools();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDeleteTool = async (id: string) => {
        try {
            // Removendo o window.confirm que pode estar travando o estado do Next e Radix
            const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchTools();
            } else {
                const text = await res.text();
                alert("Erro ao excluir. O servidor retornou: " + text);
            }
        } catch (error) {
            console.error("Failed to delete tool", error);
            alert("Erro de conexão ao excluir.");
        }
    };

    const openEditModal = (tool: Tool) => {
        setEditingTool(tool);
        setIsEditModalOpen(true);
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-input font-sans pt-32 px-6 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const pendingTools = tools.filter(t => t.status === "pending");
    const evaluatedTools = tools.filter(t => t.status !== "pending");

    return (
        <div className="min-h-screen bg-input font-sans text-foreground pb-20">
            <div className="max-w-5xl mx-auto px-6 pt-16 md:pt-24">
                <Link href="/ferramentas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm mb-8 group">
                    <ArrowLeft size={18} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Hub
                </Link>

                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                        <ShieldCheck size={28} weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                            Painel de Aprovação (Admin)
                        </h1>
                        <p className="text-muted-foreground font-medium">Avalie as sugestões de ferramentas da comunidade.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Pending Tools */}
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <ClockCounterClockwise size={20} className="text-amber-500" />
                            Aguardando Análise ({pendingTools.length})
                        </h2>

                        {pendingTools.length === 0 ? (
                            <div className="text-center py-16 bg-card rounded-3xl border border-border border-dashed">
                                <p className="text-muted-foreground">Nenhuma sugestão pendente de análise.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {pendingTools.map(tool => (
                                    <div key={tool.id} className="bg-card border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                                                    {tool.title}
                                                </h3>
                                                <span className="px-2 py-0.5 rounded bg-input text-muted-foreground text-[0.65rem] font-bold uppercase tracking-wider">
                                                    {tool.category}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                                                {tool.description}
                                            </p>
                                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline flex items-center gap-1.5 font-medium max-w-[400px] truncate">
                                                Link original da sugestão
                                            </a>
                                            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                                                    {tool.submittedBy.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-xs text-muted-foreground font-medium">Ao enviar: <span className="text-foreground">{tool.submittedBy}</span></span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <button
                                                onClick={() => handleUpdateStatus(tool.id, 'rejected')}
                                                className="flex flex-col items-center justify-center p-3 w-20 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all gap-1 group"
                                            >
                                                <X size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Rejeitar</span>
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(tool.id, 'approved')}
                                                className="flex flex-col items-center justify-center p-3 w-20 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all gap-1 group"
                                            >
                                                <Check size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Aprovar</span>
                                            </button>

                                            {/* Options Dropdown */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="p-2 ml-2 rounded-xl bg-card border border-border hover:bg-input transition-colors outline-none shrink-0" title="Opções">
                                                    <DotsThree size={24} weight="bold" className="text-muted-foreground" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 font-inter">
                                                    <DropdownMenuItem onSelect={() => openEditModal(tool)} className="cursor-pointer gap-2 py-2.5">
                                                        <PencilSimple size={18} weight="bold" /> Editar Ferramenta
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleDeleteTool(tool.id)} className="cursor-pointer gap-2 py-2.5 text-red-500 focus:text-red-500">
                                                        <Trash size={18} weight="bold" /> Excluir Sugestão
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Evaluated Tools History */}
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-muted-foreground">
                            Histórico de Avaliações ({evaluatedTools.length})
                        </h2>

                        <div className="grid gap-3 opacity-60 hover:opacity-100 transition-opacity duration-500">
                            {evaluatedTools.map(tool => (
                                <div key={tool.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-foreground text-sm">{tool.title}</h4>
                                            <span className="px-2 py-0.5 rounded bg-input text-muted-foreground text-[0.6rem] uppercase tracking-wider">
                                                {tool.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate max-w-lg">{tool.description}</p>
                                    </div>
                                    <div className="shrink-0 flex items-center">
                                        {tool.status === 'approved' ? (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-500 text-[10px] font-bold border border-emerald-500/10">
                                                <CheckCircle size={14} weight="bold" /> Aprovada
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/5 text-red-500 text-[10px] font-bold border border-red-500/10">
                                                <XCircle size={14} weight="bold" /> Rejeitada
                                            </div>
                                        )}

                                        {/* Options Dropdown for Evaluated */}
                                        <div className="ml-4 shrink-0 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-input transition-colors outline-none" title="Opções">
                                                    <DotsThree size={20} weight="bold" className="text-muted-foreground" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 font-inter">
                                                    <DropdownMenuItem onSelect={() => openEditModal(tool)} className="cursor-pointer gap-2 py-2.5">
                                                        <PencilSimple size={18} weight="bold" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleDeleteTool(tool.id)} className="cursor-pointer gap-2 py-2.5 text-red-500 focus:text-red-500">
                                                        <Trash size={18} weight="bold" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Edit Modal Component */}
            <EditToolModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                tool={editingTool}
                onSuccess={() => {
                    fetchTools();
                }}
            />
        </div>
    )
}
