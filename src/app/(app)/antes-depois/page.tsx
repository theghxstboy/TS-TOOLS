"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    BookOpen,
    ListChecks,
    Terminal as TerminalWindow,
    Sparkles as Sparkle,
    Copy,
    CheckCircle2 as CheckCircle,
    AlertTriangle as Warning,
    Check,
    Image as Images,
    AlertCircle as WarningCircle,
    Wand2 as MagicWand,
    HelpCircle as Question,
    Upload,
    X,
    FileImage,
    ImagePlus,
    History as HistoryIcon,
    RotateCcw,
    Sparkles,
    Split,
    Info,
    Star
} from "lucide-react"
import { TutorialDialog } from "@/components/TutorialDialog"
import { CopyWorkflowPopup } from "@/components/CopyWorkflowPopup"
import { GenerationHistory } from "@/components/GenerationHistory"
import { FloatingHelpButton } from "@/components/FloatingHelpButton"
import { useGenerationHistory } from "@/hooks/useGenerationHistory"
import { HistoryItem } from "@/types/generator"
import { useSearchParams } from "next/navigation"
import { useClipboard } from "@/hooks/useClipboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { PRESETS_ANTES_DEPOIS } from "@/constants/presets"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface UploadedFile {
    file: File;
    previewUrl: string;
    name: string;
}

function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

const CAMERA_ANGLE_OPTIONS = [
    { value: "none", label: "Não especificar" },
    { value: "front facing, straight on view", label: "📸 Frontal Direto" },
    { value: "45-degree angled angle view", label: "📐 45 Graus (Isométrico)" },
    { value: "extreme close-up detail shot", label: "🔍 Close de Detalhe/Textura" },
    { value: "top-down aerial view", label: "🚁 Vista Aérea (Top-down)" },
]

interface AntesDepoisPayload {
    mode: "simple" | "advanced";
    generationMode?: "both" | "only_before" | "only_after";
    niche?: string;
    nicheOther?: string;
    focus?: string;
    focusOther?: string;
    stateBefore?: string;
    stateBeforeOther?: string;
    stateAfter?: string;
    stateAfterOther?: string;
    style?: string;
    styleOther?: string;
    cameraAngle?: string;
    nicheAdv?: string;
    focusAdv?: string;
    stateBeforeAdv?: string;
    stateAfterAdv?: string;
    negativeAdv?: string;
    hasAfterPhoto?: boolean;
}

function AntesEDepoisContent() {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
    const [isTutorialOpen, setIsTutorialOpen] = useState(false)
    const [showWorkflowPopup, setShowWorkflowPopup] = useState(false)

    const { history, saveHistory } = useGenerationHistory<AntesDepoisPayload>("antes-depois")
    const searchParams = useSearchParams()

    const handleRestore = (item: HistoryItem<AntesDepoisPayload>) => {
        const p = item.payload;
        if (!p) return;

        setMode(p.mode || "simple");
        setGenerationMode(p.generationMode || "both");
        setCameraAngle(p.cameraAngle || "none");
        setNiche(p.niche || "");
        setNicheOther(p.nicheOther || "");
        setFocus(p.focus || "the entire scene");
        setFocusOther(p.focusOther || "");
        setStateBefore(p.stateBefore || "extremely dirty, covered in grime and stains");
        setStateBeforeOther(p.stateBeforeOther || "");
        setStateAfter(p.stateAfter || "spotless, shining like new and pristine");
        setStateAfterOther(p.stateAfterOther || "");
        setStyle(p.style || "photorealistic, highly detailed, captured with DSLR camera");
        setStyleOther(p.styleOther || "");
        setNicheAdv(p.nicheAdv || "");
        setFocusAdv(p.focusAdv || "");
        setStateBeforeAdv(p.stateBeforeAdv || "");
        setStateAfterAdv(p.stateAfterAdv || "");
        setNegativeAdv(p.negativeAdv || "");
        
        setGeneratedPrompt(item.prompt || "");
        setSelectedPreset("");
    };

    // Handle Restore Effect
    useEffect(() => {
        const restoreId = searchParams.get('restore_id')
        if (restoreId && history.length > 0) {
            const itemToRestore = history.find((item: HistoryItem<AntesDepoisPayload>) => item.id === restoreId)
            if (itemToRestore) {
                handleRestore(itemToRestore)
            }
        }
    }, [searchParams, history])

    const [mode, setMode] = useState<"simple" | "advanced">("simple")
    const [generationMode, setGenerationMode] = useState<"both" | "only_before" | "only_after">("both")
    const [cameraAngle, setCameraAngle] = useState("none")
    const [referencePhotoUrl, setReferencePhotoUrl] = useState("")
    const referencePhotoInputRef = useRef<HTMLInputElement>(null)
    
    // States - Simple Mode
    const [niche, setNiche] = useState("")
    const [nicheOther, setNicheOther] = useState("")
    const [focus, setFocus] = useState("the entire scene")
    const [focusOther, setFocusOther] = useState("")
    const [stateBefore, setStateBefore] = useState("extremely dirty, covered in grime and stains")
    const [stateBeforeOther, setStateBeforeOther] = useState("")
    const [stateAfter, setStateAfter] = useState("spotless, shining like new and pristine")
    const [stateAfterOther, setStateAfterOther] = useState("")
    const [style, setStyle] = useState("photorealistic, highly detailed, captured with DSLR camera")
    const [styleOther, setStyleOther] = useState("")

    // States - Advanced Mode
    const [nicheAdv, setNicheAdv] = useState("")
    const [focusAdv, setFocusAdv] = useState("")
    const [stateBeforeAdv, setStateBeforeAdv] = useState("")
    const [stateAfterAdv, setStateAfterAdv] = useState("")
    const [negativeAdv, setNegativeAdv] = useState("")

    // Global State
    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const { isCopied, copy } = useClipboard()

    const handlePresetClick = (id: string) => {
        setSelectedPreset(id);
        const preset = PRESETS_ANTES_DEPOIS.find(p => p.id === id);
        if (preset) {
            setMode("simple");
            setNiche(preset.data.niche);
            setFocus(preset.data.focus);
            setStateBefore(preset.data.stateBefore);
            setStateAfter(preset.data.stateAfter);
            setStyle(preset.data.style);

            setNicheOther("");
            setFocusOther("");
            setStateBeforeOther("");
            setStateAfterOther("");
            setStyleOther("");
        }
    }

    const handleReferencePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const b64 = await toBase64(file);
        setReferencePhotoUrl(b64);
    };

    const handleGenerate = () => {
        setIsGenerating(true)

        let finalNiche, finalFocus, finalStateBefore, finalStateAfter;
        const finalStyle = style === 'other' ? styleOther : style;

        if (mode === 'simple') {
            finalNiche = niche === 'other' ? nicheOther : niche;
            finalFocus = focus === 'other' ? focusOther : focus;
            finalStateBefore = stateBefore === 'other' ? stateBeforeOther : stateBefore;
            finalStateAfter = stateAfter === 'other' ? stateAfterOther : stateAfter;
        } else {
            finalNiche = nicheAdv;
            finalFocus = focusAdv;
            finalStateBefore = stateBeforeAdv;
            finalStateAfter = stateAfterAdv;

            if (!finalNiche || !finalFocus || (generationMode !== 'only_after' && !finalStateBefore) || (generationMode !== 'only_before' && !finalStateAfter)) {
                toast.error("Por favor, preencha todos os campos do modo avançado cruzados com *.");
                setIsGenerating(false);
                return;
            }
        }

        let prompt = "";
        const cameraAngleStr = cameraAngle !== "none" ? ` ${cameraAngle}` : "";

        if (generationMode === 'only_before') {
            prompt = `[USE UPLOADED IMAGE AS REFERENCE]\nI am providing the final pristine "After" result of a ${finalNiche} service. Please generate ONLY the "Before" version (the problem state) of this exact same environment.\n\nMaintain the exact same composition, lighting, and${cameraAngleStr ? cameraAngleStr + " camera angle" : " angle"}. The problem state should be: ${finalStateBefore} ${finalFocus}. Highly detailed, ${finalStyle}. NO TEXT, NO LETTERS, NO WORDS.`;
        } else if (generationMode === 'only_after') {
            prompt = `[USE UPLOADED IMAGE AS REFERENCE]\nI am providing the "Before" problem state of a ${finalNiche} service. Please generate ONLY the pristine "After" version (the solution state) of this exact same environment.\n\nMaintain the exact same composition, lighting, and${cameraAngleStr ? cameraAngleStr + " camera angle" : " angle"}. The solution state should be: ${finalStateAfter} ${finalFocus}. Highly detailed, ${finalStyle}. NO TEXT, NO LETTERS, NO WORDS.`;
        } else {
            prompt = `A side-by-side split-screen comparison photograph. On the left side, the 'Before': ${finalStateBefore} ${finalFocus} in a ${finalNiche} context. On the right side, the 'After': ${finalStateAfter} ${finalFocus}. Both sides feature realistic lighting,${cameraAngleStr ? cameraAngleStr + " perspective," : ""} ${finalStyle}. Clean professional aesthetics, highly detailed. NO TEXT, NO LETTERS, NO WORDS in the image.`;
        }

        if (mode === 'advanced' && negativeAdv) {
            prompt += `\n\n[NEGATIVE PROMPT]: ${negativeAdv}`;
        }

        setGeneratedPrompt(prompt)

        setTimeout(() => {
            setIsGenerating(false)
            let finalStr = prompt

            saveHistory({
                mode, generationMode, niche, nicheOther, focus, focusOther, stateBefore, stateBeforeOther,
                stateAfter, stateAfterOther, style, styleOther, cameraAngle, nicheAdv, focusAdv,
                stateBeforeAdv, stateAfterAdv, negativeAdv, hasAfterPhoto: !!referencePhotoUrl
            }, finalStr)
            
            toast.success("Prompt gerado com sucesso!")
        }, 800)
    }

    const handleClear = () => {
        setNiche("")
        setNicheOther("")
        setFocus("the entire scene")
        setFocusOther("")
        setStateBefore("extremely dirty, covered in grime and stains")
        setStateBeforeOther("")
        setStateAfter("spotless, shining like new and pristine")
        setStateAfterOther("")
        setStyle("photorealistic, highly detailed, captured with DSLR camera")
        setStyleOther("")
        setNicheAdv("")
        setFocusAdv("")
        setStateBeforeAdv("")
        setStateAfterAdv("")
        setNegativeAdv("")
        setReferencePhotoUrl("")
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    const handleCopy = () => {
        copy(generatedPrompt)
        setShowWorkflowPopup(true)
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
                                    <div className="size-14 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-black shadow-xl relative group cursor-help transition-transform hover:scale-110">
                                        <Split size={32} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Creative Comparison Engine</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                Antes <span className="text-primary italic">&</span> Depois
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">ADS VS REALITY SYSTEM</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Crie contrastes perfeitos de <span className="text-foreground font-bold">Antes & Depois</span> para seus anúncios de serviços.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Inputs Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '150ms' }}>

                        {/* Navigation Actions */}
                        <div className="flex items-center justify-between mb-2">
                            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                                <Link href="/docs/nichos" className="flex items-center gap-2">
                                    <BookOpen size={18} />
                                    <span>Documentação de Nichos</span>
                                </Link>
                            </Button>
                        </div>

                        {/* Presets Gallery */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 relative space-y-0">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Presets de Campanha <span className="text-primary text-xl">↓</span>
                                </CardTitle>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-wider text-[10px]">
                                    READY-TO-USE
                                </Badge>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8">
                                <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory perspective-1000">
                                    {PRESETS_ANTES_DEPOIS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handlePresetClick(preset.id)}
                                            className={cn(
                                                "relative w-[145px] h-[110px] shrink-0 rounded-xl overflow-hidden group text-left border-2 transition-all p-3 flex flex-col justify-end bg-input/50 snap-start",
                                                selectedPreset === preset.id ? "border-primary shadow-[0_0_20px_rgba(255,184,0,0.2)] z-10 scale-[1.02]" : "border-transparent border hover:border-border/50"
                                            )}
                                        >
                                            <img
                                                src={preset.image}
                                                alt={preset.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-[-1px] bg-gradient-to-t from-black/95 via-black/60 to-black/10 pointer-events-none" />

                                            <div className={cn(
                                                "absolute top-2 right-2 size-5 rounded-md border flex items-center justify-center transition-colors shadow-sm",
                                                selectedPreset === preset.id ? "bg-primary border-primary text-black" : "border-white/30 bg-black/40 backdrop-blur-sm"
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

                        {/* Setup Creative Context */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 relative">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-orange-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                                        <Sparkle size={28} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">Setup do Criativo</CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground mt-1 font-bold italic tracking-wider uppercase">CONTRASTE ENGINE</CardDescription>
                                    </div>
                                </div>

                                <div className="flex bg-muted p-1 rounded-xl shadow-inner border border-border">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", mode === 'simple' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <ListChecks size={18} /> Automático
                                    </button>
                                    <button
                                        onClick={() => setMode("advanced")}
                                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", mode === 'advanced' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <TerminalWindow size={18} /> Expert
                                    </button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8 space-y-8">
                                {/* Toggle Generation Mode */}
                                <div className="flex flex-col gap-4">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] px-2">Modo de Comparação</Label>
                                    <div className="flex bg-muted p-1 rounded-2xl w-full border border-border shadow-inner">
                                        <button
                                            onClick={() => setGenerationMode("both")}
                                            className={cn("flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all", generationMode === 'both' ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]' : 'text-muted-foreground hover:text-foreground')}
                                        >
                                            Split Screen
                                        </button>
                                        <button
                                            onClick={() => setGenerationMode("only_before")}
                                            className={cn("flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all", generationMode === 'only_before' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-[1.02]' : 'text-muted-foreground hover:text-foreground')}
                                        >
                                            <ImagePlus size={16} /> Só o Antes
                                        </button>
                                        <button
                                            onClick={() => setGenerationMode("only_after")}
                                            className={cn("flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all", generationMode === 'only_after' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-[1.02]' : 'text-muted-foreground hover:text-foreground')}
                                        >
                                            <ImagePlus size={16} /> Só o Depois
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground px-2 font-medium italic">* Use os modos unitários se já tiver uma das fotos reais para servir de referência.</p>
                                </div>

                                <Separator />

                                {mode === 'simple' ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nicho / Indústria</Label>
                                                <Select value={niche} onValueChange={setNiche}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">🏗️ Construção</SelectLabel>
                                                            <SelectItem value="Construction">Construction</SelectItem>
                                                            <SelectItem value="Kitchen Remodel">Kitchen Remodel</SelectItem>
                                                            <SelectItem value="Basement Finishing">Basement Finishing</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">🎨 Acabamentos</SelectLabel>
                                                            <SelectItem value="House Painting">House Painting</SelectItem>
                                                            <SelectItem value="Roof Repair">Roof Repair</SelectItem>
                                                            <SelectItem value="LVP Installation">LVP Installation</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">🌿 Exterior</SelectLabel>
                                                            <SelectItem value="Landscaping">Landscaping</SelectItem>
                                                            <SelectItem value="Power Washing">Power Washing</SelectItem>
                                                            <SelectItem value="Auto Detailing">Auto Detailing</SelectItem>
                                                        </SelectGroup>
                                                        <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {niche === 'other' && <Input placeholder="Especifique..." value={nicheOther} onChange={e => setNicheOther(e.target.value)} className="mt-2" />}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Foco Visual</Label>
                                                <Select value={focus} onValueChange={setFocus}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="the entire scene">A cena inteira (Wide)</SelectItem>
                                                        <SelectItem value="the main surface">Superfície Principal</SelectItem>
                                                        <SelectItem value="the specific detail">Detalhe Específico (Close)</SelectItem>
                                                        <SelectItem value="other">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-2xl border border-border shadow-inner relative overflow-hidden group">
                                            {generationMode === 'only_after' ? (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-2">
                                                        <FileImage size={14} /> Foto Antes (Original)
                                                    </Label>
                                                    <div
                                                        onClick={() => referencePhotoInputRef.current?.click()}
                                                        className="border-2 border-dashed border-border hover:border-amber-500/50 bg-input/20 rounded-xl p-4 text-center cursor-pointer transition-all group flex flex-col items-center justify-center h-[140px] relative overflow-hidden"
                                                    >
                                                        {referencePhotoUrl ? (
                                                            <>
                                                                <img src={referencePhotoUrl} alt="Antes" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <RotateCcw className="text-white size-8" />
                                                                </div>
                                                                <Button size="icon" variant="destructive" className="absolute top-2 right-2 size-6 rounded-full" onClick={(e) => { e.stopPropagation(); setReferencePhotoUrl(""); }}><X size={12} /></Button>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Upload size={28} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Upload Inicial</span>
                                                            </div>
                                                        )}
                                                        <input ref={referencePhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleReferencePhotoUpload} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2">
                                                        <Warning size={14} /> Estado: Antes (Problema)
                                                    </Label>
                                                    <Select value={stateBefore} onValueChange={setStateBefore}>
                                                        <SelectTrigger className="border-red-500/20 bg-background focus:ring-red-500/20">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="extremely dirty, covered in grime and stains">Sujo / Manchado</SelectItem>
                                                            <SelectItem value="broken, damaged and worn out">Quebrado / Desgastado</SelectItem>
                                                            <SelectItem value="old, outdated and peeling">Velho / Descascando</SelectItem>
                                                            <SelectItem value="other">Outro (Custom)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {stateBefore === 'other' && <Input placeholder="Prompt de problemas..." value={stateBeforeOther} onChange={e => setStateBeforeOther(e.target.value)} className="mt-2 text-xs" />}
                                                </div>
                                            )}

                                            {generationMode === 'only_before' ? (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-2">
                                                        <FileImage size={14} /> Foto Depois (Resultado)
                                                    </Label>
                                                    <div
                                                        onClick={() => referencePhotoInputRef.current?.click()}
                                                        className="border-2 border-dashed border-border hover:border-amber-500/50 bg-input/20 rounded-xl p-4 text-center cursor-pointer transition-all group flex flex-col items-center justify-center h-[140px] relative overflow-hidden"
                                                    >
                                                        {referencePhotoUrl ? (
                                                            <>
                                                                <img src={referencePhotoUrl} alt="Depois" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <RotateCcw className="text-white size-8" />
                                                                </div>
                                                                <Button size="icon" variant="destructive" className="absolute top-2 right-2 size-6 rounded-full" onClick={(e) => { e.stopPropagation(); setReferencePhotoUrl(""); }}><X size={12} /></Button>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Upload size={28} className="text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Upload Final</span>
                                                            </div>
                                                        )}
                                                        <input ref={referencePhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleReferencePhotoUpload} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2">
                                                        <CheckCircle size={14} /> Estado: Depois (Sucesso)
                                                    </Label>
                                                    <Select value={stateAfter} onValueChange={setStateAfter}>
                                                        <SelectTrigger className="border-emerald-500/20 bg-background focus:ring-emerald-500/20">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="spotless, shining like new and pristine">Brilhando / Novo</SelectItem>
                                                            <SelectItem value="fully repaired, professional finish">Reparado / Pro</SelectItem>
                                                            <SelectItem value="modern, fresh and beautiful">Moderno / Renovado</SelectItem>
                                                            <SelectItem value="other">Outro (Custom)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {stateAfter === 'other' && <Input placeholder="Prompt de solução..." value={stateAfterOther} onChange={e => setStateAfterOther(e.target.value)} className="mt-2 text-xs" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Indústria <span className="text-red-500">*</span></Label>
                                                <Input placeholder="Ex: Kitchen Remodel, Power Washing..." value={nicheAdv} onChange={e => setNicheAdv(e.target.value)} className="bg-card h-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Elemento <span className="text-red-500">*</span></Label>
                                                <Input placeholder="Ex: Backyard deck, car seats..." value={focusAdv} onChange={e => setFocusAdv(e.target.value)} className="bg-card h-12" />
                                            </div>
                                        </div>

                                        <div className="bg-muted p-6 rounded-2xl border border-border space-y-4">
                                            {generationMode !== 'only_after' && (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-red-500 uppercase px-1">Descrição do Problema <span className="text-red-500">*</span></Label>
                                                    <Textarea placeholder="Prompt do estado ANTES..." value={stateBeforeAdv} onChange={e => setStateBeforeAdv(e.target.value)} className="bg-card min-h-[80px]" />
                                                </div>
                                            )}
                                            {generationMode !== 'only_before' && (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-emerald-500 uppercase px-1">Descrição da Solução <span className="text-red-500">*</span></Label>
                                                    <Textarea placeholder="Prompt do estado DEPOIS..." value={stateAfterAdv} onChange={e => setStateAfterAdv(e.target.value)} className="bg-card min-h-[80px]" />
                                                </div>
                                            )}
                                            <div className="space-y-2 pt-2">
                                                <Label className="text-[10px] font-black text-muted-foreground uppercase px-1 opacity-60">Negativo (Não ter)</Label>
                                                <Textarea placeholder="Ex: text, messy floors..." value={negativeAdv} onChange={e => setNegativeAdv(e.target.value)} className="bg-card min-h-[60px] text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Perspectiva</Label>
                                        <Select value={cameraAngle} onValueChange={setCameraAngle}>
                                            <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {CAMERA_ANGLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estilo Fotográfico</Label>
                                        <Select value={style} onValueChange={setStyle}>
                                            <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="photorealistic, highly detailed, captured with DSLR camera">Fotorrealista (DSLR)</SelectItem>
                                                <SelectItem value="raw street photography style, high contrast, iphone photo">UGC Style (iPhone Raw)</SelectItem>
                                                <SelectItem value="commercial bright lighting, sharp focus">Comercial / Estúdio</SelectItem>
                                                <SelectItem value="other">Outro (Custom)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-6">
                                    <Button
                                        onClick={handleGenerate}
                                        className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] rounded-2xl bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? <RotateCcw className="animate-spin size-6" /> : "Gerar Comparação"}
                                    </Button>
                                    <div className="flex justify-center mt-4 gap-4">
                                        <button onClick={handleClear} className="text-[10px] font-black uppercase text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 tracking-widest">
                                            <X size={12} /> Limpar campos
                                        </button>
                                        <button onClick={() => setIsTutorialOpen(true)} className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 tracking-widest">
                                            <Info size={12} /> Mostrar Manual
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
                                        <TerminalWindow size={24} className="text-primary" />
                                        Prompt Final
                                    </CardTitle>
                                    <Badge className="bg-primary/20 text-primary border-none font-extrabold uppercase tracking-wider text-[0.65rem]">
                                        ADS READY
                                    </Badge>
                                </div>
                            </CardHeader>

                            <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-start gap-3">
                                <span className="text-2xl mt-0.5 animate-pulse">📷</span>
                                <div>
                                    <h3 className="text-primary font-bold text-sm tracking-tight mb-1">Como usar no Midjourney?</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                                        Use este prompt no <strong className="text-foreground">MJ v6.1</strong> com a tag <code className="bg-muted px-1 rounded">--ar 16:9</code> ou <code className="bg-muted px-1 rounded">--ar 4:5</code> dependendo do formato do anúncio.
                                    </p>
                                </div>
                            </div>

                            <CardContent className="p-6 min-h-[300px] flex flex-col">
                                {generatedPrompt ? (
                                    <div className="flex-1 flex flex-col">
                                        <Textarea
                                            className="flex-1 bg-input border-none text-foreground placeholder:text-muted-foreground resize-none min-h-[250px] text-[13px] font-mono p-4 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl custom-scrollbar leading-relaxed"
                                            readOnly
                                            value={generatedPrompt}
                                        />

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={() => {}} // Integration for favorites if available
                                                className="bg-input hover:bg-muted-foreground/20 text-muted-foreground border-none"
                                            >
                                                <Star size={18} className="mr-2" />
                                                Favoritar
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
                                        <Sparkles size={48} className="text-primary mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm font-medium">
                                            Configure as fotos e clique em <strong>Gerar Comparação</strong> para ver o prompt estruturado.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-8 animate-fade-up" style={{ animationDelay: '450ms' }}>
                    <GenerationHistory
                        history={history}
                        onRestore={handleRestore}
                        generatorName="antes-depois"
                    />
                </div>
            </div>

            <FloatingHelpButton pageTitle="Antes & Depois" />
            <CopyWorkflowPopup
                open={showWorkflowPopup}
                onClose={() => setShowWorkflowPopup(false)}
                prompt={generatedPrompt}
                referenceImageUrl={referencePhotoUrl || undefined}
                imageLabel={generationMode === 'only_before' ? 'Foto Depois (Resultado)' : generationMode === 'only_after' ? 'Foto Antes (Original)' : undefined}
            />
            <TutorialDialog 
                isOpen={isTutorialOpen} 
                onOpenChange={setIsTutorialOpen}
                pageTitle="Antes & Depois"
                title="Manual de Comparações"
                steps={[
                    { title: "Define o Nicho", description: "Escolha o serviço (ex: Pintura, Limpeza) para a IA entender o contexto." },
                    { title: "Escolha o Modo", description: "Split Screen gera duas fotos juntas. Modos individuais usam sua foto real como base — copie o prompt E faça upload da imagem na ferramenta de IA." },
                    { title: "Estilo Fotográfico", description: "Use 'UGC Style' para parecer uma foto tirada por um cliente real, gera mais confiança." }
                ]}
            />
        </div>
    );
}

export default function AntesEDepoisPage() {
    return (
        <Suspense fallback={
            <div className="max-w-[1400px] mx-auto px-6 mt-32 space-y-12 text-center">
                <Skeleton className="h-12 w-1/3 mx-auto rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <Skeleton className="h-[200px] w-full rounded-[24px]" />
                        <Skeleton className="h-[600px] w-full rounded-[24px]" />
                    </div>
                    <div className="lg:col-span-5">
                        <Skeleton className="h-[500px] w-full rounded-[24px]" />
                    </div>
                </div>
            </div>
        }>
            <AntesEDepoisContent />
        </Suspense>
    );
}
