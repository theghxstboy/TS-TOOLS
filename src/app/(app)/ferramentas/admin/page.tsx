"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tool } from "@/lib/tools"
import { BugReport } from "@/lib/bugs"
import { CodigosPost } from "@/lib/codigos"
import { 
    Check, X, ShieldCheck, History as ClockCounterClockwise, 
    CheckCircle2 as CheckCircle, XCircle, MoreHorizontal as DotsThree, 
    Trash2 as Trash, Pencil, LayoutGrid, Bug, Code2, AlertTriangle, AlertCircle, Wrench,
    RefreshCw, Search, Activity, Database, Zap
} from "lucide-react"
import { EditToolModal } from "@/components/EditToolModal"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { deleteCodigoAction } from "@/app/(app)/codigos/actions"

type TabType = 'tools' | 'bugs' | 'snippets';

export default function AdminFerramentasPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [activeTab, setActiveTab] = useState<TabType>('tools');
    
    const [tools, setTools] = useState<Tool[]>([]);
    const [bugs, setBugs] = useState<BugReport[]>([]);
    const [snippets, setSnippets] = useState<CodigosPost[]>([]);
    
    const [isLoadingAll, setIsLoadingAll] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [editingTool, setEditingTool] = useState<Tool | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, type: 'tool' | 'bug' | 'snippet', id: string | null }>({
        isOpen: false, type: 'tool', id: null
    });

    // Fetch all data for the global overview
    const fetchAllData = useCallback(async (showLoading = true) => {
        if (showLoading) setIsRefreshing(true);
        try {
            const [toolsRes, bugsRes, snippetsRes] = await Promise.all([
                fetch("/api/tools").then(r => r.json()),
                fetch("/api/bugs").then(r => r.json()),
                fetch("/api/codigos").then(r => r.json())
            ]);
            
            if (Array.isArray(toolsRes)) setTools(toolsRes);
            if (Array.isArray(bugsRes)) setBugs(bugsRes);
            if (Array.isArray(snippetsRes)) setSnippets(snippetsRes);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            toast.error("Erro ao sincronizar dados.");
        } finally {
            setIsLoadingAll(false);
            setIsRefreshing(false);
        }
    }, []);

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
            // Fetch everything at once for the initial overview
            fetchAllData(false);
        }
    }, [status, router, session, fetchAllData]);

    // Handlers
    const handleUpdateToolStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const res = await fetch(`/api/tools/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setTools(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
                toast.success(`Ferramenta ${newStatus === 'approved' ? 'Aprovada' : 'Rejeitada'}!`);
            }
        } catch (error) {
            console.error("Failed to update tool status", error);
        }
    };

    const handleUpdateBugStatus = async (id: string, newStatus: 'resolved' | 'in_progress' | 'pending') => {
        const previousBugs = [...bugs];
        setBugs(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

        try {
            const res = await fetch(`/api/bugs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error();
            toast.success(`Status do bug atualizado!`);
        } catch (error) {
            setBugs(previousBugs);
            toast.error("Falha ao atualizar status do bug.");
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        const { type, id } = deleteModal;

        try {
            if (type === 'tool') {
                const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
                if (res.ok) {
                    setTools(prev => prev.filter(t => t.id !== id));
                    toast.success("Ferramenta excluída.");
                }
            } else if (type === 'bug') {
                const res = await fetch(`/api/bugs/${id}`, { method: "DELETE" });
                if (res.ok) {
                    setBugs(prev => prev.filter(b => b.id !== id));
                    toast.success("Bug excluído.");
                }
            } else if (type === 'snippet') {
                await deleteCodigoAction(id);
                setSnippets(prev => prev.filter(s => s.id !== id));
                toast.success("Snippet excluído.");
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Erro ao excluir item.");
        } finally {
            setDeleteModal({ isOpen: false, type: 'tool', id: null });
        }
    };

    if (status === "loading" || isLoadingAll) {
        return (
            <div className="min-h-screen bg-input font-sans pt-32 px-6 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const pendingToolsCount = tools.filter(t => t.status === "pending").length;
    const pendingBugsCount = bugs.filter(b => b.status !== "resolved").length;
    const totalTools = tools.length;
    const totalSnippets = snippets.length;

    return (
        <div className="min-h-screen bg-input font-sans text-foreground pb-20">
            <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24">
                
                {/* Header Section with Stats */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-lg mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
                        Painel de Controle
                    </h1>
                    <p className="text-muted-foreground font-medium mb-8">Visão geral e gestão do sistema.</p>

                    {/* Stats Card - Global Overview */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative grid grid-cols-2 gap-4 bg-card p-4 rounded-3xl border border-border shadow-sm min-w-[320px]">
                            <div className="flex flex-col items-center px-6 py-3 border-r border-border">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Database size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Ferramentas</span>
                                </div>
                                <span className="text-2xl font-black">{totalTools}</span>
                            </div>
                            <div className="flex flex-col items-center px-6 py-3">
                                <div className="flex items-center gap-2 text-blue-500 mb-1">
                                    <Zap size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Snippets</span>
                                </div>
                                <span className="text-2xl font-black">{totalSnippets}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] border border-border/50 p-4 md:p-8">
                    {/* Tabs with Pulse Indicators */}
                    <div className="flex justify-center overflow-x-auto no-scrollbar gap-2 mb-12 bg-input/50 p-2 rounded-2xl border border-border/50">
                        <button 
                            onClick={() => setActiveTab('tools')}
                            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm shrink-0 cursor-pointer ${activeTab === 'tools' ? 'bg-card text-primary shadow-sm border border-border' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <Wrench size={18} />
                            Ferramentas ({pendingToolsCount})
                            {pendingToolsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card animate-pulse"></span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('bugs')}
                            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm shrink-0 cursor-pointer ${activeTab === 'bugs' ? 'bg-card text-red-500 shadow-sm border border-border' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <Bug size={18} />
                            Bugs ({pendingBugsCount})
                            {pendingBugsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card animate-pulse"></span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('snippets')}
                            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm shrink-0 cursor-pointer ${activeTab === 'snippets' ? 'bg-card text-blue-500 shadow-sm border border-border' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                            <Code2 size={18} />
                            Snippets ({snippets.length})
                        </button>
                        
                        <div className="ml-2 pl-2 border-l border-border/50 flex items-center">
                            <button 
                                onClick={() => fetchAllData(true)}
                                className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all cursor-pointer"
                                title="Sincronizar Tudo"
                            >
                                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    <div className="animate-fade-in">
                        {/* ════════════ TOOLS TAB ════════════ */}
                        {activeTab === 'tools' && (
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                        <ClockCounterClockwise size={20} className="text-amber-500" />
                                        Sugestões Pendentes ({pendingToolsCount})
                                    </h2>
                                    {tools.filter(t => t.status === 'pending').length === 0 ? (
                                        <div className="text-center py-16 bg-input/20 rounded-3xl border border-border border-dashed">
                                            <p className="text-muted-foreground font-medium">Nenhuma sugestão pendente de análise.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {tools.filter(t => t.status === 'pending').map(tool => (
                                                <div key={tool.id} className="bg-card border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] transition-all">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-bold text-foreground">{tool.title}</h3>
                                                            <span className="px-2 py-0.5 rounded bg-input text-muted-foreground text-[0.65rem] font-bold uppercase tracking-wider">{tool.category}</span>
                                                        </div>
                                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{tool.description}</p>
                                                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline flex items-center gap-1.5 font-medium max-w-[400px] truncate">{tool.url}</a>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <button onClick={() => handleUpdateToolStatus(tool.id, 'rejected')} className="flex flex-col items-center justify-center p-3 w-20 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all gap-1 cursor-pointer">
                                                            <X size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Rejeitar</span>
                                                        </button>
                                                        <button onClick={() => handleUpdateToolStatus(tool.id, 'approved')} className="flex flex-col items-center justify-center p-3 w-20 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all gap-1 cursor-pointer">
                                                            <Check size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Aprovar</span>
                                                        </button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className="p-2 ml-2 rounded-xl bg-card border border-border hover:bg-input transition-colors outline-none shrink-0 cursor-pointer" title="Opções"><DotsThree size={24} className="text-muted-foreground" /></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onSelect={() => { setEditingTool(tool); setIsEditModalOpen(true); }} className="cursor-pointer gap-2 py-2.5"><Pencil size={18} /> Editar</DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => setDeleteModal({ isOpen: true, type: 'tool', id: tool.id })} className="cursor-pointer gap-2 py-2.5 text-red-500"><Trash size={18} /> Excluir</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                                <section className="pt-8">
                                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-muted-foreground/50 font-medium">Histórico de Atividade</h2>
                                    <div className="grid gap-3 opacity-60 hover:opacity-100 transition-opacity duration-500">
                                        {tools.filter(t => t.status !== 'pending').map(tool => (
                                            <div key={tool.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-foreground text-sm">{tool.title}</h4>
                                                        <span className="px-2 py-0.5 rounded bg-input text-muted-foreground text-[0.6rem] uppercase tracking-wider">{tool.category}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate max-w-lg">{tool.description}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-4">
                                                    {tool.status === 'approved' ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-500 text-[10px] font-bold border border-emerald-500/10"><CheckCircle size={14} /> Aprovada</div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/5 text-red-500 text-[10px] font-bold border border-red-500/10"><XCircle size={14} /> Rejeitada</div>
                                                    )}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-input transition-colors outline-none cursor-pointer"><DotsThree size={20} className="text-muted-foreground" /></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onSelect={() => setDeleteModal({ isOpen: true, type: 'tool', id: tool.id })} className="cursor-pointer gap-2 text-red-500"><Trash size={18} /> Excluir</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* ════════════ BUGS TAB ════════════ */}
                        {activeTab === 'bugs' && (
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                        <AlertTriangle size={20} className="text-red-500" />
                                        Bugs em Aberto ({pendingBugsCount})
                                    </h2>
                                    {bugs.filter(b => b.status !== 'resolved').length === 0 ? (
                                        <div className="text-center py-16 bg-input/20 rounded-3xl border border-border border-dashed">
                                            <p className="text-muted-foreground font-medium">Nenhum bug pendente! Sistema estável.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {bugs.filter(b => b.status !== 'resolved').map(bug => (
                                                <div key={bug.id} className="bg-card border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.05)] rounded-2xl p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-bold text-foreground">{bug.title}</h3>
                                                            <span className={`px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wider ${
                                                                bug.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                                                                bug.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                                                bug.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                                                                'bg-blue-500/20 text-blue-500'
                                                            }`}>{bug.severity}</span>
                                                        </div>
                                                        <p className="text-muted-foreground text-sm mb-4 whitespace-pre-wrap">{bug.description}</p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-input/50 p-3 rounded-xl border border-border w-fit">
                                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">{bug.userEmail.charAt(0).toUpperCase()}</div>
                                                            <span className="font-bold text-foreground">{bug.userEmail}</span> • {new Date(bug.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <button onClick={() => handleUpdateBugStatus(bug.id, 'resolved')} className="flex flex-col items-center justify-center p-3 w-24 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all gap-1 cursor-pointer">
                                                            <CheckCircle size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest">Resolver</span>
                                                        </button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className="p-2 rounded-xl bg-card border border-border hover:bg-input transition-colors outline-none cursor-pointer" title="Opções"><DotsThree size={24} className="text-muted-foreground" /></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onSelect={() => setDeleteModal({ isOpen: true, type: 'bug', id: bug.id })} className="cursor-pointer gap-2 py-2.5 text-red-500"><Trash size={18} /> Excluir</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                                
                                <section className="pt-12 mt-12 border-t border-border/50">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground/70">
                                                <ClockCounterClockwise size={20} className="text-muted-foreground" />
                                                Arquivo de Bugs Resolvidos
                                            </h2>
                                            <p className="text-xs text-muted-foreground mt-1">Registros históricos de problemas solucionados.</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                            {bugs.filter(b => b.status === 'resolved').length} itens
                                        </span>
                                    </div>

                                    {bugs.filter(b => b.status === 'resolved').length === 0 ? (
                                        <div className="text-center py-12 bg-input/10 rounded-3xl border border-border border-dashed">
                                            <p className="text-muted-foreground text-sm">Nenhum bug resolvido no histórico.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-3">
                                            {bugs.filter(b => b.status === 'resolved').map(bug => (
                                                <div key={bug.id} className="bg-card/50 border border-border/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-card transition-all">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="font-bold text-foreground/60 text-sm line-through decoration-muted-foreground/30">{bug.title}</h4>
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase border border-emerald-500/20">
                                                                <CheckCircle size={10} /> Resolvido
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-2xl">{bug.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-muted-foreground/50 font-medium italic">
                                                            {new Date(bug.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className="p-2 rounded-xl hover:bg-muted transition-colors outline-none cursor-pointer"><DotsThree size={20} className="text-muted-foreground" /></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onSelect={() => handleUpdateBugStatus(bug.id, 'pending')} className="cursor-pointer gap-2 py-2.5">
                                                                    <AlertCircle size={18} className="text-amber-500" /> Reabrir Bug
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => setDeleteModal({ isOpen: true, type: 'bug', id: bug.id })} className="cursor-pointer gap-2 py-2.5 text-red-500">
                                                                    <Trash size={18} /> Excluir Definitivamente
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {/* ════════════ SNIPPETS TAB ════════════ */}
                        {activeTab === 'snippets' && (
                            <section>
                                <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-blue-500">
                                    <Code2 size={20} />
                                    Biblioteca de Códigos ({snippets.length})
                                </h2>
                                <div className="grid gap-3">
                                    {snippets.map(snippet => (
                                        <div key={snippet.id} className="bg-card border border-border hover:border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-foreground text-sm">{snippet.title}</h4>
                                                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[0.6rem] uppercase tracking-wider font-bold">{snippet.language}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate max-w-lg">Por: {snippet.author} • {new Date(snippet.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="shrink-0">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="p-2 rounded-lg bg-card border border-border hover:bg-input transition-colors outline-none cursor-pointer"><DotsThree size={20} className="text-muted-foreground" /></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onSelect={() => setDeleteModal({ isOpen: true, type: 'snippet', id: snippet.id })} className="cursor-pointer gap-2 text-red-500 py-2"><Trash size={18} /> Excluir</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            <EditToolModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} tool={editingTool} onSuccess={() => fetchAllData(true)} />
            <ConfirmDialog isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, type: 'tool', id: null })} onConfirm={confirmDelete} title="Excluir Item" description="Tem certeza que deseja excluir este item permanentemente? Esta ação não pode ser desfeita." confirmText="Excluir" variant="destructive" />
        </div>
    )
}
