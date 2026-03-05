import { useState, useEffect } from "react"
import { Tool } from "@/lib/tools"
import { Check } from "@phosphor-icons/react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

export function cn(...inputs: ClassValue[]) {
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
    const [error, setError] = useState("");

    useEffect(() => {
        if (tool && isOpen) {
            setTitle(tool.title);
            setDescription(tool.description);
            setUrl(tool.url);
            setCategory(tool.category);
            setError("");
        }
    }, [tool, isOpen]);

    if (!tool) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch(`/api/tools/${tool.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, url, category }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                setError(data.error || "Ocorreu um erro ao atualizar a ferramenta.");
            }
        } catch (err) {
            setError("Ocorreu um erro ao atualizar a ferramenta.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-card border-border shadow-2xl rounded-3xl p-6 md:p-8 [&>button]:right-6 [&>button]:top-6">
                <DialogHeader className="mb-8">
                    <DialogTitle className="text-2xl font-bold text-foreground mb-2 text-left">
                        Editar Ferramenta
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm text-left">
                        Atualize os detalhes desta sugestão de ferramenta.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Nome da ferramenta</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Ex: Midjourney"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Link oficial</label>
                        <input
                            type="url"
                            required
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Categoria Principal</label>
                        <input
                            type="text"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Ex: SEO, Marketing..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Descrição / Aplicação</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            rows={3}
                            placeholder="Para que serve essa ferramenta de forma direta?"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg mt-8",
                            isSubmitting
                                ? "bg-input text-muted-foreground cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90 text-black shadow-primary/20"
                        )}
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Check size={20} weight="bold" />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
