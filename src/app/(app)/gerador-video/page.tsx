"use client"

import { useState, useEffect, Suspense, useRef } from "react"
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
    Star,
    Upload,
    X,
    FileImage,
    ImagePlus,
    MonitorPlay,
    Share2,
    History as HistoryIcon,
    ArrowRightCircle,
    RotateCcw
} from "lucide-react"
import { TutorialDialog } from "@/components/TutorialDialog"
import { CopyWorkflowPopup } from "@/components/CopyWorkflowPopup"
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { PRESETS_VIDEO } from "@/constants/presets"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

interface VideoPayload {
    mode: "simple" | "advanced";
    videoType?: "normal" | "timelapse" | "before_after" | "ken_burns";
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
    tlAction?: string;
    tlSpeed?: string;
    tlSpeedOther?: string;
    tlAngle?: string;
    tlAngleOther?: string;
    tlStyle?: string;
    tlStyleOther?: string;
    baNiche?: string;
    baNicheOther?: string;
    baTransition?: string;
    baTransitionOther?: string;
    baPace?: string;
    baPaceOther?: string;
    baContrast?: string;
    baContrastOther?: string;
    baDetail?: string;
    kbMovement?: string;
    kbMovementOther?: string;
    kbSpeed?: string;
    kbSpeedOther?: string;
    kbMood?: string;
    kbMoodOther?: string;
    kbDuration?: string;
    kbDurationOther?: string;
    hasKbPhoto?: boolean;
}

function GeradorVideoContent() {
    const [isTutorialOpen, setIsTutorialOpen] = useState(false)
    const [showWorkflowPopup, setShowWorkflowPopup] = useState(false)

    const [selectedPreset, setSelectedPreset] = useState<string>("")
    const [mode, setMode] = useState<"simple" | "advanced">("simple")
    const [videoType, setVideoType] = useState<"normal" | "timelapse" | "before_after" | "ken_burns">("normal")

    // Macro States (Normal Mode)
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

    // Timelapse States
    const [tlAction, setTlAction] = useState("")
    const [tlSpeed, setTlSpeed] = useState("4x")
    const [tlSpeedOther, setTlSpeedOther] = useState("")
    const [tlAngle, setTlAngle] = useState("Alternando ângulos")
    const [tlAngleOther, setTlAngleOther] = useState("")
    const [tlStyle, setTlStyle] = useState("Cinematográfico com color grade")
    const [tlStyleOther, setTlStyleOther] = useState("")

    // Antes & Depois States
    const [baNiche, setBaNiche] = useState("Construction")
    const [baNicheOther, setBaNicheOther] = useState("")
    const [baTransition, setBaTransition] = useState("Wipe horizontal (clássico)")
    const [baTransitionOther, setBaTransitionOther] = useState("")
    const [baPace, setBaPace] = useState("Médio")
    const [baPaceOther, setBaPaceOther] = useState("")
    const [baContrast, setBaContrast] = useState("Médio")
    const [baContrastOther, setBaContrastOther] = useState("")
    const [baDetail, setBaDetail] = useState("")

    // Ken Burns States
    const [kbPhotoUrl, setKbPhotoUrl] = useState("")
    const kbPhotoInputRef = useRef<HTMLInputElement>(null)
    const [kbMovement, setKbMovement] = useState("Zoom in suave (Ken Burns clássico)")
    const [kbMovementOther, setKbMovementOther] = useState("")
    const [kbSpeed, setKbSpeed] = useState("Suave")
    const [kbSpeedOther, setKbSpeedOther] = useState("")
    const [kbMood, setKbMood] = useState("Neutro")
    const [kbMoodOther, setKbMoodOther] = useState("")
    const [kbDuration, setKbDuration] = useState("5s")
    const [kbDurationOther, setKbDurationOther] = useState("")

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
        setVideoType(p.videoType || "normal");

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

        setTlAction(p.tlAction || "");
        setTlSpeed(p.tlSpeed || "4x");
        setTlSpeedOther(p.tlSpeedOther || "");
        setTlAngle(p.tlAngle || "Alternando ângulos");
        setTlAngleOther(p.tlAngleOther || "");
        setTlStyle(p.tlStyle || "Cinematográfico com color grade");
        setTlStyleOther(p.tlStyleOther || "");

        setBaNiche(p.baNiche || "Construction");
        setBaNicheOther(p.baNicheOther || "");
        setBaTransition(p.baTransition || "Wipe horizontal (clássico)");
        setBaTransitionOther(p.baTransitionOther || "");
        setBaPace(p.baPace || "Médio");
        setBaPaceOther(p.baPaceOther || "");
        setBaContrast(p.baContrast || "Médio");
        setBaContrastOther(p.baContrastOther || "");
        setBaDetail(p.baDetail || "");

        setKbMovement(p.kbMovement || "Zoom in suave (Ken Burns clássico)");
        setKbMovementOther(p.kbMovementOther || "");
        setKbSpeed(p.kbSpeed || "Suave");
        setKbSpeedOther(p.kbSpeedOther || "");
        setKbMood(p.kbMood || "Neutro");
        setKbMoodOther(p.kbMoodOther || "");
        setKbDuration(p.kbDuration || "5s");
        setKbDurationOther(p.kbDurationOther || "");

        setGeneratedPrompt(item.prompt || "");
        setSelectedPreset("");
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
            setVideoType("normal");
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

    const handleKbPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const b64 = await toBase64(file);
        setKbPhotoUrl(b64);
    };

    const handleGenerate = () => {
        if (videoType === 'normal' && mode === 'simple' && !action) {
            toast.error("Por favor, descreva a ação que acontece no vídeo.")
            return
        }
        if (videoType === 'timelapse' && !tlAction) {
            toast.error("Por favor, descreva o que está sendo construído / executado no timelapse.")
            return
        }

        setIsGenerating(true)

        setTimeout(() => {
            setIsGenerating(false)
            let finalStr = ""

            if (videoType === 'timelapse') {
                const fSpeed = tlSpeed === 'other' ? tlSpeedOther : tlSpeed
                const fAngle = tlAngle === 'other' ? tlAngleOther : tlAngle
                const fStyle = tlStyle === 'other' ? tlStyleOther : tlStyle
                finalStr = `A speed build/timelapse video of ${tlAction}. The camera angle is ${fAngle}. The video speed is ${fSpeed}. Visual style: ${fStyle}. Emphasize continuous progression of the action, multiple visible stages, and a sense of accelerated transformation. NO TEXT, NO LETTERS.`
            } else if (videoType === 'before_after') {
                const fNiche = baNiche === 'other' ? baNicheOther : baNiche
                const fTransition = baTransition === 'other' ? baTransitionOther : baTransition
                const fPace = baPace === 'other' ? baPaceOther : baPace
                const fContrast = baContrast === 'other' ? baContrastOther : baContrast
                finalStr = `A before and after sequence video of a ${fNiche} service. The transition type is a ${fTransition} with a ${fPace} rhythm. The contrast level between the before and after states is ${fContrast}. ${baDetail ? "Additional scene details: " + baDetail + "." : ""} Emphasize a clear distinction between the previous and subsequent states, highlighting the transition as a moment of impact. NO TEXT, NO LETTERS.`
            } else if (videoType === 'ken_burns') {
                const fMovement = kbMovement === 'other' ? kbMovementOther : kbMovement
                const fSpeed = kbSpeed === 'other' ? kbSpeedOther : kbSpeed
                const fMood = kbMood === 'other' ? kbMoodOther : kbMood
                const fDuration = kbDuration === 'other' ? kbDurationOther : kbDuration
                finalStr = `[USE UPLOADED IMAGE AS REFERENCE]\nA high quality video bringing the reference photo to life. Camera movement: ${fMovement} at a ${fSpeed} speed. The mood of the scene is ${fMood}. Duration: ${fDuration}. Apply a virtual camera movement over the static image without deforming objects, maintaining photorealistic quality. NO TEXT, NO LETTERS.`
            } else {
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
            }

            setGeneratedPrompt(finalStr)

            saveHistory({
                mode, videoType, niche, nicheOther, motion, motionOther, angle, angleOther,
                lens, lensOther, speed, speedOther, action, negative,
                tlAction, tlSpeed, tlSpeedOther, tlAngle, tlAngleOther, tlStyle, tlStyleOther,
                baNiche, baNicheOther, baTransition, baTransitionOther, baPace, baPaceOther, baContrast, baContrastOther, baDetail,
                kbMovement, kbMovementOther, kbSpeed, kbSpeedOther, kbMood, kbMoodOther, kbDuration, kbDurationOther, hasKbPhoto: !!kbPhotoUrl
            }, finalStr)
        }, 800)
    }

    const handleCopy = () => {
        copy(generatedPrompt)
        setShowWorkflowPopup(true)
    }

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
        setTlAction("")
        setTlSpeed("4x")
        setTlSpeedOther("")
        setTlAngle("Alternando ângulos")
        setTlAngleOther("")
        setTlStyle("Cinematográfico com color grade")
        setTlStyleOther("")
        setBaNiche("Construction")
        setBaNicheOther("")
        setBaTransition("Wipe horizontal (clássico)")
        setBaTransitionOther("")
        setBaPace("Médio")
        setBaPaceOther("")
        setBaContrast("Médio")
        setBaContrastOther("")
        setBaDetail("")
        setKbPhotoUrl("")
        setKbMovement("Zoom in suave (Ken Burns clássico)")
        setKbMovementOther("")
        setKbSpeed("Suave")
        setKbSpeedOther("")
        setKbMood("Neutro")
        setKbMoodOther("")
        setKbDuration("5s")
        setKbDurationOther("")
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    return (
        <div className="flex-1 w-full bg-input/50 relative font-sans">
            <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 md:py-12">
                {/* Hero */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="flex items-center gap-4 justify-center mb-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="size-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center text-black shadow-xl relative group cursor-help transition-transform hover:scale-110">
                                        <MonitorPlay size={32} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Director Engine</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                Video <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-amber-400">Generator</span>
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">AI SCENE DIRECTOR SYSTEM</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Gere roteiros técnicos e prompts de cena otimizados para <span className="text-foreground font-bold">Luma, Kling e Runway Gen-3</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Inputs Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '150ms' }}>

                        {/* Presets Gallery */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 relative space-y-0">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Cenas Prontas <span className="text-blue-700 text-xl">↓</span>
                                </CardTitle>
                                <Badge variant="secondary" className="bg-blue-700/10 text-blue-700 border-blue-700/20 font-bold uppercase tracking-wider text-[10px]">
                                    AUTO
                                </Badge>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8">
                                <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory perspective-1000">
                                    {PRESETS_VIDEO.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handlePresetClick(preset.id)}
                                            className={cn(
                                                "relative w-[155px] h-[120px] shrink-0 rounded-xl overflow-hidden group text-left border-2 transition-all p-3 flex flex-col justify-end bg-input/50 snap-start",
                                                selectedPreset === preset.id ? "border-blue-700 shadow-[0_0_20px_rgba(249,115,22,0.2)] z-10 scale-[1.02]" : "border-transparent border hover:border-border/50"
                                            )}
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                                <FilmStrip size={32} className="text-muted-foreground opacity-50" />
                                            </div>
                                            <img
                                                src={preset.image}
                                                alt={preset.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-[-1px] bg-gradient-to-t from-black/95 via-black/60 to-black/10 pointer-events-none" />

                                            <div className={cn(
                                                "absolute top-2 right-2 size-5 rounded-md border flex items-center justify-center transition-colors shadow-sm",
                                                selectedPreset === preset.id ? "bg-blue-700 border-blue-700 text-white" : "border-white/30 bg-black/40 backdrop-blur-sm"
                                            )}>
                                                {selectedPreset === preset.id && <Check size={14} />}
                                            </div>

                                            <p className="text-[12px] font-bold text-white leading-tight mt-auto relative z-10 px-1 drop-shadow-md">
                                                {preset.title}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Storyboarding Section */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 relative">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-blue-700 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-blue-700/20">
                                        <FilmStrip size={28} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">Storyboarding</CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground mt-1 font-bold italic tracking-wider uppercase">CONFIGURAÇÃO DE CENA</CardDescription>
                                    </div>
                                </div>

                                <div className="flex items-center bg-muted p-1 rounded-2xl">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", mode === 'simple' ? "bg-card text-blue-700 shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Básico
                                    </button>
                                    <button
                                        onClick={() => setMode("advanced")}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", mode === 'advanced' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Avançado
                                    </button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8 space-y-8">
                                {/* Video Type Selector */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] font-bold border-blue-700/20 text-blue-700 uppercase">Fase 1</Badge>
                                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tipo de Produção</Label>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { id: "normal", label: "Cena Normal", icon: Play },
                                            { id: "timelapse", label: "Timelapse", icon: TerminalWindow },
                                            { id: "before_after", label: "Antes & Depois", icon: CheckCircle },
                                            { id: "ken_burns", label: "Foto Animada", icon: MagicWand },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setVideoType(opt.id as any)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                                                    videoType === opt.id ? "bg-blue-700/5 border-blue-700 text-blue-700 shadow-sm scale-105" : "bg-card border-border hover:border-border/80 text-muted-foreground"
                                                )}
                                            >
                                                <opt.icon size={24} className={cn(videoType === opt.id ? "animate-pulse" : "opacity-50")} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-center">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Dynamic Content Layer */}
                                {videoType === 'normal' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="action" className="font-semibold text-foreground flex items-center gap-2">
                                                <Play size={16} className="text-blue-700" />
                                                O que acontece na cena?
                                            </Label>
                                            <Textarea
                                                id="action"
                                                placeholder="Descreva a ação em até 10 segundos. Ex: O pintor profissional com camisa azul rola a tinta branca na parede..."
                                                className="min-h-[120px] bg-input border-border focus:border-blue-700/50 rounded-2xl p-5 text-base font-medium resize-none shadow-inner"
                                                value={action}
                                                onChange={(e) => setAction(e.target.value)}
                                            />
                                            <p className="text-[10px] text-muted-foreground font-semibold italic text-right px-2">• Use verbos de ação e descreva cores e texturas.</p>
                                        </div>

                                        {mode === 'simple' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contexto / Nicho</Label>
                                                    <Select value={niche} onValueChange={setNiche}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Ambiente..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="residential interior">Interior Residencial Limpo</SelectItem>
                                                            <SelectItem value="outdoor residential">Exterior Residencial (Jardim/Telhado)</SelectItem>
                                                            <SelectItem value="commercial building">Prédio Comercial / Estúdio</SelectItem>
                                                            <SelectItem value="garage workshop">Garagem / Oficina</SelectItem>
                                                            <SelectItem value="construction site">Canteiro de Obras (EUA)</SelectItem>
                                                            <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {niche === 'other' && <Input placeholder="Especifique..." value={nicheOther} onChange={e => setNicheOther(e.target.value)} className="mt-2" />}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Câmera: Movimento</Label>
                                                    <Select value={motion} onValueChange={setMotion}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Movimento..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Slow Dolly Push-in">Push-in (Aproximação Dramática)</SelectItem>
                                                            <SelectItem value="Slow Pan Right">Pan Right (Giro para a Direita)</SelectItem>
                                                            <SelectItem value="Slow Pan Left">Pan Left (Giro para a Esquerda)</SelectItem>
                                                            <SelectItem value="Static Tripod Shot">Estático / Tripé (Ideal p/ Detalhes)</SelectItem>
                                                            <SelectItem value="Smooth Drone Tracking">Tracking de Drone (Aéreo/Seguindo)</SelectItem>
                                                            <SelectItem value="Handheld Documentary Style">Mão (Humanístico/UGC)</SelectItem>
                                                            <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {motion === 'other' && <Input placeholder="Especifique..." value={motionOther} onChange={e => setMotionOther(e.target.value)} className="mt-2" />}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Câmera: Ângulo</Label>
                                                    <Select value={angle} onValueChange={setAngle}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Ângulo..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Eye-level Angle">Nível dos Olhos (Eye-level)</SelectItem>
                                                            <SelectItem value="Low Angle">De baixo (Heróico)</SelectItem>
                                                            <SelectItem value="High Angle">De cima (Overview)</SelectItem>
                                                            <SelectItem value="Extreme Close-up Macro">Macro / Detalhe Extremo</SelectItem>
                                                            <SelectItem value="Wide Shot">Plano Aberto (Wide Shot)</SelectItem>
                                                            <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {angle === 'other' && <Input placeholder="Especifique..." value={angleOther} onChange={e => setAngleOther(e.target.value)} className="mt-2" />}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ritmo / Velocidade</Label>
                                                    <Select value={speed} onValueChange={setSpeed}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Ritmo..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Real-time default speed">Velocidade Normal</SelectItem>
                                                            <SelectItem value="Cinematic 120fps Slow Motion, smooth">Slow Motion (Câmera Lenta)</SelectItem>
                                                            <SelectItem value="Hyperlapse time-lapse video">Hyperlapse (Acelerado)</SelectItem>
                                                            <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {speed === 'other' && <Input placeholder="Especifique..." value={speedOther} onChange={e => setSpeedOther(e.target.value)} className="mt-2" />}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Label htmlFor="negative" className="font-semibold text-red-500">Negativo (Não ter no vídeo)</Label>
                                                <Textarea
                                                    id="negative"
                                                    placeholder="Ex: text, watermarks, bad anatomy, distorted faces..."
                                                    className="bg-red-500/5 border-red-500/20 focus:border-red-500 rounded-2xl p-4 text-sm"
                                                    value={negative}
                                                    onChange={(e) => setNegative(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {videoType === 'timelapse' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="tlAction" className="font-semibold text-foreground flex items-center gap-2">
                                                <TerminalWindow size={16} className="text-blue-700" />
                                                O que está sendo construído?
                                            </Label>
                                            <Textarea
                                                id="tlAction"
                                                placeholder="Ex: instalação completa de piso de vinílico em sala de estar, pintura total de fachada..."
                                                className="min-h-[100px] bg-input border-border focus:border-blue-700/50 rounded-2xl p-5 text-base font-medium shadow-inner"
                                                value={tlAction}
                                                onChange={(e) => setTlAction(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Velocidade</Label>
                                                <Select value={tlSpeed} onValueChange={setTlSpeed}>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="4x">4x (Rápido)</SelectItem>
                                                        <SelectItem value="8x">8x (Muito Rápido)</SelectItem>
                                                        <SelectItem value="Ultra-rápido">Hiper-lapse</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ângulo</Label>
                                                <Select value={tlAngle} onValueChange={setTlAngle}>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Frontal fixo">Frontal fixo</SelectItem>
                                                        <SelectItem value="Aéreo de cima">Aéreo (Dolphin)</SelectItem>
                                                        <SelectItem value="Alternando ângulos">Vários Ângulos</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visual</Label>
                                                <Select value={tlStyle} onValueChange={setTlStyle}>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Documental realista">Documental</SelectItem>
                                                        <SelectItem value="Cinematográfico com color grade">Cinematográfico</SelectItem>
                                                        <SelectItem value="Clean e minimalista">Clean</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {videoType === 'before_after' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nicho / Serviço</Label>
                                                <Select value={baNiche} onValueChange={setBaNiche}>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Construction">Construction</SelectItem>
                                                        <SelectItem value="Kitchen Remodel">Kitchen Remodel</SelectItem>
                                                        <SelectItem value="House Painting">House Painting</SelectItem>
                                                        <SelectItem value="Roof Repair">Roof Repair</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transição</Label>
                                                <Select value={baTransition} onValueChange={setBaTransition}>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Wipe horizontal (clássico)">Wipe Lateral</SelectItem>
                                                        <SelectItem value="Reveal com cortina">Cortina / Reveal</SelectItem>
                                                        <SelectItem value="Split screen animado">Split Screen</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="baDetail" className="font-semibold text-foreground">Ações específicas na cena</Label>
                                            <Textarea
                                                id="baDetail"
                                                placeholder="Ex: Mostrar o cliente sorrindo no final, focar no brilho do piso..."
                                                className="bg-input border-border rounded-2xl p-5"
                                                value={baDetail}
                                                onChange={(e) => setBaDetail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {videoType === 'ken_burns' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground flex items-center gap-1.5 uppercase text-[10px] tracking-widest text-blue-700">
                                                <FileImage size={16} />
                                                Input: Foto Base
                                            </Label>
                                            <div
                                                onClick={() => kbPhotoInputRef.current?.click()}
                                                className="border-2 border-dashed border-border hover:border-blue-700/50 bg-input/20 rounded-2xl p-4 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[160px]"
                                            >
                                                {kbPhotoUrl ? (
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        <img src={kbPhotoUrl} alt="Preview" className="max-h-[120px] rounded-lg shadow-md mb-2" />
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute -top-2 -right-2 rounded-full size-6"
                                                            onClick={(e) => { e.stopPropagation(); setKbPhotoUrl(""); }}
                                                        >
                                                            <X size={12} />
                                                        </Button>
                                                        <p className="text-[10px] font-bold text-blue-700 uppercase mt-2">Clique para trocar</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <ImagePlus size={40} className="text-muted-foreground group-hover:text-blue-700 transition-colors" />
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold text-foreground">Upload da Foto</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">DRAG AND DROP OR CLICK</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    ref={kbPhotoInputRef}
                                                    onChange={handleKbPhotoUpload}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Movimento Virtual</Label>
                                                <Select value={kbMovement} onValueChange={setKbMovement}>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Zoom in suave">Zoom in (Suave)</SelectItem>
                                                        <SelectItem value="Smooth Pan Right">Slide Direita</SelectItem>
                                                        <SelectItem value="Dolly Out slow">Dolly Out</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mood / Clima</Label>
                                                <Select value={kbMood} onValueChange={setKbMood}>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Cálido / Golden Hour">Cálido (Golden Hour)</SelectItem>
                                                        <SelectItem value="Moderno / Clean">Frio / Limpo</SelectItem>
                                                        <SelectItem value="Neutro">Natural / Realista</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-6">
                                    <Button
                                        onClick={handleGenerate}
                                        className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] rounded-2xl bg-blue-700 hover:bg-orange-600 text-black shadow-2xl shadow-blue-700/20 transition-all active:scale-[0.98]"
                                    >
                                        {isGenerating ? <RotateCcw className="animate-spin size-6" /> : "Gerar Prompt de Vídeo"}
                                    </Button>
                                    <div className="flex justify-center mt-4 gap-4">
                                        <button onClick={handleClear} className="text-[10px] font-black uppercase text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 tracking-widest">
                                            <X size={12} /> Limpar campos
                                        </button>
                                        <button onClick={() => setIsTutorialOpen(true)} className="text-[10px] font-black uppercase text-muted-foreground hover:text-blue-700 transition-colors flex items-center gap-1 tracking-widest">
                                            <Info size={12} /> Tutorial rápido
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Output Column */}
                    <div className="lg:col-span-5 relative">
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden sticky top-24 animate-fade-up" style={{ animationDelay: '300ms' }}>
                            <CardHeader className="px-6 py-5 bg-muted/50 relative border-none">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <TerminalWindow size={24} className="text-blue-700" />
                                        Prompt Gerado
                                    </CardTitle>
                                    <Badge className="bg-blue-700/20 text-blue-700 border-none font-extrabold uppercase tracking-wider text-[0.65rem]">
                                        READY TO AI
                                    </Badge>
                                </div>
                            </CardHeader>

                            <div className="bg-blue-700/10 border-b border-blue-700/20 p-4 flex items-start gap-3">
                                <span className="text-2xl mt-0.5 animate-pulse">🎬</span>
                                <div>
                                    <h3 className="text-blue-700 font-bold text-sm tracking-tight mb-1">Como utilizar?</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                                        Copie o prompt e cole em ferramentas como <strong className="text-foreground">Luma (Dream Machine)</strong>, <strong className="text-foreground">Kling</strong> ou <strong className="text-foreground">Runway</strong> para transformar em vídeo.
                                    </p>
                                </div>
                            </div>

                            <CardContent className="p-6 min-h-[300px] flex flex-col">
                                {generatedPrompt ? (
                                    <div className="flex-1 flex flex-col">
                                        <Textarea
                                            className="flex-1 bg-input border-none text-foreground placeholder:text-muted-foreground resize-none min-h-[200px] text-[13px] font-mono p-4 focus-visible:ring-1 focus-visible:ring-blue-700/50 rounded-xl custom-scrollbar"
                                            readOnly
                                            value={generatedPrompt}
                                        />

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={() => toggleFavorite("gerador-video", {
                                                    videoType, niche, nicheOther, motion, motionOther, angle, angleOther, lens, lensOther, speed, speedOther, action, negative,
                                                    tlAction, tlSpeed, tlSpeedOther, tlAngle, tlAngleOther, tlStyle, tlStyleOther,
                                                    baNiche, baNicheOther, baTransition, baTransitionOther, baPace, baPaceOther, baContrast, baContrastOther, baDetail,
                                                    kbMovement, kbMovementOther, kbSpeed, kbSpeedOther, kbMood, kbMoodOther, kbDuration, kbDurationOther, hasKbPhoto: !!kbPhotoUrl
                                                }, generatedPrompt, `${videoType?.toUpperCase()} - ${action.substring(0, 20)}`)}
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
                                                className={`font-semibold shadow-md border-none ${isCopied ? 'bg-green-600 hover:bg-green-700 text-black' : 'bg-card text-foreground hover:bg-muted font-bold'}`}
                                            >
                                                {isCopied ? <Check size={20} className="mr-2" /> : <Copy size={20} className="mr-2" />}
                                                {isCopied ? 'Copiado!' : 'Copiar Prompt'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                                        <Video size={48} className="text-blue-700 mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm">
                                            Configure sua cena e clique em <strong>Gerar Prompt de Vídeo</strong> para visualizar o roteiro.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* History Section - Full Width */}
                <div className="mt-8 animate-fade-up" style={{ animationDelay: '450ms' }}>
                    <GenerationHistory
                        history={history}
                        onRestore={handleRestore}
                        generatorName="gerador-video"
                    />
                </div>
            </div>

            {/* Footer Padrão */}
            <footer className="py-12 text-center border-t border-border mt-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
                <div className="flex flex-col items-center gap-4">
                    <img src="/logo/TS-TOOLS-ALLWHITE.svg" alt="TS TOOLS" className="h-[25px] opacity-20 hover:opacity-50 transition-opacity grayscale" />
                    <p className="text-[11px] text-muted-foreground/60 font-semibold uppercase tracking-widest leading-none">
                        TS TOOLS &copy; {new Date().getFullYear()} &bull; CENTRAL DE FERRAMENTAS
                    </p>
                </div>
            </footer>

            <FloatingHelpButton pageTitle="Gerador de Vídeo" />
            <CopyWorkflowPopup
                open={showWorkflowPopup}
                onClose={() => setShowWorkflowPopup(false)}
                prompt={generatedPrompt}
                referenceImageUrl={videoType === 'ken_burns' && kbPhotoUrl ? kbPhotoUrl : undefined}
                imageLabel="Foto Base (Ken Burns)"
            />
            <TutorialDialog
                isOpen={isTutorialOpen}
                onOpenChange={setIsTutorialOpen}
                pageTitle="Gerador de Vídeo"
                title="Manual do Diretor"
                steps={[
                    { title: "Storyboarding", description: "Defina o tipo de vídeo (Normal, Timelapse, etc) e a ação principal." },
                    { title: "Configuração de Câmera", description: "Escolha movimentos, ângulos e lentes para dar o tom cinematográfico." },
                    { title: "Prompt Engine", description: "Para tipos com upload (Ken Burns, etc), copie o prompt E faça upload da imagem na ferramenta de IA de vídeo." }
                ]}
            />
        </div>
    );
}

export default function GeradorVideoPage() {
    return (
        <Suspense fallback={
            <div className="max-w-[1400px] mx-auto px-6 mt-32 space-y-12">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-12 w-1/3 mx-auto rounded-xl" />
                    <Skeleton className="h-6 w-1/4 mx-auto rounded-xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                        <Skeleton className="h-[200px] w-full rounded-[24px]" />
                        <Skeleton className="h-[600px] w-full rounded-[24px] mt-6" />
                    </div>
                    <div className="lg:col-span-5">
                        <Skeleton className="h-[500px] w-full rounded-[24px]" />
                    </div>
                </div>
            </div>
        }>
            <GeradorVideoContent />
        </Suspense>
    );
}
