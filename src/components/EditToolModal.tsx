"use client"

import { useState, useEffect } from "react"
import { Tool } from "@/lib/tools"
import { Check } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface EditToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: Tool | null;
    onSuccess: () => void;
}

export function EditToolModal({ isOpen, onClose, tool, onSuccess }: EditToolModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("Outros");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (tool && isOpen) {
            setTitle(tool.title);
            setDescription(tool.description);
            setUrl(tool.url);
            setCategory(tool.category);
            setFormError("");
        }
    }, [tool, isOpen]);

    if (!tool) return null;

    const inputClass = "w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all placeholder:text-muted-foreground/50";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError("");

        try {
            const res = await fetch(`/api/tools/${tool.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, url, category }),
            });

            if (res.ok) {
                toast.success("Ferramenta atualizada com sucesso!");
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                const msg = data.error || "Erro ao atualizar a ferramenta.";
                setFormError(msg);
                toast.error(msg);
            }
        } catch {
            const msg = "Erro de conexão. Tente novamente.";
            setFormError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-card border-border shadow-2xl rounded-3xl p-6 md:p-8 [&>button]:right-6 [&>button]:top-6">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-bold text-foreground text-left">
                        Editar Ferramenta
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm text-left">
                        Atualize os detalhes desta sugestão de ferramenta.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {formError && (
                        <p className="text-red-500 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {formError}
                        </p>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Nome da ferramenta</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Ex: Midjourney" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Link oficial</label>
                        <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="https://..." />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Categoria</label>
                        <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="Ex: SEO, Marketing..." />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Descrição</label>
                        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className={cn(inputClass, "resize-none")} rows={3} placeholder="Para que serve essa ferramenta?" />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSubmitting
                                ? "bg-input text-muted-foreground cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/20 active:scale-95"
                        )}
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><Check size={18} /> Salvar Alterações</>
                        )}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
