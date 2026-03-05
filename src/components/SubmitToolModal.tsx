"use client"

import { useState } from "react"
import { Plus, X, Link as LinkIcon, Briefcase, FileText, MapPinLine, Image as ImageIcon, VideoCamera, Target } from "@phosphor-icons/react"
import { useSession } from "next-auth/react"

interface SubmitToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function SubmitToolModal({ isOpen, onClose, onSuccess }: SubmitToolModalProps) {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        category: "Marketing", // Default category
    });

    if (!isOpen) return null;

    if (!session) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200 p-8 text-center">
                    <h2 className="text-xl font-bold text-foreground mb-4">Acesso Restrito</h2>
                    <p className="text-muted-foreground mb-6">
                        Você precisa estar logado para sugerir novas ferramentas para a comunidade.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Voltar
                        </button>
                        <a href="/login?callbackUrl=/ferramentas" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">
                            Fazer Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const categories = [
        { id: "Marketing", name: "Marketing & SEO", icon: Target },
        { id: "Design", name: "Design & UX", icon: ImageIcon },
        { id: "Video", name: "Vídeo & Animação", icon: VideoCamera },
        { id: "Productivity", name: "Produtividade", icon: Briefcase },
        { id: "AI", name: "Inteligência Artificial", icon: Target },
        { id: "Other", name: "Outros", icon: Plus },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Falha ao enviar ferramenta");
            }

            onSuccess();
            onClose();
            setFormData({ title: "", description: "", url: "", category: "Marketing" });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border bg-input/50">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Plus size={24} className="text-primary" weight="bold" />
                        Sugerir Ferramenta
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-input text-muted-foreground transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5 pl-1">
                                Nome da Ferramenta
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Ex: Midjourney, Notion, etc."
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/50"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5 pl-1">
                                Link de Acesso (URL)
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    required
                                    type="url"
                                    placeholder="https://"
                                    className="w-full bg-input border border-border rounded-xl pl-11 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5 pl-1">
                                Categoria
                            </label>
                            <select
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1.5 pl-1">
                                Descrição Breve
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Para que serve? Por que é útil para a comunidade?"
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-input transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[140px]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Enviando..." : "Enviar Sugestão"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
