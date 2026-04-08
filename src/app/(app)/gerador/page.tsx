"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    BookOpen,
    ListChecks,
    Terminal as TerminalWindow,
    Sparkles as Sparkle,
    Copy,
    CheckCircle2 as CheckCircle,
    Check,
    Wand2 as MagicWand,
    HelpCircle as Question,
    Star,
    Sparkles,
    RotateCcw,
    Zap,
    Cpu,
    Camera
} from "lucide-react"
import { useGenerationHistory } from "@/hooks/useGenerationHistory"
import { HistoryItem } from "@/types/generator"
import { useFavorites } from "@/hooks/useFavorites"
import { GenerationHistory } from "@/components/GenerationHistory"
import { FloatingHelpButton } from "@/components/FloatingHelpButton"
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
import { PRESETS_GERADOR } from "@/constants/presets"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

interface GeradorPayload {
    mode: "simple" | "advanced";
    niche?: string;
    nicheOther?: string;
    style?: string;
    styleOther?: string;
    environment?: string;
    environmentOther?: string;
    lighting?: string;
    lightingOther?: string;
    location?: string;
    locationOther?: string;
    objective?: string;
    objectiveOther?: string;
    targetAI?: string;
    nicheAdv?: string;
    styleAdv?: string;
    environmentAdv?: string;
    lightingAdv?: string;
    locationAdv?: string;
    objectiveAdv?: string;
    negativeAdv?: string;
    subject?: string;
}

function GeradorContent() {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
    const [mode, setMode] = useState<"simple" | "advanced">("simple")

    // States - Simple Mode
    const [niche, setNiche] = useState("")
    const [nicheOther, setNicheOther] = useState("")
    const [style, setStyle] = useState("photorealistic")
    const [styleOther, setStyleOther] = useState("")
    const [environment, setEnvironment] = useState("residential")
    const [environmentOther, setEnvironmentOther] = useState("")
    const [lighting, setLighting] = useState("natural-daylight")
    const [lightingOther, setLightingOther] = useState("")
    const [location, setLocation] = useState("florida")
    const [locationOther, setLocationOther] = useState("")
    const [objective, setObjective] = useState("service")
    const [objectiveOther, setObjectiveOther] = useState("")
    const [targetAI, setTargetAI] = useState("standard")

    // States - Advanced Mode
    const [nicheAdv, setNicheAdv] = useState("")
    const [styleAdv, setStyleAdv] = useState("")
    const [environmentAdv, setEnvironmentAdv] = useState("")
    const [lightingAdv, setLightingAdv] = useState("")
    const [locationAdv, setLocationAdv] = useState("")
    const [objectiveAdv, setObjectiveAdv] = useState("")
    const [negativeAdv, setNegativeAdv] = useState("")

    // Global State
    const [subject, setSubject] = useState("")
    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const { isCopied, copy } = useClipboard()

    // History & Favorites Hooks
    const { history, saveHistory } = useGenerationHistory<GeradorPayload>("gerador")
    const { isFavorited, toggleFavorite } = useFavorites()
    const searchParams = useSearchParams()
    const [pendingRestoreItem, setPendingRestoreItem] = useState<HistoryItem<GeradorPayload> | null>(null)

    const hasUserData = () => {
        return !!(subject || niche || (mode === 'advanced' && (nicheAdv || styleAdv || environmentAdv || lightingAdv || locationAdv || objectiveAdv || negativeAdv)))
    }

    useEffect(() => {
        const restoreId = searchParams.get('restore_id')
        if (restoreId && history.length > 0) {
            const itemToRestore = history.find((item: HistoryItem<GeradorPayload>) => item.id === restoreId)
            if (itemToRestore) {
                if (hasUserData()) {
                    setPendingRestoreItem(itemToRestore)
                } else {
                    doRestore(itemToRestore)
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, history])

    const handleRestore = (item: HistoryItem<GeradorPayload>) => {
        if (hasUserData()) {
            setPendingRestoreItem(item)
        } else {
            doRestore(item)
        }
    }

    const doRestore = (item: HistoryItem<GeradorPayload>) => {
        const p = item.payload;
        if (!p) return;

        setMode(p.mode || "simple")

        // Simple
        setNiche(p.niche || "")
        setNicheOther(p.nicheOther || "")
        setStyle(p.style || "photorealistic")
        setStyleOther(p.styleOther || "")
        setEnvironment(p.environment || "residential")
        setEnvironmentOther(p.environmentOther || "")
        setLighting(p.lighting || "natural-daylight")
        setLightingOther(p.lightingOther || "")
        setLocation(p.location || "florida")
        setLocationOther(p.locationOther || "")
        setObjective(p.objective || "service")
        setObjectiveOther(p.objectiveOther || "")
        setTargetAI(p.targetAI || "standard")

        // Advanced
        setNicheAdv(p.nicheAdv || "")
        setStyleAdv(p.styleAdv || "")
        setEnvironmentAdv(p.environmentAdv || "")
        setLightingAdv(p.lightingAdv || "")
        setLocationAdv(p.locationAdv || "")
        setObjectiveAdv(p.objectiveAdv || "")
        setNegativeAdv(p.negativeAdv || "")

        // Global
        setSubject(p.subject || "")
        setGeneratedPrompt(item.prompt || "")
        setSelectedPreset("")
        toast.success("Prompt restaurado!", { description: "As configurações foram carregadas no gerador." })
    }

    const handlePresetClick = (id: string) => {
        setSelectedPreset(id);
        const preset = PRESETS_GERADOR.find(p => p.id === id);
        if (preset) {
            setMode("simple");
            setNiche(preset.data.niche);
            setStyle(preset.data.style);
            setEnvironment(preset.data.environment);
            setLighting(preset.data.lighting);
            setLocation(preset.data.location);
            setObjective(preset.data.objective);
            setSubject(preset.data.subject);

            // Clear other fields to keep it clean
            setNicheOther("");
            setStyleOther("");
            setEnvironmentOther("");
            setLightingOther("");
            setLocationOther("");
            setObjectiveOther("");
        }
    }

    const handleGenerate = () => {
        setIsGenerating(true)
        let promptParts: string[] = []

        // Logic here is correct from previous version, just wrapping in visualization
        const nicheContexts: Record<string, string> = {
            'painting': 'professional house painter, wearing uniform, applying flawless paint, fine interior painting',
            'construction': 'professional construction worker, wearing hard hat and safety vest, construction equipment',
            'cleaning': 'professional residential cleaner, wearing uniform, spotless clean room, cleaning supplies',
            'flooring': 'professional flooring installer, laying down premium hardwood flooring, meticulous craftsmanship',
            'hardwood-flooring': 'specialist wood floor installer, high-end solid oak hardwood planks, precision craftsmanship',
            'luxury-vinyl-plank': 'pro floor contractor, installing modern luxury vinyl plank (LVP), interlocking wood texture planks',
            'laminate-flooring': 'contractor installing premium wood-style laminate planks, flawless floor surface',
            'landscaping': 'professional landscaper, manicured lawn, beautiful garden design, landscaping equipment',
            'hvac': 'professional HVAC technician, inspecting AC unit, well-lit utility room, modern equipment',
            'plumbing': 'professional plumber, fixing modern plumbing fixtures, clean under-sink area, high quality work',
            'electrical': 'professional electrician, working on electrical panel, safety gear, bright lighting',
            'roofing': 'professional roofer, working on residential roof, safety harness, clear sky'
        };

        const nicheNohumanContexts: Record<string, string> = {
            'painting': 'freshly painted walls, professional paint finish, painting tools arranged neatly',
            'construction': 'completed construction work, structural details, building materials',
            'cleaning': 'immaculate sparkling room, organized space, cleaning equipment on the side',
            'flooring': 'premium hardwood floor installation, flawless wood grain, carpentry details',
            'hardwood-flooring': 'luxury solid wood floor, rich grain texture, pristine hardwood finish',
            'luxury-vinyl-plank': 'modern LVP floor, wood-look waterproof planks, seamless contemporary flooring',
            'laminate-flooring': 'high-quality laminate floor, realistic wood appearance, smooth flooring surface',
            'landscaping': 'manicured lawn, beautiful garden design, landscaping work',
            'hvac': 'modern HVAC unit installation, piping and electrical details',
            'plumbing': 'installed plumbing fixtures, clean sink area, modern chrome finish',
            'electrical': 'neatly wired electrical panel, modern switches, professional installation',
            'roofing': 'newly installed roof shingles, clean rooflines, clear sky background'
        };

        const objectiveModifiers: Record<string, string> = {
            'product': 'commercial product photography, high-quality lens, focus on tools and materials, sharp details',
            'no-people': 'clean environment, showcase of completed work, empty of people, wide shot',
            'service': 'action-oriented shot, showing the professional service being performed with care and expertise'
        };

        const styleModifiers: Record<string, string> = {
            'photorealistic': 'hyper detailed, photorealistic, 8k resolution, highly detailed photography',
            'cinematic': 'cinematic shot, cinematic lighting, movie still, 35mm lens, highly detailed',
            'commercial': 'commercial photography, magazine cover, ultra polished, professional ad campaign',
            'iphone-photo': 'shot on iPhone 15 Pro Max, casual social media photo, unedited, spontaneous, realistic day in the life',
            'drone-view': 'drone aerial view, birds eye view, wide landscape, dji mavic 3 pro',
            'minimalist': 'minimalist composition, clean lines, negative space, simple color palette, modern aesthetic',
            '3d-render': 'unreal engine 5 render, highly detailed 3D artwork, octane render, architectural visualization'
        };

        const envModifiers: Record<string, string> = {
            'residential': 'in a beautiful modern residential home, cleanly decorated, natural colors',
            'commercial-building': 'in a modern commercial office building, corporate environment',
            'luxury-home': 'in a high-end luxury estate, expensive furniture, large windows',
            'suburban-neighborhood': 'in a classic American suburban neighborhood, pleasant weather',
            'construction-site': 'active commercial construction site in the background, organized and safe',
            'outdoor': 'outdoors, exterior view, bright daylight, clear sky, street view',
            'modern-office': 'in a bright modern office with glass walls and contemporary furniture',
            'warehouse': 'inside a large organized industrial warehouse with high ceilings'
        };

        const locationModifiers: Record<string, string> = {
            'florida': 'Florida style',
            'new-england': 'New England style',
            'california': 'California style',
            'texas': 'Texas style',
            'midwest': 'American Midwest style'
        };

        const lightModifiers: Record<string, string> = {
            'natural-daylight': 'bright natural daylight, sunlit room, soft shadows',
            'golden-hour': 'golden hour lighting, warm sunset light, beautiful glowing atmosphere',
            'bright-sunny': 'bright sunny day, clear blue sky, vivid colors',
            'studio-lighting': 'professional studio lighting, rim light, softbox lighting, perfect exposure',
            'overcast': 'overcast lighting, soft diffused light, moody atmosphere'
        };

        if (mode === 'simple') {
            const finalNiche = niche === 'other' ? nicheOther : niche
            const finalStyle = style === 'other' ? styleOther : style
            const finalEnvironment = environment === 'other' ? environmentOther : environment
            const finalLighting = lighting === 'other' ? lightingOther : lighting
            const finalLocation = location === 'other' ? locationOther : location
            const finalObjective = objective === 'other' ? objectiveOther : objective

            let baseSubject = ''
            if (finalObjective === 'no-people' || finalObjective === 'product') {
                if (subject) {
                    baseSubject = subject.replace(/painter|worker|technician|cleaner|pro|professional|person|man|woman|people|personne/gi, 'detail')
                } else if (finalNiche && nicheNohumanContexts[finalNiche]) {
                    baseSubject = nicheNohumanContexts[finalNiche]
                } else if (finalNiche) {
                    baseSubject = `A detail of ${finalNiche} work`
                } else {
                    baseSubject = 'A high quality home service work detail'
                }
            } else {
                if (subject) {
                    baseSubject = subject
                    if (finalNiche && nicheContexts[finalNiche]) baseSubject += `, ${nicheContexts[finalNiche]}`
                    else if (finalNiche) baseSubject += `, professional ${finalNiche}`
                } else if (finalNiche && nicheContexts[finalNiche]) {
                    baseSubject = nicheContexts[finalNiche]
                } else if (finalNiche) {
                    baseSubject = `A professional ${finalNiche}`
                } else {
                    baseSubject = 'A professional home service scene'
                }
            }
            promptParts.push(baseSubject)

            if (finalObjective && objectiveModifiers[finalObjective]) promptParts.push(objectiveModifiers[finalObjective])
            if (finalLocation && locationModifiers[finalLocation]) promptParts.push(locationModifiers[finalLocation])
            if (finalEnvironment && envModifiers[finalEnvironment]) promptParts.push(envModifiers[finalEnvironment])
            if (finalLighting && lightModifiers[finalLighting]) promptParts.push(lightModifiers[finalLighting])
            if (finalStyle && styleModifiers[finalStyle]) promptParts.push(styleModifiers[finalStyle])

            let promptStr = promptParts.join(', ') + '.';

            if (targetAI === 'midjourney') promptStr += " --v 6.1 --stylize 250";
            if (targetAI === 'dalle') promptStr = "A high-quality professional photograph: " + promptStr;
            if (targetAI === 'imagefx') promptStr += " shot on professional mirrorless camera, highly detailed.";

            setGeneratedPrompt(promptStr);
            setTimeout(() => {
                setIsGenerating(false)
                saveHistory({
                    mode, niche, nicheOther, style, styleOther, environment, environmentOther, lighting, lightingOther, location, locationOther, objective, objectiveOther, nicheAdv, styleAdv, environmentAdv, lightingAdv, locationAdv, objectiveAdv, negativeAdv, subject, targetAI
                }, promptStr)
            }, 800)
        } else {
            if (subject) promptParts.push(subject)
            if (nicheAdv) promptParts.push(nicheAdv)
            if (objectiveAdv) promptParts.push(objectiveAdv)
            if (locationAdv) promptParts.push(locationAdv)
            if (environmentAdv) promptParts.push(environmentAdv)
            if (lightingAdv) promptParts.push(lightingAdv)
            if (styleAdv) promptParts.push(styleAdv)

            let finalPrompt = promptParts.join(', ') + '.'
            if (negativeAdv) {
                finalPrompt += `\n\n[NEGATIVE PROMPT]: ${negativeAdv}`
            }
            setGeneratedPrompt(finalPrompt)
            setTimeout(() => {
                setIsGenerating(false)
                saveHistory({
                    mode, niche, nicheOther, style, styleOther, environment, environmentOther, lighting, lightingOther, location, locationOther, objective, objectiveOther, nicheAdv, styleAdv, environmentAdv, lightingAdv, locationAdv, objectiveAdv, negativeAdv, subject, targetAI
                }, finalPrompt)
            }, 800)
        }
    }

    const handleClear = () => {
        setNiche("")
        setNicheOther("")
        setStyle("photorealistic")
        setStyleOther("")
        setEnvironment("residential")
        setEnvironmentOther("")
        setLighting("natural-daylight")
        setLightingOther("")
        setLocation("florida")
        setLocationOther("")
        setObjective("service")
        setObjectiveOther("")
        setNicheAdv("")
        setStyleAdv("")
        setEnvironmentAdv("")
        setLightingAdv("")
        setLocationAdv("")
        setObjectiveAdv("")
        setNegativeAdv("")
        setSubject("")
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    const handleCopy = () => copy(generatedPrompt)

    return (
        <div className="flex-1 w-full bg-input/50 relative font-sans">
             {/* Restore Guard AlertDialog */}
             <AlertDialog open={!!pendingRestoreItem} onOpenChange={(open) => { if (!open) setPendingRestoreItem(null) }}>
                <AlertDialogContent className="bg-card border-border rounded-[24px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sobrescrever configurações?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você já tem dados preenchidos no gerador. Restaurar este prompt do histórico irá substituir as configurações atuais.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-input border-border hover:bg-muted" onClick={() => setPendingRestoreItem(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/20"
                            onClick={() => {
                                if (pendingRestoreItem) doRestore(pendingRestoreItem)
                                setPendingRestoreItem(null)
                            }}
                        >
                            Sim, restaurar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 md:py-12">
                {/* Hero */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="flex items-center gap-4 justify-center mb-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="size-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-xl relative group cursor-help transition-transform hover:scale-110">
                                        <MagicWand size={32} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Advanced AI Prompt Factory</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                Gerador <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">PRO</span>
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">REALISM & COMPOSITION SYSTEM</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Estruture prompts comerciais de alto nível para <span className="text-primary font-bold">ImageFX, Midjourney e Dall-E 3</span>.
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
                                    Nichos Sugeridos <span className="text-primary text-xl">↓</span>
                                </CardTitle>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-wider text-[10px]">
                                    ONE-CLICK
                                </Badge>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8">
                                <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory perspective-1000">
                                    {PRESETS_GERADOR.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handlePresetClick(preset.id)}
                                            className={cn(
                                                "relative w-[135px] h-[160px] shrink-0 rounded-xl overflow-hidden group text-left border-2 transition-all p-3 flex flex-col justify-end bg-input/50 snap-start",
                                                selectedPreset === preset.id ? "border-primary shadow-[0_0_20px_rgba(255,107,0,0.2)] z-10 scale-[1.02]" : "border-transparent border hover:border-border/50"
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

                        {/* Engine Config */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 relative">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                        <Sparkles size={28} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">Prompt Engine</CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground mt-1 font-bold italic tracking-wider uppercase">FOTO COMERCIAL USA</CardDescription>
                                    </div>
                                </div>

                                <div className="flex bg-muted p-1 rounded-xl shadow-inner border border-border">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", mode === 'simple' ? 'bg-card text-emerald-500 shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <Zap size={18} /> Básico
                                    </button>
                                    <button
                                        onClick={() => setMode("advanced")}
                                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", mode === 'advanced' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <Cpu size={18} /> Avançado
                                    </button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8 space-y-8">
                                {mode === 'simple' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Nicho / Indústria</Label>
                                            <Select value={niche} onValueChange={setNiche}>
                                                <SelectTrigger className="bg-card h-12">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">🏗️ Construção</SelectLabel>
                                                        <SelectItem value="construction">Construction</SelectItem>
                                                        <SelectItem value="remodeling">Remodeling</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">🎨 Acabamentos</SelectLabel>
                                                        <SelectItem value="painting">Painting</SelectItem>
                                                        <SelectItem value="roofing">Roofing</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">🪵 Pisos</SelectLabel>
                                                        <SelectItem value="hardwood-flooring">Hardwood Flooring</SelectItem>
                                                        <SelectItem value="luxury-vinyl-plank">LVP</SelectItem>
                                                    </SelectGroup>
                                                    <SelectItem value="other">Outro (Custom)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {niche === 'other' && <Input placeholder="Especifique..." value={nicheOther} onChange={e => setNicheOther(e.target.value)} className="mt-2 text-xs" />}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Estilo Visual</Label>
                                            <Select value={style} onValueChange={setStyle}>
                                                <SelectTrigger className="bg-card h-12">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="photorealistic">Photorealistic</SelectItem>
                                                    <SelectItem value="cinematic">Cinematic</SelectItem>
                                                    <SelectItem value="commercial">Commercial</SelectItem>
                                                    <SelectItem value="iphone-photo">iPhone UGC (Casual)</SelectItem>
                                                    <SelectItem value="drone-view">Drone View</SelectItem>
                                                    <SelectItem value="other">Outro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Ambiente</Label>
                                            <Select value={environment} onValueChange={setEnvironment}>
                                                <SelectTrigger className="bg-card h-12"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="residential">Residential Home</SelectItem>
                                                    <SelectItem value="commercial-building">Commercial Office</SelectItem>
                                                    <SelectItem value="luxury-home">Luxury Estate</SelectItem>
                                                    <SelectItem value="suburban-neighborhood">Suburban Area</SelectItem>
                                                    <SelectItem value="outdoor">Exterior / Outdoor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Cenário USA</Label>
                                            <Select value={location} onValueChange={setLocation}>
                                                <SelectTrigger className="bg-card h-12"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="florida">Florida Style</SelectItem>
                                                    <SelectItem value="california">California Style</SelectItem>
                                                    <SelectItem value="new-england">New England</SelectItem>
                                                    <SelectItem value="texas">Texas Style</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Iluminação</Label>
                                            <Select value={lighting} onValueChange={setLighting}>
                                                <SelectTrigger className="bg-card h-12"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="natural-daylight">Natural Daylight</SelectItem>
                                                    <SelectItem value="golden-hour">Golden Hour</SelectItem>
                                                    <SelectItem value="bright-sunny">Bright Sunny Day</SelectItem>
                                                    <SelectItem value="studio-lighting">Studio Lighting</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Objetivo</Label>
                                            <Select value={objective} onValueChange={setObjective}>
                                                <SelectTrigger className="bg-card h-12"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="service">Service (Pessoas trabalhando)</SelectItem>
                                                    <SelectItem value="no-people">Cenário (Sem pessoas)</SelectItem>
                                                    <SelectItem value="product">Product (Foco em ferramentas)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Nicho Custom</Label>
                                            <Input placeholder="Ex: Master carpenter..." value={nicheAdv} onChange={e => setNicheAdv(e.target.value)} className="bg-card h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Estilo Custom</Label>
                                            <Input placeholder="Ex: Grainy film, film noir..." value={styleAdv} onChange={e => setStyleAdv(e.target.value)} className="bg-card h-12" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">Negativo</Label>
                                            <Textarea placeholder="O que NÃO deve aparecer..." value={negativeAdv} onChange={e => setNegativeAdv(e.target.value)} className="bg-card min-h-[60px]" />
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                {/* Subject (Action) */}
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                        <Camera size={14} /> Sujeito / Ação Principal
                                    </Label>
                                    <Textarea
                                        placeholder="Descreva o que está acontecendo... Ex: Um profissional pintando uma parede com spray sem sujar o chão..."
                                        className="bg-input h-24 text-base focus-visible:ring-primary/40 rounded-2xl resize-none"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Modelo de IA</Label>
                                        <Select value={targetAI} onValueChange={setTargetAI}>
                                            <SelectTrigger className="bg-card h-10 text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard">Padrão</SelectItem>
                                                <SelectItem value="midjourney">Midjourney v6.1</SelectItem>
                                                <SelectItem value="dalle">DALL-E 3</SelectItem>
                                                <SelectItem value="imagefx">Google ImageFX</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            onClick={handleGenerate}
                                            className="w-full py-6 text-lg font-bold uppercase tracking-[0.2em] rounded-xl bg-primary hover:bg-primary/90 text-black shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? <RotateCcw className="animate-spin size-6" /> : "Gerar Prompt"}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-6">
                                    <button onClick={handleClear} className="text-[10px] font-black uppercase text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 tracking-widest">
                                        <RotateCcw size={12} /> Limpar Config
                                    </button>
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
                                        <TerminalWindow size={24} className="text-emerald-500" />
                                        Resultado
                                    </CardTitle>
                                    <Badge className="bg-emerald-500/20 text-emerald-500 border-none font-extrabold uppercase tracking-wider text-[0.65rem]">
                                        HIGH FIDELITY
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 min-h-[400px] flex flex-col">
                                {generatedPrompt ? (
                                    <div className="flex-1 flex flex-col">
                                        <Textarea
                                            className="flex-1 bg-input border-none text-foreground placeholder:text-muted-foreground resize-none min-h-[300px] text-[13px] font-mono p-4 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl custom-scrollbar leading-relaxed"
                                            readOnly
                                            value={generatedPrompt}
                                        />

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={() => toggleFavorite("gerador", {
                                                    mode, niche, nicheOther, style, styleOther, environment, environmentOther, lighting, lightingOther, location, locationOther, objective, objectiveOther, nicheAdv, styleAdv, environmentAdv, lightingAdv, locationAdv, objectiveAdv, negativeAdv, subject, targetAI
                                                }, generatedPrompt, `Prompt ${niche || 'Personalizado'}`)}
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
                                        <Sparkles size={48} className="text-emerald-500 mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm font-medium">
                                            Configure os campos e gere seu prompt.
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-border/50">
                                    <a 
                                        href="https://labs.google/fx/pt/tools/flow" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 h-10 bg-muted/30 hover:bg-muted/50 text-foreground font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border border-border shadow-sm group"
                                    >
                                        <Zap size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                                        Flow
                                    </a>
                                    <a 
                                        href="https://gemini.google.com/app" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 h-10 bg-muted/30 hover:bg-muted/50 text-foreground font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border border-border shadow-sm group"
                                    >
                                        <MagicWand size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                                        Gemini
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-8 animate-fade-up" style={{ animationDelay: '450ms' }}>
                    <GenerationHistory
                        history={history}
                        onRestore={handleRestore}
                        generatorName="gerador"
                    />
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
            </div>

            <FloatingHelpButton pageTitle="Fábrica de Imagens" />
        </div>
    );
}

export default function GeradorPage() {
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
            <GeradorContent />
        </Suspense>
    );
}
