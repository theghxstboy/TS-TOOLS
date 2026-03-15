"use client"

import { useState, useEffect, Suspense } from "react"
import {
    CheckCircle2 as CheckCircle,
    Video,
    Info,
    Play,
    Check,
    Terminal as TerminalWindow,
    Film as FilmStrip,
    Wand2 as MagicWand,
    Copy,
    HelpCircle as Question,
    Star
} from "lucide-react"
import { TutorialDialog } from "@/components/TutorialDialog"
import { useFavorites } from "@/hooks/useFavorites"
import { GenerationHistory } from "@/components/GenerationHistory"
import { FloatingHelpButton } from "@/components/FloatingHelpButton"
import { useGenerationHistory } from "@/hooks/useGenerationHistory"
import { HistoryItem } from "@/types/generator"
import { useSearchParams } from "next/navigation"
import { useClipboard } from "@/hooks/useClipboard"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PRESETS_VIDEO } from "@/constants/presets"

interface VideoPayload {
    mode: "simple" | "advanced";
    niche?: string;
    nicheOther?: string;
    motion?: string;
    motionOther?: string;
    angle?: string;
    angleOther?: string;
    lens?: string;
    lensOther?: string;
    speed?: string;
    speedOther?: string;
    action?: string;
    negative?: string;
}

function GeradorVideoContent() {
    const [isTutorialOpen, setIsTutorialOpen] = useState(false)

    useEffect(() => {
    }, [])
    const [selectedPreset, setSelectedPreset] = useState<string>("")
    const [mode, setMode] = useState<"simple" | "advanced">("simple")

    // Macro States
    const [niche, setNiche] = useState("residential interior")
    const [nicheOther, setNicheOther] = useState("")
    const [motion, setMotion] = useState("Slow Dolly Push-in")
    const [motionOther, setMotionOther] = useState("")
    const [angle, setAngle] = useState("Eye-level Angle")
    const [angleOther, setAngleOther] = useState("")
    const [lens, setLens] = useState("Cinematic 35mm lens, beautiful shallow depth of field, sharp focus")
    const [lensOther, setLensOther] = useState("")
    const [speed, setSpeed] = useState("Real-time default speed")
    const [speedOther, setSpeedOther] = useState("")

    const [action, setAction] = useState("")
    const [negative, setNegative] = useState("")

    // Global State
    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const { isCopied, copy } = useClipboard()

    const { history, saveHistory } = useGenerationHistory<VideoPayload>("gerador-video")
    const { isFavorited, toggleFavorite } = useFavorites()
    const searchParams = useSearchParams()

    const handleRestore = (item: HistoryItem<VideoPayload>) => {
        const p = item.payload;
        if (!p) return;

        setMode(p.mode || "simple");
        setNiche(p.niche || "residential interior");
        setNicheOther(p.nicheOther || "");
        setMotion(p.motion || "Slow Dolly Push-in");
        setMotionOther(p.motionOther || "");
        setAngle(p.angle || "Eye-level Angle");
        setAngleOther(p.angleOther || "");
        setLens(p.lens || "Cinematic 35mm lens, beautiful shallow depth of field, sharp focus");
        setLensOther(p.lensOther || "");
        setSpeed(p.speed || "Real-time default speed");
        setSpeedOther(p.speedOther || "");
        setAction(p.action || "");
        setNegative(p.negative || "");
    };

    // Handle Restore Effect
    useEffect(() => {
        const restoreId = searchParams.get('restore_id')
        if (restoreId && history.length > 0) {
            const itemToRestore = history.find((item: HistoryItem<VideoPayload>) => item.id === restoreId)
            if (itemToRestore) {
                handleRestore(itemToRestore)
            }
        }
    }, [searchParams, history])

    const handlePresetClick = (id: string) => {
        setSelectedPreset(id);
        const preset = PRESETS_VIDEO.find(p => p.id === id);
        if (preset) {
            setMode("simple");
            setNiche(preset.data.niche);
            setMotion(preset.data.motion);
            setAngle(preset.data.angle);
            setLens(preset.data.lens);
            setSpeed(preset.data.speed);
            setAction(preset.data.action);

            setNicheOther("");
            setMotionOther("");
            setAngleOther("");
            setLensOther("");
            setSpeedOther("");
        }
    }

    const handleGenerate = () => {
        if (!action && mode === 'simple') {
            alert("Por favor, descreva a ação que acontece no vídeo.")
            return
        }

        setIsGenerating(true)

        if (mode === 'simple') {
            let promptParts: string[] = []

            const finalNiche = niche === 'other' ? nicheOther : niche
            const finalMotion = motion === 'other' ? motionOther : motion
            const finalAngle = angle === 'other' ? angleOther : angle
            const finalLens = lens === 'other' ? lensOther : lens
            const finalSpeed = speed === 'other' ? speedOther : speed

            // Motion and Angle first for direction
            if (finalMotion || finalAngle) {
                promptParts.push(`${[finalMotion, finalAngle].filter(Boolean).join(', ')}.`)
            }

            // Core Action and Niche
            promptParts.push(`A cinematic video showing ${action}`)
            if (finalNiche) promptParts.push(`in a ${finalNiche}.`)
            else promptParts.push(`.`)

            // Quality and Speed
            if (finalLens || finalSpeed) {
                promptParts.push(`Shot styling: ${[finalLens, finalSpeed].filter(Boolean).join(', ')}.`)
            }

            setGeneratedPrompt(promptParts.join(' '))
        } else {
            const finalPromptObj = action + (negative ? `\n\n[NEGATIVE]: ${negative}` : "")
            setGeneratedPrompt(finalPromptObj)
        }

        setTimeout(() => {
            setIsGenerating(false)
            // Determine final prompt since state update might not have applied yet
            let finalStr = ""
            if (mode === 'simple') {
                const finalNiche = niche === 'other' ? nicheOther : niche
                const finalMotion = motion === 'other' ? motionOther : motion
                const finalAngle = angle === 'other' ? angleOther : angle
                const finalLens = lens === 'other' ? lensOther : lens
                const finalSpeed = speed === 'other' ? speedOther : speed

                let promptParts: string[] = []
                if (finalMotion || finalAngle) promptParts.push(`${[finalMotion, finalAngle].filter(Boolean).join(', ')}.`)
                promptParts.push(`A cinematic video showing ${action}`)
                if (finalNiche) promptParts.push(`in a ${finalNiche}.`)
                else promptParts.push(`.`)
                if (finalLens || finalSpeed) promptParts.push(`Shot styling: ${[finalLens, finalSpeed].filter(Boolean).join(', ')}.`)

                finalStr = promptParts.join(' ')
            } else {
                finalStr = action + (negative ? `\n\n[NEGATIVE]: ${negative}` : "")
            }

            saveHistory({
                mode, niche, nicheOther, motion, motionOther, angle, angleOther,
                lens, lensOther, speed, speedOther, action, negative
            }, finalStr)
        }, 800)
    }

    const handleCopy = () => copy(generatedPrompt)

    const handleClear = () => {
        setNiche("residential interior")
        setNicheOther("")
        setMotion("Slow Dolly Push-in")
        setMotionOther("")
        setAngle("Eye-level Angle")
        setAngleOther("")
        setLens("Cinematic 35mm lens, beautiful shallow depth of field, sharp focus")
        setLensOther("")
        setSpeed("Real-time default speed")
        setSpeedOther("")
        setAction("")
        setNegative("")
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    return (
        <div className="flex-1 w-full bg-input/50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="flex items-center gap-4 justify-center mb-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-primary flex items-center justify-center text-black shadow-lg relative group">
                            <TerminalWindow size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                                    Gerador de <span className="text-primary text-xl">Vídeo ↓</span>
                                </h1>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">DIRECTOR MODE SYSTEM</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Gere roteiros técnicos e prompts de cena otimizados para <span className="text-foreground">Luma, Kling e Runway Gen-3</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column Wrapper */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Presets Gallery */}
                        <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-2xl overflow-hidden relative">
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Cenas Prontas (Presets) <span className="text-blue-500 text-xl">↓</span>
                                </h2>
                                <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                    Preenche Auto
                                </span>
                            </div>

                            <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar relative z-10 snap-x snap-mandatory">
                                {PRESETS_VIDEO.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handlePresetClick(preset.id)}
                                        className={cn(
                                            "relative w-[145px] h-[110px] shrink-0 rounded-2xl overflow-hidden group text-left border-2 transition-all p-3 flex flex-col justify-end bg-input/50 snap-start",
                                            selectedPreset === preset.id ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] z-10 scale-[1.02]" : "border-transparent border hover:border-border/50"
                                        )}
                                    >
                                        <img
                                            src={preset.image}
                                            alt={preset.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-[-1px] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                        <div className={cn(
                                            "absolute top-2 right-2 size-5 rounded-md border flex items-center justify-center transition-colors shadow-sm",
                                            selectedPreset === preset.id ? "bg-blue-500 border-blue-500 text-white" : "border-white/30 bg-black/40 backdrop-blur-sm"
                                        )}>
                                            {selectedPreset === preset.id && <Check size={14} />}
                                        </div>

                                        <p className="text-[12px] font-bold text-white leading-tight mt-auto relative z-10 px-1 drop-shadow-md">
                                            {preset.title}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Direction Board */}
                        <div className="bg-card border border-border rounded-[2rem] p-6 md:p-10 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Video size={120} />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/20">
                                        <FilmStrip size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black tracking-tight leading-none uppercase">Storyboarding</h2>
                                        <p className="text-xs text-muted-foreground mt-1 font-bold">CONFIGURAÇÃO DE CENA <span className="bg-primary/20 text-primary px-2 py-0.5 rounded ml-2 text-[10px]">LEGACY ENGINE</span></p>
                                    </div>
                                </div>

                                <div className="flex bg-muted p-1 rounded-2xl">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", mode === 'simple' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Modo Automático
                                    </button>
                                    <button
                                        onClick={() => setMode("advanced")}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", mode === 'advanced' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Modo Expert
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Play size={18} className="text-primary" fill="currentColor" />
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">O que acontece na cena? (Ação)</h3>
                                    </div>
                                    <Textarea
                                        placeholder="Descreva a ação em até 10 segundos. Ex: O pintor profissional com camisa azul rola a tinta branca na parede em movimento contínuo da direita para a esquerda."
                                        className="min-h-[120px] bg-input border-border focus:border-primary rounded-2xl p-5 text-base font-medium"
                                        value={action}
                                        onChange={(e) => setAction(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground font-semibold">IAs de vídeo preferem ações únicas, contínuas e hiper-descritivas para durar de 5 a 10 segundos.</p>
                                </div>

                                {mode === 'simple' ? (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="niche" className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Ambiente / Contexto</Label>
                                            <select
                                                id="niche"
                                                value={niche}
                                                onChange={(e) => setNiche(e.target.value)}
                                                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                            >
                                                <option value="residential interior">Interior Residencial Limpo</option>
                                                <option value="outdoor residential">Exterior Residencial (Jardim/Telhado)</option>
                                                <option value="commercial building">Prédio Comercial / Estúdio</option>
                                                <option value="garage workshop">Garagem / Oficina</option>
                                                <option value="construction site">Canteiro de Obras (EUA)</option>
                                                <option value="other">Outro (Personalizado)</option>
                                            </select>
                                            {niche === 'other' && (
                                                <Input
                                                    type="text"
                                                    placeholder="Especifique o ambiente..."
                                                    value={nicheOther}
                                                    onChange={(e) => setNicheOther(e.target.value)}
                                                    className="mt-2 bg-input/50"
                                                />
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="motion" className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Movimento de Câmera</Label>
                                                <select
                                                    id="motion"
                                                    value={motion}
                                                    onChange={(e) => setMotion(e.target.value)}
                                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                                >
                                                    <option value="Slow Dolly Push-in">Push-in (Aproximação Dramática)</option>
                                                    <option value="Slow Pan Right">Pan Right (Giro para a Direita)</option>
                                                    <option value="Slow Pan Left">Pan Left (Giro para a Esquerda)</option>
                                                    <option value="Static Tripod Shot">Estático / Tripé (Ideal p/ Detalhes)</option>
                                                    <option value="Smooth Drone Tracking">Tracking de Drone (Aéreo/Seguindo)</option>
                                                    <option value="Handheld Documentary Style">Câmera na mão (Estilo Documentário/UGC)</option>
                                                    <option value="other">Outro (Personalizado)</option>
                                                </select>
                                                {motion === 'other' && (
                                                    <Input
                                                        type="text"
                                                        placeholder="Especifique o movimento..."
                                                        value={motionOther}
                                                        onChange={(e) => setMotionOther(e.target.value)}
                                                        className="mt-2 bg-input/50"
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="angle" className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Ângulo</Label>
                                                <select
                                                    id="angle"
                                                    value={angle}
                                                    onChange={(e) => setAngle(e.target.value)}
                                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                                >
                                                    <option value="Eye-level Angle">Nível dos Olhos (Eye-level)</option>
                                                    <option value="Low Angle">De baixo (Low Angle - Heróico)</option>
                                                    <option value="High Angle">De cima (High Angle - Overview)</option>
                                                    <option value="Extreme Close-up Macro">Close-up / Detalhe Extremo</option>
                                                    <option value="Wide Shot">Plano Aberto (Wide Shot)</option>
                                                    <option value="other">Outro (Personalizado)</option>
                                                </select>
                                                {angle === 'other' && (
                                                    <Input
                                                        type="text"
                                                        placeholder="Especifique o ângulo..."
                                                        value={angleOther}
                                                        onChange={(e) => setAngleOther(e.target.value)}
                                                        className="mt-2 bg-input/50"
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="lens" className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Qualidade / Lente</Label>
                                                <select
                                                    id="lens"
                                                    value={lens}
                                                    onChange={(e) => setLens(e.target.value)}
                                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold truncate"
                                                >
                                                    <option value="Cinematic 35mm lens, beautiful shallow depth of field, sharp focus">Cinematográfica 35mm (Fundo Desfocado)</option>
                                                    <option value="GoPro action camera, ultra-wide angle">Câmera de Ação (GoPro / Ultra Wide)</option>
                                                    <option value="iPhone 15 Pro Max footage, casual style">Gravação de Celular (iPhone 15 Pro)</option>
                                                    <option value="other">Outro (Personalizado)</option>
                                                </select>
                                                {lens === 'other' && (
                                                    <Input
                                                        type="text"
                                                        placeholder="Especifique a lente/qualidade..."
                                                        value={lensOther}
                                                        onChange={(e) => setLensOther(e.target.value)}
                                                        className="mt-2 bg-input/50"
                                                    />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="speed" className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Ritmo / Velocidade</Label>
                                                <select
                                                    id="speed"
                                                    value={speed}
                                                    onChange={(e) => setSpeed(e.target.value)}
                                                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                                >
                                                    <option value="Real-time default speed">Velocidade Normal (Real-Time)</option>
                                                    <option value="Cinematic 120fps Slow Motion, smooth">Câmera Lenta (Slow Motion)</option>
                                                    <option value="Hyperlapse time-lapse video">Hyperlapse (Acelerado)</option>
                                                    <option value="other">Outro (Personalizado)</option>
                                                </select>
                                                {speed === 'other' && (
                                                    <Input
                                                        type="text"
                                                        placeholder="Especifique o ritmo..."
                                                        value={speedOther}
                                                        onChange={(e) => setSpeedOther(e.target.value)}
                                                        className="mt-2 bg-input/50"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Negativo (Não ter no vídeo)</h3>
                                            <Textarea
                                                placeholder="Ex: text, watermarks, bad anatomy, distorted faces, skipping frames..."
                                                className="min-h-[100px] bg-input border-border focus:border-red-500/20 rounded-2xl p-5"
                                                value={negative}
                                                onChange={(e) => setNegative(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleGenerate}
                                    className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] rounded-2xl bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    {isGenerating ? <CheckCircle size={28} /> : "Gerar Prompt"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Output Column (Stage Preview) */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden sticky top-24">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/50">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <TerminalWindow size={24} className="text-primary" />
                                    Prompt Gerado
                                </h2>
                                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-primary/20 text-primary">
                                    PRONTO PARA IA
                                </span>
                            </div>

                            <div className="p-6 min-h-[300px] flex flex-col">
                                {generatedPrompt ? (
                                    <div className="flex-1 flex flex-col">
                                        <Textarea
                                            className="flex-1 bg-input border-none text-foreground placeholder:text-muted-foreground resize-none min-h-[200px] text-base p-4 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl custom-scrollbar"
                                            readOnly
                                            value={generatedPrompt}
                                        />

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={() => toggleFavorite("gerador-video", {
                                                    mode, niche, nicheOther, motion, motionOther, angle, angleOther, lens, lensOther, speed, speedOther, action, negative
                                                }, generatedPrompt, `Vídeo ${action.substring(0, 20)}`)}
                                                className={cn(
                                                    "bg-input hover:bg-muted-foreground/20 text-muted-foreground border-none transition-all",
                                                    isFavorited(generatedPrompt) && "text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20"
                                                )}
                                            >
                                                {isFavorited(generatedPrompt) ? <Star size={20} fill="currentColor" className="mr-2" /> : <Star size={20} className="mr-2" />}
                                                {isFavorited(generatedPrompt) ? 'Favoritado' : 'Favoritar'}
                                            </Button>
                                            <Button
                                                onClick={handleCopy}
                                                className={`font-semibold shadow-md border-none ${isCopied ? 'bg-green-600 hover:bg-green-700 text-black' : 'bg-card text-foreground hover:bg-muted'}`}
                                            >
                                                {isCopied ? <Check size={20} className="mr-2" /> : <Copy size={20} className="mr-2" />}
                                                {isCopied ? 'Copiado!' : 'Copiar Prompt'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 min-h-[200px]">
                                        <FilmStrip size={48} className="text-primary mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm">
                                            Preencha os campos e clique em <strong>Gerar Prompt</strong>.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-500/10 border-t border-blue-500/20 p-4">
                                <h3 className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">Dica de Vídeo</h3>
                                <p className="text-muted-foreground text-[10px] leading-relaxed">
                                    IAs de vídeo preferem ações únicas. Evite descrever várias cenas. Foco em <span className="text-blue-400">um movimento de câmera</span> e <span className="text-blue-400">uma ação técnica</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section - Full Width */}
                <div className="mt-6">
                    <GenerationHistory
                        history={history}
                        onRestore={handleRestore}
                        generatorName="gerador-video"
                    />
                </div>
            </div>

            <FloatingHelpButton pageTitle="Gerador Vídeo" />
        </div>
    )
}

export default function GeradorVideoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Carregando gerador...</div>}>
            <GeradorVideoContent />
        </Suspense>
    )
}
