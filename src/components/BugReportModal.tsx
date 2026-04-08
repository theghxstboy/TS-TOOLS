import { useState } from "react"
import { Bug, Send, Loader2, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BugReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [severity, setSeverity] = useState<string>("medium")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (title.length < 5) return toast.error("Por favor, forneça um título mais claro.")
        if (description.length < 10) return toast.error("Por favor, detalhe melhor o problema.")

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/bugs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, severity })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Erro ao registrar bug")

            toast.success("Obrigado por reportar! A equipe já foi notificada.")
            // Reset
            setTitle("")
            setDescription("")
            setSeverity("medium")
            onClose()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card border-border">
                <div className="bg-red-500/10 p-6 flex items-center justify-between border-b border-red-500/20">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                            <Bug size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-foreground uppercase tracking-tight">Reportar Bug</DialogTitle>
                            <DialogDescription className="text-xs text-red-500/80 font-bold uppercase tracking-wider mt-1">
                                SISTEMA DE TICKETS INTERNO
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                                Título do Problema <span className="text-red-500">*</span>
                            </Label>
                            <Input 
                                placeholder="Ex: O botão de copiar do gerador não funciona..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-12 bg-background border-border placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest flex justify-between">
                                <span>Descrição detalhada <span className="text-red-500">*</span></span>
                                <span className="text-[10px] text-muted-foreground/50">{description.length}/3000</span>
                            </Label>
                            <Textarea 
                                placeholder="Descreva os passos para reproduzir, em qual navegador ou qual erro apareceu na tela..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px] resize-none bg-background border-border placeholder:text-muted-foreground/50 leading-relaxed"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                                Gravidade / Impacto <span className="text-red-500">*</span>
                            </Label>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger className="h-14 bg-background border-border px-4 transition-all">
                                    <SelectValue placeholder="Selecione a gravidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">
                                        <div className="flex items-center gap-2">
                                            <Info size={16} className="text-blue-500" />
                                            <span>Baixa (UI/Texto ou pequeno erro)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle size={16} className="text-amber-500" />
                                            <span>Média (Funcionalidade não opera como deveria)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="high">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={16} className="text-orange-500" />
                                            <span>Alta (Causa block/impedimento de trabalho)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="critical">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={16} className="text-red-500" />
                                            <span className="font-bold text-red-500">Crítica (Crash, perda de dados ou erro no DB)</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold tracking-widest uppercase gap-2 px-8 shadow-lg shadow-red-500/20"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            Enviar Report
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
