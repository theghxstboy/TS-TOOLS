"use client"

import { useState, useEffect, Suspense, useRef, useCallback } from "react"
import {
    ShieldCheck,
    Star,
    Award,
    Trophy,
    Lock,
    Truck,
    Sparkles,
    Copy,
    CheckCircle2 as CheckCircle,
    Check,
    Wand2 as MagicWand,
    Palette,
    Layers,
    Type,
    RotateCcw,
    Terminal as TerminalWindow,
    Info,
    Layout,
    Sticker,
    Shapes,
    Crown,
    HelpCircle as Question,
    Zap as Lightning,
    Search,
    X,
    FileImage,
    Upload,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Shield,
    MessageSquare,
    MousePointerClick,
    History
} from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useClipboard } from "@/hooks/useClipboard"
import { useGenerationHistory } from "@/hooks/useGenerationHistory"
import { GenerationHistory } from "@/components/GenerationHistory"
import { HistoryItem } from "@/types/generator"
import { PRESETS_SELOS, PresetSelo, SEAL_SHAPES, SEAL_MATERIALS, SEAL_ICONS } from "@/constants/presets-selos"

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedFile {
    file: File
    previewUrl: string
    name: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

function extractDominantColors(image: HTMLImageElement): { primary: string; secondary: string } {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return { primary: "#000000", secondary: "#D4AF37" }

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const colorCounts: Record<string, number> = {}

    for (let i = 0; i < data.length; i += 40) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
        if (a < 128) continue
        const sum = r + g + b
        if (sum > 720 || sum < 40) continue
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
        colorCounts[hex] = (colorCounts[hex] || 0) + 1
    }

    const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])
    return {
        primary: sorted[0]?.[0] ?? "#000000",
        secondary: sorted[1]?.[0] ?? "#D4AF37",
    }
}

function GeradorSelosContent() {
    // States - Global
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
    const [mode, setMode] = useState<"vetorial" | "3d" | "other">("3d")

    // States - Inputs
    const [title, setTitle] = useState("CERTIFIED")
    const [subtitle, setSubtitle] = useState("Professional")
    const [iconName, setIconName] = useState("ShieldCheck")
    const [iconOther, setIconOther] = useState("")

    const [primaryColor, setPrimaryColor] = useState("#000000")
    const [secondaryColor, setSecondaryColor] = useState("#D4AF37")
    const [textColor, setTextColor] = useState("#FFFFFF")
    const [customColors, setCustomColors] = useState<string[]>([])
    const [newCustomColor, setNewCustomColor] = useState("#FFFFFF")
    
    const [shape, setShape] = useState("serrated")
    const [shapeOther, setShapeOther] = useState("")
    
    const [material, setMaterial] = useState("gold-foil")
    const [materialOther, setMaterialOther] = useState("")
    
    // Logo States
    const [logoFile, setLogoFile] = useState<UploadedFile | null>(null)
    const [colorsExtracted, setColorsExtracted] = useState(false)
    const logoInputRef = useRef<HTMLInputElement>(null)

    // Popup states
    const [showImagePopup, setShowImagePopup] = useState(false)
    const [copiedType, setCopiedType] = useState<"prompt" | "logo" | null>(null)

    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const { isCopied, copy } = useClipboard()

    const { history, saveHistory } = useGenerationHistory<any>("gerador-selos")

    const handleRestore = (item: HistoryItem<any>) => {
        const p = item.payload;
        if (!p) return;
        setMode(p.mode || "3d")
        setTitle(p.title || "CERTIFIED")
        setSubtitle(p.subtitle || "Professional")
        setIconName(p.iconName || "ShieldCheck")
        setIconOther(p.iconOther || "")
        setPrimaryColor(p.primaryColor || "#000000")
        setSecondaryColor(p.secondaryColor || "#D4AF37")
        setTextColor(p.textColor || "#FFFFFF")
        setShape(p.shape || "serrated")
        setShapeOther(p.shapeOther || "")
        setMaterial(p.material || "gold-foil")
        setMaterialOther(p.materialOther || "")
        setGeneratedPrompt(item.prompt || "")
    }

    // Handle Auto-Generation Effect
    useEffect(() => {
        const finalShape = shape === 'other' ? shapeOther : (SEAL_SHAPES.find(s => s.id === shape)?.label || shape);
        const finalMaterial = material === 'other' ? materialOther : (SEAL_MATERIALS.find(m => m.id === material)?.label || material);
        const finalIcon = iconName === 'other' ? iconOther : iconName;

        const styleInstruction = mode === '3d' 
            ? "3D photorealistic render, deep embossed effect, high-gloss reflection, ultra-high resolution"
            : mode === 'vetorial'
                ? "Flat vector design, 2D minimalist illustration, clean lines, no gradients, sharp edges"
                : "Custom creative style, unique digital art texture";

        const logoPlacement = logoFile 
            ? `\nLOGO INTEGRATION:
- Place the client's logo (attachment provided) inside the central area of the seal.
- Ensure the logo is perfectly centered and scaled to fit naturally.
- Adopt a subtle 3D embossed look for the logo if in 3D mode.`
            : "";

        const promptTemplate = `
Professional Certification Seal - [MODE: ${mode.toUpperCase()}]
Perspective: Pure FRONT VIEW, orthographic project, zero perspective distortion.

PROPERTIES:
- Base Material: ${finalMaterial}
- Essential Shape: ${finalShape}
- Visual Style: ${styleInstruction}
- Central Icon: ${logoFile ? 'Client Logo (see integration below)' : (finalIcon || 'Shield')}
- Main Title Text: "${title.toUpperCase()}"
- Dynamic Subtitle Text: "${subtitle.toUpperCase()}"
${logoPlacement}

COLOR PALETTE:
- Primary Color: ${primaryColor}
- Accent/Secondary Color: ${secondaryColor}
- Text Color: ${textColor}
${customColors.length > 0 ? `- Additional Colors: ${customColors.join(', ')}` : ''}

REQUIREMENTS:
1. Centered composition isolated on a clean white background.
2. Realistic ${material.includes('gold') ? 'gold flake' : material.includes('chrome') ? 'brushed metal' : 'solid'} shading.
3. Perfect symmetry, commercial grade trust badge.
4. Professional typography with 3D depth (if 3D mode) or sharp vectors (if flat mode).
5. 8k resolution, suitable for high-end creative ad assets.
`.trim();

        setGeneratedPrompt(promptTemplate);
    }, [title, subtitle, iconName, iconOther, shape, shapeOther, material, materialOther, primaryColor, secondaryColor, textColor, mode, logoFile, customColors]);

    const handlePresetClick = (id: string) => {
        setSelectedPreset(id)
        const preset = PRESETS_SELOS.find(p => p.id === id)
        if (preset) {
            setMode(preset.mode as any)
            setTitle(preset.title)
            setSubtitle(preset.subtitle || "")
            setIconName(preset.icon)
            setPrimaryColor(preset.primaryColor)
            setSecondaryColor(preset.secondaryColor)
            setTextColor(preset.textColor)
            setShape(preset.shape)
            setMaterial(preset.material)
            
            // Clear other fields to keep it clean
            setIconOther("");
            setShapeOther("");
            setMaterialOther("");
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const previewUrl = await toBase64(file)
        setLogoFile({ file, previewUrl, name: file.name })
        setColorsExtracted(false)
        const img = new Image()
        img.onload = () => {
            const colors = extractDominantColors(img)
            setPrimaryColor(colors.primary)
            setSecondaryColor(colors.secondary)
            setColorsExtracted(true)
        }
        img.src = previewUrl
    }

    const removeLogo = () => {
        setLogoFile(null)
        setColorsExtracted(false)
        if (logoInputRef.current) logoInputRef.current.value = ""
    }

    const copyImageToClipboard = async (dataUrl: string, type: "logo") => {
        try {
            const img = new Image()
            img.src = dataUrl
            await new Promise((resolve) => (img.onload = resolve))

            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            ctx.drawImage(img, 0, 0)

            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob((b) => resolve(b), "image/png")
            )
            if (!blob) return

            const item = new ClipboardItem({ "image/png": blob })
            await navigator.clipboard.write([item])
            
            setCopiedType(type)
            setTimeout(() => setCopiedType(null), 2000)
        } catch (err) {
            console.error("Erro ao copiar imagem:", err)
        }
    }

    const handleCopy = () => {
        copy(generatedPrompt)
        setShowImagePopup(true)
    }

    const handleResetForm = () => {
        setSelectedPreset(null)
        setMode("3d")
        setTitle("CERTIFIED")
        setSubtitle("Professional")
        setIconName("ShieldCheck")
        setIconOther("")
        setPrimaryColor("#000000")
        setSecondaryColor("#D4AF37")
        setTextColor("#FFFFFF")
        setCustomColors([])
        setShape("serrated")
        setShapeOther("")
        setMaterial("gold-foil")
        setMaterialOther("")
        setLogoFile(null)
        setColorsExtracted(false)
    }

    return (
        <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 md:py-12">
            {/* Standard Hero */}
            <div className="text-center mb-12 animate-fade-up">
                <div className="flex items-center gap-4 justify-center mb-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="size-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl relative group cursor-help transition-transform hover:scale-110">
                                    <Sparkles size={32} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>AI Authority Engine</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Seal <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Authority</span> Generator
                        </h1>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">HIGH-CONVERSION ASSETS SYSTEM</p>
                    </div>
                </div>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                    Gere prompts de alta precisão para criar selos de autoridade e confiança para <span className="text-foreground font-bold">Tráfego Pago</span> e <span className="text-foreground font-bold">Criativos</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Inputs Column */}
                <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '150ms' }}>
                    
                    {/* Standard Presets Gallery */}
                    <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 relative space-y-0">
                            <Separator className="absolute bottom-0 left-0 right-0" />
                            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                                Templates Oficiais <span className="text-amber-500 text-xl">↓</span>
                            </CardTitle>
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold uppercase tracking-wider text-[10px]">
                                PREMIUM
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                            <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory perspective-1000">
                                {PRESETS_SELOS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handlePresetClick(preset.id)}
                                        className={cn(
                                            "relative w-[140px] h-[160px] shrink-0 rounded-2xl overflow-hidden group text-left border-2 transition-all p-0 flex flex-col justify-end bg-muted/30 snap-start",
                                            selectedPreset === preset.id ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] z-10 scale-[1.02]" : "border-transparent border hover:border-border/50"
                                        )}
                                    >
                                        {preset.image ? (
                                            <img src={preset.image} alt={preset.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                                {preset.mode === '3d' ? <Shapes size={40} className="opacity-20 text-amber-600" /> : <Layers size={40} className="opacity-20 text-amber-600" />}
                                            </div>
                                        )}
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                                        
                                        <div className={cn(
                                            "absolute top-3 right-3 size-6 rounded-lg border-2 flex items-center justify-center transition-colors shadow-sm z-20",
                                            selectedPreset === preset.id ? "bg-amber-500 border-amber-500 text-white" : "border-white/30 bg-black/40 backdrop-blur-sm"
                                        )}>
                                            {selectedPreset === preset.id && <Check size={16} strokeWidth={3} />}
                                        </div>

                                        <div className="p-4 relative z-10">
                                            <p className="text-[10px] font-black text-amber-500 mb-0.5 uppercase tracking-widest">{preset.mode.toUpperCase()}</p>
                                            <p className="text-sm font-black text-white leading-tight uppercase tracking-tight">
                                                {preset.title}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Authority Engine Card */}
                    <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 relative border-none">
                            <Separator className="absolute bottom-0 left-0 right-0" />
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                    <Crown size={28} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tight leading-none">Anatomia do Selo</CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground mt-2 font-bold italic tracking-wider uppercase">IDENTITY & PERSPECTIVE SYSTEM</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-2">
                                        <Type size={14} className="text-amber-500" /> Título Principal (Major Center)
                                    </Label>
                                    <Input value={title} onChange={e => setTitle(e.target.value)} className="h-14 text-lg font-black uppercase tracking-tighter border-2 focus-visible:ring-amber-500" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">Subtítulo (Top/Bottom Info)</Label>
                                    <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="h-14 border-2 focus-visible:ring-amber-500 font-bold" />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-2">
                                        <Shapes size={14} className="text-amber-500" /> Estilo Visual
                                    </Label>
                                    <Select value={mode} onValueChange={(val: any) => setMode(val)}>
                                        <SelectTrigger className="h-14 border-2 font-bold uppercase text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3d">Realismo 3D</SelectItem>
                                            <SelectItem value="vetorial">Vetorial Plano</SelectItem>
                                            <SelectItem value="other">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-2">
                                        <Shapes size={14} className="text-amber-500" /> Formato de Molde
                                    </Label>
                                    <Select value={shape} onValueChange={setShape}>
                                        <SelectTrigger className="h-14 border-2 font-bold uppercase text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SEAL_SHAPES.map(s => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    <div className="flex items-center gap-2">
                                                        <s.icon size={16} className="text-amber-500 shrink-0" />
                                                        {s.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {shape === 'other' && (
                                        <Input placeholder="Especifique o formato (ex: Estrela 24 pontas)" value={shapeOther} onChange={e => setShapeOther(e.target.value)} className="mt-2 text-xs" />
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-2">
                                        <Palette size={14} className="text-amber-500" /> Material & Acabamento
                                    </Label>
                                    <Select value={material} onValueChange={setMaterial}>
                                        <SelectTrigger className="h-14 border-2 font-bold uppercase text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SEAL_MATERIALS.map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {material === 'other' && (
                                        <Input placeholder="Especifique o material (ex: Vidro Jateado)" value={materialOther} onChange={e => setMaterialOther(e.target.value)} className="mt-2 text-xs" />
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-2">
                                        <Lightning size={14} className="text-amber-500" /> Ícone Identificador
                                    </Label>
                                    <Select value={iconName} onValueChange={setIconName}>
                                        <SelectTrigger className="h-14 border-2 font-bold text-xs uppercase">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SEAL_ICONS.map(i => (
                                                <SelectItem key={i.id} value={i.id}>
                                                    <div className="flex items-center gap-2">
                                                        <i.icon size={16} className="text-amber-400 shrink-0" />
                                                        {i.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {iconName === 'other' && (
                                        <Input placeholder="Nome do ícone (ex: Eagle, Crown, Wallet)" value={iconOther} onChange={e => setIconOther(e.target.value)} className="mt-2 text-xs" />
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Section: Logo do Cliente (Replicating Workflow Pattern) */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                                            <Palette size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Marca do Criativo</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">LOGO & PALETTE EXTRACTION</p>
                                        </div>
                                    </div>
                                    {colorsExtracted && (
                                        <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[9px] px-2 py-1 uppercase tracking-widest">
                                            CORES EXTRAÍDAS!
                                        </Badge>
                                    )}
                                </div>

                                <div className="bg-muted/30 border-2 border-border rounded-[20px] p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div
                                            onClick={() => logoInputRef.current?.click()}
                                            className="border-2 border-dashed border-border hover:border-purple-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all group hover:bg-purple-500/5 min-h-[140px] flex flex-col items-center justify-center bg-card/40 shadow-inner"
                                        >
                                            {logoFile ? (
                                                <div className="relative group/logo w-full h-full flex flex-col items-center justify-center">
                                                    <img src={logoFile.previewUrl} alt="Logo" className="max-h-24 max-w-full object-contain rounded-lg p-2" />
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => { e.stopPropagation(); removeLogo() }} 
                                                        className="absolute -top-3 -right-3 p-1.5 bg-red-500 rounded-full text-white shadow-lg opacity-0 group-hover/logo:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    <p className="text-[10px] font-mono text-muted-foreground mt-2 truncate w-full text-center px-4">{logoFile.name}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <FileImage size={32} className="mx-auto mb-3 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                                                    <p className="text-xs font-black text-muted-foreground group-hover:text-foreground uppercase tracking-widest">Anexar Logo do Cliente</p>
                                                    <p className="text-[9px] text-muted-foreground/60 mt-1 font-bold uppercase">PNG, JPG ou SVG</p>
                                                </>
                                            )}
                                            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.1em]">Primária</Label>
                                                    <div className="flex gap-2 items-center bg-card/60 p-2 rounded-xl border border-border shadow-sm">
                                                        <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="size-8 rounded-lg border border-black/10 cursor-pointer bg-transparent shrink-0" />
                                                        <span className="text-[10px] font-mono font-black uppercase w-full">{primaryColor}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.1em]">Secundária</Label>
                                                    <div className="flex gap-2 items-center bg-card/60 p-2 rounded-xl border border-border shadow-sm">
                                                        <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="size-8 rounded-lg border border-black/10 cursor-pointer bg-transparent shrink-0" />
                                                        <span className="text-[10px] font-mono font-black uppercase w-full">{secondaryColor}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-border/50">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.1em]">Cores Adicionais</Label>
                                                <div className="flex gap-2 items-center mt-2">
                                                    <input type="color" value={newCustomColor} onChange={e => setNewCustomColor(e.target.value)} className="size-9 rounded-lg border border-black/10 cursor-pointer bg-transparent shrink-0" />
                                                    <Button 
                                                        type="button" 
                                                        variant="outline"
                                                        onClick={() => { setCustomColors([...customColors, newCustomColor.toUpperCase()]); setNewCustomColor("#FFFFFF") }} 
                                                        className="flex-1 h-9 font-black text-[10px] uppercase tracking-widest border-2"
                                                    >
                                                        Adicionar Cor
                                                    </Button>
                                                </div>
                                                
                                                {customColors.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {customColors.map((c, i) => (
                                                            <div key={i} className="flex items-center gap-1.5 bg-card/80 border border-border rounded-lg pl-2 pr-1 py-1 shadow-sm">
                                                                <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c }} />
                                                                <span className="text-[9px] font-mono font-black">{c}</span>
                                                                <button type="button" onClick={() => setCustomColors(customColors.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 p-0.5"><X size={12} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Action Button */}
                            <div className="pt-6">
                                <Button 
                                    onClick={() => {
                                        setIsGenerating(true);
                                        saveHistory({mode, title, subtitle, iconName, iconOther, primaryColor, secondaryColor, textColor, shape, shapeOther, material, materialOther}, generatedPrompt);
                                        setTimeout(() => setIsGenerating(false), 600);
                                    }}
                                    className="w-full py-9 text-xl font-black uppercase tracking-[0.2em] bg-amber-500 hover:bg-amber-600 text-white shadow-2xl shadow-amber-500/30 transition-all active:scale-[0.98] rounded-2xl flex items-center justify-center gap-4 group"
                                >
                                    {isGenerating ? <Lightning className="animate-spin size-8" /> : (
                                        <>
                                            ESTRUTURAR ASSET IA
                                            <MagicWand size={28} className="group-hover:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sticky Output Column */}
                <div className="lg:col-span-5 relative">
                    <Card className="rounded-[24px] border-border shadow-xl overflow-hidden sticky top-24 animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <CardHeader className="px-6 py-5 bg-muted/50 relative border-none">
                            <Separator className="absolute bottom-0 left-0 right-0" />
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-[12px] font-black text-foreground flex items-center gap-2 uppercase tracking-widest leading-none">
                                    <TerminalWindow size={24} className="text-amber-500" />
                                    Prompt do Criativo
                                </CardTitle>
                                <Badge className="bg-amber-500/20 text-amber-600 border-none font-black uppercase tracking-widest text-[9px] px-2 py-1">
                                    V6 READY
                                </Badge>
                            </div>
                        </CardHeader>

                        {/* Standard Important Notice */}
                        <div className="bg-amber-500/5 border-b border-amber-500/10 p-5 flex items-start gap-4">
                            <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                                <Lightning size={20} className="text-amber-600 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-amber-600 font-black text-[10px] tracking-widest mb-1 uppercase">Otimização de Asset</h3>
                                <p className="text-muted-foreground text-[11px] leading-relaxed font-semibold">
                                    Prompt estruturado para **Midjourney**, **Leonardo AI** e **DALL-E 3**. Gera selos frontais perfeitos para uso imediato em criativos de elite.
                                </p>
                            </div>
                        </div>

                        <CardContent className="p-6 min-h-[350px] flex flex-col">
                            <Textarea 
                                className="flex-1 bg-muted/20 border-border text-foreground font-mono text-[11px] p-5 leading-relaxed resize-none rounded-xl custom-scrollbar border-2"
                                readOnly
                                value={generatedPrompt}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={handleResetForm}
                                    className="h-16 font-black uppercase text-[10px] tracking-widest border-2 rounded-2xl flex items-center gap-2"
                                >
                                    <RotateCcw size={16} />
                                    Limpar
                                </Button>
                                <Button 
                                    onClick={handleCopy}
                                    className="w-full h-16 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <Copy size={20} />
                                    {isCopied ? "COPIADO" : "COPIAR PROMPT"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-8 animate-fade-up w-full col-span-full" style={{ animationDelay: '450ms' }}>
                <GenerationHistory
                    history={history}
                    onRestore={handleRestore}
                    generatorName="gerador-selos"
                />
            </div>

            {/* Workflow Finishing Popup (Pattern from Creative Workflow) */}
            {showImagePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowImagePopup(false)} />
                    
                    <div className="relative w-full max-w-[1000px] max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col outline-none z-10 animate-in zoom-in-95 duration-200">
                        {/* Header Premium */}
                        <div className="bg-amber-500 px-6 py-5 flex items-center justify-between shrink-0 border-b border-black/10">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-black/10 flex items-center justify-center">
                                    <Sparkles size={24} className="text-black" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-black uppercase tracking-tight leading-none">
                                        Workflow de Finalização
                                    </h2>
                                    <p className="text-black/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                                        Siga os passos e cole diretamente no ChatGPT/Claude/Midjourney
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-black hover:bg-black/10 rounded-full h-10 w-10" 
                                onClick={() => setShowImagePopup(false)}
                            >
                                <X size={24} />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className={cn(
                                "grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 h-full min-h-[400px]"
                            )}>
                                
                                {/* STEP 1: TEXT */}
                                <div className="p-8 lg:p-12 flex flex-col gap-6 bg-zinc-950 min-h-[400px]">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20 shrink-0">1</div>
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Copiar Prompt</h3>
                                    </div>
                                    
                                    <div className="flex-1 min-h-[250px] relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-inner group">
                                        <Textarea
                                            className="absolute inset-0 w-full h-full bg-transparent border-none text-[12px] text-zinc-300 font-mono p-5 leading-relaxed focus-visible:ring-0 resize-none custom-scrollbar"
                                            readOnly 
                                            value={generatedPrompt}
                                        />
                                    </div>

                                    <Button
                                        onClick={() => {
                                            copy(generatedPrompt);
                                            setCopiedType("prompt");
                                            setTimeout(() => setCopiedType(null), 2000);
                                        }}
                                        className={cn(
                                            "w-full py-8 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3", 
                                            copiedType === "prompt" ? "bg-green-600 text-white hover:bg-green-700" : "bg-amber-500 hover:bg-amber-600 text-black"
                                        )}
                                    >
                                        {copiedType === "prompt" ? <Check size={20} /> : <Copy size={20} />}
                                        <span>{copiedType === "prompt" ? "Prompt Copiado!" : "Copiar Prompt Agora"}</span>
                                    </Button>
                                </div>

                                {/* STEP 2: LOGO */}
                                <div className="p-8 lg:p-12 flex flex-col gap-6 bg-zinc-900/20">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20 shrink-0">2</div>
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Anexar Logo</h3>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-6 justify-center">
                                        {logoFile ? (
                                            <>
                                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-8 shadow-xl">
                                                    <img 
                                                        src={logoFile.previewUrl} 
                                                        alt="Logo" 
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] font-bold text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                                                        Logo do Cliente
                                                    </div>
                                                </div>

                                                <Button 
                                                    onClick={() => copyImageToClipboard(logoFile.previewUrl, "logo")}
                                                    className={cn(
                                                        "w-full py-8 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3", 
                                                        copiedType === "logo" ? "bg-green-600 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
                                                    )}
                                                >
                                                    {copiedType === "logo" ? <Check size={20} /> : <Copy size={20} />}
                                                    <span>{copiedType === "logo" ? "Logo Copiada!" : "Copiar Logo para IA"}</span>
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl opacity-40 p-10 text-center">
                                                <FileImage size={56} className="mb-4 text-zinc-500" />
                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Sem Logo Anexada</p>
                                                <p className="text-[10px] text-zinc-600 mt-2 font-bold uppercase">A IA usará apenas cor de texto padrão.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Clean */}
                        <div className="px-8 py-5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                                <Check size={14} className="text-amber-500" /> 
                                PROCESSO RECOMENDADO: COLE O PROMPT E DEPOIS A LOGO NO CHAT.
                            </p>
                            <Button variant="ghost" className="text-zinc-400 hover:text-white font-bold text-xs uppercase" onClick={() => setShowImagePopup(false)}>Fechar Finalização</Button>
                        </div>
                    </div>
                </div>
            )}

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
    )
}

export default function GeradorSelosPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GeradorSelosContent />
        </Suspense>
    )
}
