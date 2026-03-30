"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Copy, Check, X, Upload, Sparkles } from "lucide-react"

interface CopyWorkflowPopupProps {
    open: boolean
    onClose: () => void
    prompt: string
    /** Se passada, exibe o passo de upload da imagem */
    referenceImageUrl?: string
    /** Rótulo do passo de imagem, ex: "Foto de Referência", "Foto Antes" */
    imageLabel?: string
}

export function CopyWorkflowPopup({
    open,
    onClose,
    prompt,
    referenceImageUrl,
    imageLabel = "Foto de Referência",
}: CopyWorkflowPopupProps) {
    const [copiedType, setCopiedType] = useState<"prompt" | "image" | null>(null)

    if (!open) return null

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(prompt)
        setCopiedType("prompt")
        setTimeout(() => setCopiedType(null), 2000)
    }

    const copyImageToClipboard = async (dataUrl: string) => {
        try {
            // Criar imagem temporária para desenhar no Canvas (resolve suporte a JPEG)
            const img = new Image()
            img.crossOrigin = "anonymous" // Evita problemas de CORS se a URL for externa
            img.src = dataUrl
            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            ctx.drawImage(img, 0, 0)

            // Converter para PNG (formato universalmente aceito no clipboard)
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob((b) => resolve(b), "image/png")
            )
            if (!blob) return

            const item = new ClipboardItem({ "image/png": blob })
            await navigator.clipboard.write([item])
            
            setCopiedType("image")
            setTimeout(() => setCopiedType(null), 2000)
        } catch (err) {
            console.error("Erro ao copiar imagem:", err)
        }
    }

    const hasImage = !!referenceImageUrl
    const cols = hasImage ? "md:grid-cols-2" : "md:grid-cols-1"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-[900px] max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex items-center justify-between shrink-0 border-b border-black/10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-black/10 flex items-center justify-center">
                            <Sparkles size={24} className="text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-black uppercase tracking-tight leading-none">
                                Workflow de Finalização
                            </h2>
                            <p className="text-black/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                                Siga os passos e cole diretamente no ChatGPT/Claude
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-black hover:bg-black/10 rounded-full h-10 w-10"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </Button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className={cn("grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-zinc-800 h-full min-h-[400px]", cols)}>

                        {/* PASSO 1: PROMPT */}
                        <div className="p-6 lg:p-10 flex flex-col gap-6 bg-zinc-950 min-h-[400px]">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-primary text-black flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 shrink-0">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Copiar Prompt</h3>
                            </div>

                            <div className="flex-1 min-h-[250px] relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-inner group">
                                <Textarea
                                    className="absolute inset-0 w-full h-full bg-transparent border-none text-[12px] text-zinc-300 font-mono p-5 leading-relaxed focus-visible:ring-0 resize-none custom-scrollbar"
                                    readOnly
                                    value={prompt}
                                />
                            </div>

                            <Button
                                onClick={handleCopyPrompt}
                                className={cn(
                                    "w-full py-7 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3",
                                    copiedType === "prompt"
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "bg-primary hover:bg-orange-500 text-black"
                                )}
                            >
                                {copiedType === "prompt" ? <Check size={20} /> : <Copy size={20} />}
                                <span>{copiedType === "prompt" ? "Copiado!" : "Copiar Prompt"}</span>
                            </Button>
                        </div>

                        {/* PASSO 2: IMAGEM (opcional) */}
                        {hasImage && (
                            <div className="p-6 lg:p-10 flex flex-col gap-6 bg-zinc-900/20">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 shrink-0">
                                        2
                                    </div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                                        Anexar {imageLabel}
                                    </h3>
                                </div>

                                <div className="flex-1 flex flex-col gap-6">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-3 shadow-xl">
                                        <img
                                            src={referenceImageUrl}
                                            alt={imageLabel}
                                            className="max-w-full max-h-full object-contain rounded-lg"
                                        />
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                                            {imageLabel}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => copyImageToClipboard(referenceImageUrl!)}
                                        className={cn(
                                            "w-full py-7 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3",
                                            copiedType === "image"
                                                ? "bg-green-600 text-white hover:bg-green-700"
                                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                        )}
                                    >
                                        {copiedType === "image" ? <Check size={20} /> : <Copy size={20} />}
                                        <span>{copiedType === "image" ? "Foto Copiada!" : "Copiar Esta Foto"}</span>
                                    </Button>

                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
                                        <Upload size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-zinc-400 leading-relaxed">
                                            <strong className="text-blue-400">Como usar:</strong> Cole o prompt no ChatGPT/Claude e{" "}
                                            <strong className="text-white">arraste ou cole esta imagem</strong> na mesma mensagem antes de enviar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Check size={14} className="text-primary" />
                        Processo finalizado? Basta colar e pronto!
                    </p>
                    <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={onClose}>
                        Fechar Popup
                    </Button>
                </div>
            </div>
        </div>
    )
}
