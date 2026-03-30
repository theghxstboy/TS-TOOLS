"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Wand2 as MagicWand, ClipboardList as ClipboardText, Bot as Robot } from "lucide-react"
import { cn } from "@/lib/utils"

interface TutorialStep {
    title: string
    description: string
}

interface TutorialDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    pageTitle: string
    title?: string
    steps?: TutorialStep[]
}

const DEFAULT_STEPS: TutorialStep[] = [
    { title: "Escolha", description: "Selecione um nicho e configure os detalhes desejados." },
    { title: "Sistema Gera", description: "Nossa IA otimiza e estrutura o prompt perfeito para você." },
    { title: "Cole na IA", description: "Copie o resultado e cole no Midjourney, Kling ou Flux." },
]

function StepIcon({ index }: { index: number }) {
    const icons = [
        <MagicWand key="wand" size={32} className="text-primary" />,
        <Robot key="robot" size={32} />,
        <ClipboardText key="clip" size={32} className="text-primary" />,
    ]
    const wrappers = [
        "size-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shadow-lg",
        "size-16 rounded-2xl bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.3)]",
        "size-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shadow-lg",
    ]
    return (
        <div className={wrappers[index % wrappers.length]}>
            {icons[index % icons.length]}
        </div>
    )
}

export function TutorialDialog({ isOpen, onOpenChange, pageTitle, title, steps }: TutorialDialogProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false)

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem("ts-tools-hide-tutorial", "true")
        }
        onOpenChange(false)
    }

    const activeSteps = steps ?? DEFAULT_STEPS
    const gridCols =
        activeSteps.length === 2 ? "md:grid-cols-2" :
        activeSteps.length === 3 ? "md:grid-cols-3" :
        "md:grid-cols-4"

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border shadow-2xl p-0 overflow-hidden rounded-[2rem]">
                <div className="p-8">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MagicWand size={24} />
                            </div>
                            <DialogTitle className="text-2xl font-bold tracking-tight">
                                {title ?? (
                                    <>Como funciona o <span className="text-primary">{pageTitle}</span></>
                                )}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground mt-2">
                            Siga {activeSteps.length === 1 ? "este passo" : `estes ${activeSteps.length} passos`} para obter os melhores resultados.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Tutorial Steps */}
                    <div className={cn("grid grid-cols-1 gap-6 relative mb-10", gridCols)}>
                        {activeSteps.length > 1 && (
                            <div className="hidden md:block absolute top-[45px] left-[20%] right-[20%] h-0.5 z-0">
                                <Separator className="bg-gradient-to-r from-primary/50 via-primary/10 to-primary/50" />
                            </div>
                        )}

                        {activeSteps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-4 relative z-10">
                                <StepIcon index={i} />
                                <div>
                                    <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">
                                        {i + 1}. {step.title}
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 relative">
                        <Separator className="absolute top-0 left-0 right-0 bg-border" />
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
