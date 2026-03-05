"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MagicWand, ArrowRight, ClipboardText, Robot, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface TutorialDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    pageTitle: string
}

export function TutorialDialog({ isOpen, onOpenChange, pageTitle }: TutorialDialogProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false)

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem("ts-tools-hide-tutorial", "true")
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border shadow-2xl p-0 overflow-hidden rounded-[2rem]">
                <div className="p-8">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <MagicWand size={24} weight="fill" />
                                </div>
                                <DialogTitle className="text-2xl font-bold tracking-tight">
                                    Como funciona o <span className="text-primary">{pageTitle}</span>
                                </DialogTitle>
                            </div>
                        </div>
                        <DialogDescription className="text-muted-foreground mt-2">
                            Siga estes 3 passos simples para obter os melhores resultados cinematográficos.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Tutorial Steps Visual Flow */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-10">
                        {/* Connecting Lines (Desktop) */}
                        <div className="hidden md:block absolute top-[45px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/50 via-primary/10 to-primary/50 z-0" />

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center gap-4 relative z-10">
                            <div className="size-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shadow-lg group-hover:scale-110 transition-transform">
                                <MagicWand size={32} weight="duotone" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">1. Escolha</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">Selecione um nicho e configure os detalhes desejados.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center gap-4 relative z-10">
                            <div className="size-16 rounded-2xl bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                                <Robot size={32} weight="fill" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">2. Sistema Gera</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">Nossa IA otimiza e estrutura o prompt perfeito para você.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center gap-4 relative z-10">
                            <div className="size-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shadow-lg">
                                <ClipboardText size={32} weight="duotone" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">3. Cole na IA</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">Copie o resultado e cole no Midjourney, Kling ou Flux.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border">
                        <div className="flex items-center space-x-2 cursor-pointer group">
                            <Checkbox
                                id="dontShow"
                                checked={dontShowAgain}
                                onCheckedChange={(checked) => setDontShowAgain(!!checked)}
                                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label
                                htmlFor="dontShow"
                                className="text-xs font-medium text-muted-foreground cursor-pointer group-hover:text-foreground transition-colors"
                            >
                                Não mostrar isso novamente
                            </label>
                        </div>
                        <Button
                            onClick={handleClose}
                            className="w-full sm:w-auto px-10 py-6 rounded-xl font-bold text-base shadow-lg hover:shadow-primary/20 transition-all"
                        >
                            Vamos começar!
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
