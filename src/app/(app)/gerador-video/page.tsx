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
    ImagePlus
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

    useEffect(() => {
    }, [])
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
            alert("Por favor, descreva a ação que acontece no vídeo.")
            return
        }
        if (videoType === 'timelapse' && !tlAction) {
            alert("Por favor, descreva o que está sendo construído / executado no timelapse.")
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
                                <div className="space-y-4 bg-muted/30 p-5 rounded-2xl border border-border/50 shadow-inner">
                                    <div className="flex items-center gap-2">
                                        <FilmStrip size={18} className="text-blue-500" />
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Tipo de Vídeo</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[
                                            { id: "normal", label: "Cena Normal", icon: Play },
                                            { id: "timelapse", label: "Timelapse", icon: TerminalWindow },
                                            { id: "before_after", label: "Antes & Depois", icon: CheckCircle },
                                            { id: "ken_burns", label: "Foto Ganhando Vida", icon: MagicWand },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setVideoType(opt.id as any)}
                                                className={cn("flex flex-col items-center justify-center p-4 rounded-xl border transition-all", videoType === opt.id ? "bg-blue-500/10 border-blue-500/50 text-blue-500 shadow-sm" : "bg-input/20 border-border hover:bg-input/40 text-muted-foreground")}
                                            >
                                                <opt.icon size={24} className="mb-2" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-center">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {videoType === 'normal' && (
                                    <div className="space-y-10">
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
                                    disabled={isGenerating}
                                    className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] rounded-2xl bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-2">
                                            <MagicWand size={24} className="animate-spin text-black" />
                                            GERANDO...
                                        </div>
                                    ) : (
                                        "Gerar Prompt"
                                    )}
                                </Button>
                            </div>
                        )}

                        {videoType === 'timelapse' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <TerminalWindow size={18} className="text-blue-500" />
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">O que está sendo construído / executado</h3>
                                    </div>
                                    <Textarea
                                        placeholder="Ex: instalação completa de piso de vinílico em sala de estar"
                                        className="min-h-[120px] bg-input border-border focus:border-blue-500/50 rounded-2xl p-5 text-base font-medium"
                                        value={tlAction}
                                        onChange={(e) => setTlAction(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Velocidade do Timelapse</Label>
                                        <select value={tlSpeed} onChange={(e) => setTlSpeed(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-semibold">
                                            <option value="2x">2x</option>
                                            <option value="4x">4x</option>
                                            <option value="8x">8x</option>
                                            <option value="Ultra-rápido (hiper-comprimido)">Ultra-rápido (hiper-comprimido)</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {tlSpeed === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={tlSpeedOther} onChange={(e) => setTlSpeedOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Ângulo Principal</Label>
                                        <select value={tlAngle} onChange={(e) => setTlAngle(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-semibold">
                                            <option value="Frontal fixo">Frontal fixo</option>
                                            <option value="Aéreo de cima">Aéreo de cima</option>
                                            <option value="Seguindo o profissional">Seguindo o profissional</option>
                                            <option value="Alternando ângulos">Alternando ângulos</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {tlAngle === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={tlAngleOther} onChange={(e) => setTlAngleOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Estilo Visual</Label>
                                        <select value={tlStyle} onChange={(e) => setTlStyle(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-semibold">
                                            <option value="Documental realista">Documental realista</option>
                                            <option value="Cinematográfico com color grade">Cinematográfico com color grade</option>
                                            <option value="Clean e minimalista">Clean e minimalista</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {tlStyle === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={tlStyleOther} onChange={(e) => setTlStyleOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {videoType === 'before_after' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Nicho / Serviço</Label>
                                        <select value={baNiche} onChange={(e) => setBaNiche(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-semibold">
                                            <optgroup label="🏗️ Construção & Reformas">
                                                <option value="Construction">Construction (Construção)</option>
                                                <option value="Kitchen Remodel">Kitchen Remodel (Cozinha)</option>
                                                <option value="Bathroom Remodel">Bathroom (Banheiro)</option>
                                            </optgroup>
                                            <optgroup label="🎨 Acabamentos & Superfícies">
                                                <option value="House Painting">House Painting (Pintura)</option>
                                                <option value="Roof Repair">Roof Repair (Telhado)</option>
                                                <option value="Siding Installation">Siding (Revestimento)</option>
                                            </optgroup>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {baNiche === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={baNicheOther} onChange={(e) => setBaNicheOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Tipo de Transição</Label>
                                        <select value={baTransition} onChange={(e) => setBaTransition(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-semibold">
                                            <option value="Wipe horizontal (clássico)">Wipe horizontal (clássico)</option>
                                            <option value="Reveal com cortina">Reveal com cortina</option>
                                            <option value="Split screen animado">Split screen animado</option>
                                            <option value="Fade entre os dois estados">Fade entre os dois estados</option>
                                            <option value="Zoom in que revela o depois">Zoom in que revela o depois</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {baTransition === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={baTransitionOther} onChange={(e) => setBaTransitionOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Ritmo da Transição</Label>
                                        <select value={baPace} onChange={(e) => setBaPace(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-semibold">
                                            <option value="Lento e dramático">Lento e dramático</option>
                                            <option value="Médio">Médio</option>
                                            <option value="Rápido e impactante">Rápido e impactante</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {baPace === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={baPaceOther} onChange={(e) => setBaPaceOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Nível de Contraste</Label>
                                        <select value={baContrast} onChange={(e) => setBaContrast(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-semibold">
                                            <option value="Sutil">Sutil</option>
                                            <option value="Médio">Médio</option>
                                            <option value="Extremo (máximo impacto)">Extremo (máximo impacto)</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {baContrast === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={baContrastOther} onChange={(e) => setBaContrastOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={18} className="text-blue-500" />
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Detalhe adicional da cena (Opcional)</h3>
                                    </div>
                                    <Textarea
                                        placeholder="Ex: Mostrar o cliente sorrindo no final, focar no reflexo do chão limpo..."
                                        className="min-h-[120px] bg-input border-border focus:border-blue-500/50 rounded-2xl p-5 text-base font-medium"
                                        value={baDetail}
                                        onChange={(e) => setBaDetail(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {videoType === 'ken_burns' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="font-semibold text-amber-500 flex items-center gap-1.5">
                                        <FileImage size={18} />
                                        Foto base (opcional — para referência de estilo)
                                    </Label>
                                    <div
                                        onClick={() => kbPhotoInputRef.current?.click()}
                                        className="border-2 border-dashed border-border hover:border-amber-500/50 bg-input/20 rounded-xl p-4 text-center cursor-pointer transition-all group flex flex-col items-center justify-center h-[120px]"
                                    >
                                        {kbPhotoUrl ? (
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <img src={kbPhotoUrl} alt="Referência" className="max-h-full max-w-full object-contain rounded-md" />
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setKbPhotoUrl("") }} className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white shadow-md"><X size={12} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={24} className="mb-2 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                                <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">Clique para anexar foto base</p>
                                            </>
                                        )}
                                        <input ref={kbPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleKbPhotoUpload} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Tipo de Movimento</Label>
                                        <select value={kbMovement} onChange={(e) => setKbMovement(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold">
                                            <option value="Zoom in suave (Ken Burns clássico)">Zoom in suave (Ken Burns clássico)</option>
                                            <option value="Zoom out revelador">Zoom out revelador</option>
                                            <option value="Pan horizontal lento">Pan horizontal lento</option>
                                            <option value="Pan vertical (de baixo para cima)">Pan vertical (de baixo para cima)</option>
                                            <option value="Leve flutuação (parallax)">Leve flutuação (parallax)</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {kbMovement === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={kbMovementOther} onChange={(e) => setKbMovementOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Velocidade do Movimento</Label>
                                        <select value={kbSpeed} onChange={(e) => setKbSpeed(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold">
                                            <option value="Muito suave (realtor/luxury)">Muito suave (realtor/luxury)</option>
                                            <option value="Suave">Suave</option>
                                            <option value="Moderado">Moderado</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {kbSpeed === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={kbSpeedOther} onChange={(e) => setKbSpeedOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Clima da Cena</Label>
                                        <select value={kbMood} onChange={(e) => setKbMood(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold">
                                            <option value="Neutro">Neutro</option>
                                            <option value="Dramático (luz intensa)">Dramático (luz intensa)</option>
                                            <option value="Sereno (luz suave)">Sereno (luz suave)</option>
                                            <option value="Premium">Premium</option>
                                            <option value="Aconchegante">Aconchegante</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {kbMood === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={kbMoodOther} onChange={(e) => setKbMoodOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Duração</Label>
                                        <select value={kbDuration} onChange={(e) => setKbDuration(e.target.value)} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-semibold">
                                            <option value="5s">5s</option>
                                            <option value="10s">10s</option>
                                            <option value="15s">15s</option>
                                            <option value="other">Outro (Personalizado)</option>
                                        </select>
                                        {kbDuration === 'other' && (
                                            <Input type="text" placeholder="Especifique..." value={kbDurationOther} onChange={(e) => setKbDurationOther(e.target.value)} className="mt-2 bg-input/50" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

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
