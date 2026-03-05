"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    BookOpen,
    ListChecks,
    TerminalWindow,
    Sparkle,
    Copy,
    CheckCircle,
    Check,
    MagicWand,
    Question
} from "@phosphor-icons/react"
import { useGenerationHistory, HistoryItem } from "@/hooks/useGenerationHistory"
import { GenerationHistory } from "@/components/GenerationHistory"
import { FloatingHelpButton } from "@/components/FloatingHelpButton"
import { useSearchParams } from "next/navigation"
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

function GeradorContent() {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

    useEffect(() => {
        // We can keep the local logic if wanted, but the FloatingHelpButton will handle its own.
        // If we want to auto-open sometimes, we can still do it.
        // For now let's just clean up.
    }, [])
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
    const [isCopied, setIsCopied] = useState(false)

    // History Hook
    const { history, saveHistory } = useGenerationHistory("gerador")
    const searchParams = useSearchParams()

    // Handle Restore Effect
    useEffect(() => {
        const restoreId = searchParams.get('restore_id')
        if (restoreId && history.length > 0) {
            const itemToRestore = history.find((item: HistoryItem) => item.id === restoreId)
            if (itemToRestore) {
                handleRestore(itemToRestore)
            }
        }
    }, [searchParams, history])

    const handleRestore = (item: HistoryItem) => {
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

    // Contexts mapped from original JS
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

    const objectiveModifiers: Record<string, string> = {
        'product': 'commercial product photography, high-quality lens, focus on tools and materials, sharp details',
        'no-people': 'clean environment, showcase of completed work, empty of people, wide shot',
        'service': 'action-oriented shot, showing the professional service being performed with care and expertise'
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

    const handleGenerate = () => {
        setIsGenerating(true)
        let promptParts: string[] = []

        if (mode === 'simple') {
            const finalNiche = niche === 'other' ? nicheOther : niche
            const finalStyle = style === 'other' ? styleOther : style
            const finalEnvironment = environment === 'other' ? environmentOther : environment
            const finalLighting = lighting === 'other' ? lightingOther : lighting
            const finalLocation = location === 'other' ? locationOther : location
            const finalObjective = objective === 'other' ? objectiveOther : objective

            // Subject
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

            // Modifiers
            if (finalObjective && objectiveModifiers[finalObjective]) promptParts.push(objectiveModifiers[finalObjective])
            else if (finalObjective && finalObjective !== 'other') promptParts.push(finalObjective)

            if (finalLocation && locationModifiers[finalLocation]) promptParts.push(locationModifiers[finalLocation])
            else if (finalLocation && finalLocation !== 'other') promptParts.push(finalLocation)

            if (finalEnvironment && envModifiers[finalEnvironment]) promptParts.push(envModifiers[finalEnvironment])
            else if (finalEnvironment) promptParts.push(finalEnvironment)

            if (finalLighting && lightModifiers[finalLighting]) promptParts.push(lightModifiers[finalLighting])
            else if (finalLighting && finalLighting !== 'other') promptParts.push(finalLighting)

            if (finalStyle && styleModifiers[finalStyle]) promptParts.push(styleModifiers[finalStyle])
            else if (finalStyle) promptParts.push(finalStyle)

            const promptStr = promptParts.join(', ') + '.';
            setGeneratedPrompt(promptStr);

            setTimeout(() => {
                setIsGenerating(false)
                saveHistory({
                    mode,
                    niche, nicheOther,
                    style, styleOther,
                    environment, environmentOther,
                    lighting, lightingOther,
                    location, locationOther,
                    objective, objectiveOther,
                    nicheAdv, styleAdv, environmentAdv, lightingAdv, locationAdv, objectiveAdv, negativeAdv,
                    subject
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
                    mode,
                    niche, nicheOther,
                    style, styleOther,
                    environment, environmentOther,
                    lighting, lightingOther,
                    location, locationOther,
                    objective, objectiveOther,
                    nicheAdv, styleAdv, environmentAdv, lightingAdv, locationAdv, objectiveAdv, negativeAdv,
                    subject
                }, finalPrompt)
            }, 800)
        }
    }

    const handleClear = () => {
        // Reset simple
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

        // Reset advanced
        setNicheAdv("")
        setStyleAdv("")
        setEnvironmentAdv("")
        setLightingAdv("")
        setLocationAdv("")
        setObjectiveAdv("")
        setNegativeAdv("")

        // Global
        setSubject("")
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    const handleCopy = async () => {
        if (!generatedPrompt) return
        try {
            // Priority: Modern Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(generatedPrompt)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            } else {
                // Fallback: execCommand('copy') for non-secure contexts (IP access, older browsers)
                const textArea = document.createElement("textarea")
                textArea.value = generatedPrompt
                textArea.style.position = "fixed"
                textArea.style.left = "-9999px"
                textArea.style.top = "0"
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                try {
                    const successful = document.execCommand('copy')
                    if (successful) {
                        setIsCopied(true)
                        setTimeout(() => setIsCopied(false), 2000)
                    }
                } catch (err) {
                    console.error('Fallback copy failed', err)
                }
                document.body.removeChild(textArea)
            }
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    return (
        <div className="flex-1 w-full relative font-sans">
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Navigation Top */}
                <div className="flex items-center justify-end mb-8">
                    <Link href="/docs/nichos" className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-orange-500 transition-colors shadow-sm">
                        <BookOpen size={20} weight="fill" />
                        DOCS
                    </Link>
                </div>

                {/* Header Content */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Fábrica de <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400">Imagens Hiper-Realistas</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Estruture prompts comerciais de alto nível para ImageFX, Midjourney e Dall-E 3. Foco em Home Services EUA.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-primary flex items-center justify-center text-black shadow-lg relative group">
                                <MagicWand size={28} weight="fill" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                        Gerador <span className="text-primary">PRO</span>
                                    </h1>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">ADVANCED PROMPT SYSTEM</p>
                            </div>
                        </div>
                        {/* Presets Gallery */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Nichos Prontos (Presets) <span className="text-primary text-xl">↓</span>
                                </h2>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                    Preenche Auto
                                </span>
                            </div>

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
                                        <div className="absolute inset-[-1px] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                        <div className={cn(
                                            "absolute top-2 right-2 size-5 rounded-md border flex items-center justify-center transition-colors shadow-sm",
                                            selectedPreset === preset.id ? "bg-primary border-primary text-black" : "border-white/30 bg-black/40 backdrop-blur-sm"
                                        )}>
                                            {selectedPreset === preset.id && <Check size={14} weight="bold" />}
                                        </div>

                                        <p className="text-[12px] font-bold text-white leading-tight mt-auto relative z-10 px-1 drop-shadow-md">
                                            {preset.title}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Engine Config */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-foreground">Configurações Manuais</h2>

                                <div className="flex items-center bg-muted p-1 rounded-xl">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'simple' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <ListChecks size={18} weight={mode === 'simple' ? 'bold' : 'regular'} />
                                        Modo Inteligente
                                    </button>
                                    <button
                                        onClick={() => setMode("advanced")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'advanced' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <TerminalWindow size={18} weight={mode === 'advanced' ? 'bold' : 'regular'} />
                                        Modo Expert
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {mode === 'simple' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="niche" className="font-semibold text-foreground">Nicho de Trabalho (EUA)</Label>
                                            <Select value={niche} onValueChange={setNiche}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um nicho..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-input uppercase text-xs font-bold text-muted-foreground tracking-wider">🏗️ Construção & Reformas</SelectLabel>
                                                        <SelectItem value="construction">Construction (Construção)</SelectItem>
                                                        <SelectItem value="remodeling">Remodeling (Reformas)</SelectItem>
                                                        <SelectItem value="carpentry">Carpentry (Marcenaria)</SelectItem>
                                                        <SelectItem value="framing">Framing (Estrutura)</SelectItem>
                                                        <SelectItem value="additions">Additions (Ampliações)</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🎨 Acabamentos & Superfícies</SelectLabel>
                                                        <SelectItem value="painting">Painting (Pintura)</SelectItem>
                                                        <SelectItem value="roofing">Roofing (Telhados)</SelectItem>
                                                        <SelectItem value="siding">Siding (Revestimento)</SelectItem>
                                                        <SelectItem value="insulation">Insulation (Isolamento)</SelectItem>
                                                        <SelectItem value="countertops">Countertops (Bancadas)</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🪵 Pisos (Flooring USA)</SelectLabel>
                                                        <SelectItem value="hardwood-flooring">Hardwood Flooring (Madeira Nobre)</SelectItem>
                                                        <SelectItem value="luxury-vinyl-plank">LVP (Luxury Vinyl Plank)</SelectItem>
                                                        <SelectItem value="laminate-flooring">Laminate Flooring (Laminado)</SelectItem>
                                                        <SelectItem value="sand-and-refinish">Sand & Refinish (Restauração)</SelectItem>
                                                        <SelectItem value="epoxy-flooring">Epoxy Flooring (Garagem/Comercial)</SelectItem>
                                                        <SelectItem value="tile-flooring">Tile & Stone (Cozinha/Banheiro)</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🌿 Exterior & Serviços</SelectLabel>
                                                        <SelectItem value="landscaping">Landscaping (Paisagismo)</SelectItem>
                                                        <SelectItem value="cleaning">Cleaning (Limpeza)</SelectItem>
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">⚙️ Outros</SelectLabel>
                                                        <SelectItem value="hvac">HVAC (Ar Cond.)</SelectItem>
                                                        <SelectItem value="plumbing">Plumbing (Encanamento)</SelectItem>
                                                        <SelectItem value="electrical">Electrical (Elétrica)</SelectItem>
                                                        <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {niche === 'other' && (
                                                <Input placeholder="Especifique o nicho..." value={nicheOther} onChange={e => setNicheOther(e.target.value)} className="mt-2" />
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="style" className="font-semibold text-foreground">Estilo Visual</Label>
                                            <Select value={style} onValueChange={setStyle}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o estilo..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="photorealistic">Photorealistic (Fotorrealista)</SelectItem>
                                                    <SelectItem value="cinematic">Cinematic (Cinematográfico)</SelectItem>
                                                    <SelectItem value="commercial">Commercial Photography</SelectItem>
                                                    <SelectItem value="iphone-photo">iPhone Photo (Casual)</SelectItem>
                                                    <SelectItem value="drone-view">Drone View (Aérea)</SelectItem>
                                                    <SelectItem value="minimalist">Minimalist (Minimalista)</SelectItem>
                                                    <SelectItem value="3d-render">3D Render (Renderização 3D)</SelectItem>
                                                    <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {style === 'other' && (
                                                <Input placeholder="Especifique o estilo..." value={styleOther} onChange={e => setStyleOther(e.target.value)} className="mt-2" />
                                            )}
                                        </div>

                                        {/* Environment */}
                                        <div className="space-y-2">
                                            <Label htmlFor="environment" className="font-semibold text-foreground">Ambiente</Label>
                                            <Select value={environment} onValueChange={setEnvironment}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="residential">Residential Home</SelectItem>
                                                    <SelectItem value="commercial-building">Commercial Building</SelectItem>
                                                    <SelectItem value="luxury-home">Luxury Home</SelectItem>
                                                    <SelectItem value="suburban-neighborhood">Suburban Neighborhood</SelectItem>
                                                    <SelectItem value="construction-site">Construction Site</SelectItem>
                                                    <SelectItem value="outdoor">Outdoor / Exterior</SelectItem>
                                                    <SelectItem value="modern-office">Modern Office</SelectItem>
                                                    <SelectItem value="warehouse">Warehouse</SelectItem>
                                                    <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {environment === 'other' && (
                                                <Input placeholder="Especifique..." value={environmentOther} onChange={e => setEnvironmentOther(e.target.value)} className="mt-2" />
                                            )}
                                        </div>

                                        {/* Lighting */}
                                        <div className="space-y-2">
                                            <Label htmlFor="lighting" className="font-semibold text-foreground">Iluminação</Label>
                                            <Select value={lighting} onValueChange={setLighting}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="natural-daylight">Natural Daylight</SelectItem>
                                                    <SelectItem value="golden-hour">Golden Hour</SelectItem>
                                                    <SelectItem value="bright-sunny">Bright Sunny Day</SelectItem>
                                                    <SelectItem value="studio-lighting">Studio Lighting</SelectItem>
                                                    <SelectItem value="overcast">Overcast</SelectItem>
                                                    <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {lighting === 'other' && (
                                                <Input placeholder="Especifique..." value={lightingOther} onChange={e => setLightingOther(e.target.value)} className="mt-2" />
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="font-semibold text-foreground">Localização / Arquitetura</Label>
                                            <Select value={location} onValueChange={setLocation}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="florida">Florida Style</SelectItem>
                                                    <SelectItem value="new-england">New England Style</SelectItem>
                                                    <SelectItem value="california">California Style</SelectItem>
                                                    <SelectItem value="texas">Texas Style</SelectItem>
                                                    <SelectItem value="midwest">Midwest Style</SelectItem>
                                                    <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {location === 'other' && (
                                                <Input placeholder="Especifique..." value={locationOther} onChange={e => setLocationOther(e.target.value)} className="mt-2" />
                                            )}
                                        </div>

                                        {/* Objective */}
                                        <div className="space-y-2">
                                            <Label htmlFor="objective" className="font-semibold text-foreground">Objetivo da Foto</Label>
                                            <Select value={objective} onValueChange={setObjective}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="product">Product (Foto de Produto)</SelectItem>
                                                    <SelectItem value="no-people">Cenário / Sem Pessoas</SelectItem>
                                                    <SelectItem value="service">Service (Foto de Serviço)</SelectItem>
                                                    <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {objective === 'other' && (
                                                <Input placeholder="Especifique..." value={objectiveOther} onChange={e => setObjectiveOther(e.target.value)} className="mt-2" />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">Nicho Personalizado</Label>
                                            <Input placeholder="Ex: Master carpenter, luxury pool tech..." value={nicheAdv} onChange={e => setNicheAdv(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">Estilo Personalizado</Label>
                                            <Input placeholder="Ex: Grainy film, noir, neon lighting..." value={styleAdv} onChange={e => setStyleAdv(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">Ambiente Personalizado</Label>
                                            <Input placeholder="Ex: Futuristic garage, tropical beach..." value={environmentAdv} onChange={e => setEnvironmentAdv(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">Luz Personalizada</Label>
                                            <Input placeholder="Ex: Candlelight, flickering neon..." value={lightingAdv} onChange={e => setLightingAdv(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">Localização/Arquitetura</Label>
                                            <Input placeholder="Ex: Modernist glass house, rustic cabin..." value={locationAdv} onChange={e => setLocationAdv(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">Objetivo/Ângulo</Label>
                                            <Input placeholder="Ex: Close-up macro, low angle dramatic..." value={objectiveAdv} onChange={e => setObjectiveAdv(e.target.value)} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="font-semibold text-foreground text-red-600">Prompt Negativo (O que NÃO queremos na imagem)</Label>
                                            <Textarea
                                                placeholder="Ex: Text, letters, blurry, low quality, distorted hands..."
                                                className="resize-none"
                                                rows={2}
                                                value={negativeAdv}
                                                onChange={e => setNegativeAdv(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Subject (Global) */}
                                <div className="space-y-2 pt-4 border-t border-border">
                                    <Label htmlFor="subject" className="font-semibold text-foreground">
                                        Sujeito / Ação Específica (Inglês ou Português) <span className="text-muted-foreground font-normal">(Opcional)</span>
                                    </Label>
                                    <Textarea
                                        id="subject"
                                        placeholder="Ex: Um profissional sorrindo enquanto pinta uma parede de branco com um rolo..."
                                        className="resize-none"
                                        rows={2}
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Descreva o que está acontecendo na cena. O sistema tentará adaptar as outras opções a esse sujeito.</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 pb-2">
                                    <Button
                                        onClick={handleGenerate}
                                        className={`w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all ${isGenerating ? 'bg-orange-600 opacity-90' : 'bg-orange-500 hover:bg-orange-600 hover:-translate-y-1'}`}
                                    >
                                        {isGenerating ? <CheckCircle size={24} weight="fill" className="mr-2" /> : <Sparkle size={24} weight="fill" className="mr-2" />}
                                        {isGenerating ? 'Gerado com Sucesso!' : 'Gerar Prompt'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Column */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden sticky top-24">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/50">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <TerminalWindow size={24} className="text-primary" />
                                    Resultado do Prompt
                                </h2>
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
                                                onClick={handleClear}
                                                className="bg-input hover:bg-gray-700 text-muted-foreground border-none"
                                            >
                                                Limpar
                                            </Button>
                                            <Button
                                                onClick={handleCopy}
                                                className={`font-semibold shadow-md border-none ${isCopied ? 'bg-green-600 hover:bg-green-700 text-black' : 'bg-card text-foreground hover:bg-muted'}`}
                                            >
                                                {isCopied ? <Check size={20} weight="bold" className="mr-2" /> : <Copy size={20} weight="bold" className="mr-2" />}
                                                {isCopied ? 'Copiado!' : 'Copiar Prompt'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                                        <MagicWand size={48} weight="duotone" className="text-primary mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm">
                                            Preencha os campos e clique em "Gerar Prompt" para ver o resultado estruturado.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-orange-500/10 border-t border-primary/20 p-4">
                                <h3 className="text-primary font-bold text-xs uppercase tracking-wider mb-1">Dica de Ouro</h3>
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                    Para o Midjourney e ImageFX, prompts em inglês funcionam infinitamente melhor. O nosso sistema já formata e estrutura as palavras-chave para você!
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
                        generatorName="gerador"
                    />
                </div>
            </div>

            <FloatingHelpButton pageTitle="Gerador PRO" />
        </div >
    )
}

export default function GeradorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Carregando gerador...</div>}>
            <GeradorContent />
        </Suspense>
    )
}
