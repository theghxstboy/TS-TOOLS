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
    AlertTriangle as Warning,
    Check,
    Image as Images,
    AlertCircle as WarningCircle,
    Wand2 as MagicWand,
    HelpCircle as Question
} from "lucide-react"
import { TutorialDialog } from "@/components/TutorialDialog"
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

interface AntesDepoisPayload {
    mode: "simple" | "advanced";
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
    nicheAdv?: string;
    focusAdv?: string;
    stateBeforeAdv?: string;
    stateAfterAdv?: string;
    negativeAdv?: string;
}

function AntesEDepoisContent() {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
    const [isTutorialOpen, setIsTutorialOpen] = useState(false)

    const { history, saveHistory } = useGenerationHistory<AntesDepoisPayload>("antes-depois")
    const searchParams = useSearchParams()

    const handleRestore = (item: HistoryItem<AntesDepoisPayload>) => {
        const p = item.payload;
        if (!p) return;

        setMode(p.mode || "simple");
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

    useEffect(() => {
    }, [])
    const [mode, setMode] = useState<"simple" | "advanced">("simple")

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

            if (!finalNiche || !finalFocus || !finalStateBefore || !finalStateAfter) {
                alert("Por favor, preencha todos os campos do modo avançado cruzados com *.");
                setIsGenerating(false);
                return;
            }
        }

        // THE MAGIC FORMULA (BEFORE & AFTER SPLIT SCREEN)
        let prompt = `A side-by-side split-screen comparison photograph. On the left side, the 'Before': ${finalStateBefore} ${finalFocus} in a ${finalNiche} context. On the right side, the 'After': ${finalStateAfter} ${finalFocus}. Both sides feature realistic lighting, ${finalStyle}. Clean professional aesthetics, highly detailed. NO TEXT, NO LETTERS, NO WORDS in the image.`;

        if (mode === 'advanced' && negativeAdv) {
            prompt += `\n\n[NEGATIVE PROMPT]: ${negativeAdv}`;
        }

        setGeneratedPrompt(prompt)

        setTimeout(() => {
            setIsGenerating(false)
            // Determine final prompt since state update might not have applied yet
            let finalStr = prompt

            saveHistory({
                mode, niche, nicheOther, focus, focusOther, stateBefore, stateBeforeOther,
                stateAfter, stateAfterOther, style, styleOther, nicheAdv, focusAdv,
                stateBeforeAdv, stateAfterAdv, negativeAdv
            }, finalStr)
        }, 800)
    }

    const handleClear = () => {
        // Reset simple
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

        // Reset advanced
        setNicheAdv("")
        setFocusAdv("")
        setStateBeforeAdv("")
        setStateAfterAdv("")
        setNegativeAdv("")

        // Global
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    const handleCopy = () => copy(generatedPrompt)

    return (
        <div className="flex-1 w-full relative font-sans">
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Navigation Top */}
                <div className="flex items-center justify-end mb-8">
                    <Link href="/docs/nichos" className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-primary/80 transition-colors shadow-sm">
                        <BookOpen size={20} />
                        DOCS
                    </Link>
                </div>

                {/* Header Content */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-primary flex items-center justify-center text-black shadow-lg">
                            <Sparkle size={28} />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 uppercase tracking-tight">
                        Antes <span className="text-primary italic">&</span> Depois
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Gere comparações <strong>Antes & Depois</strong> perfeitas para anúncios de <strong className="text-foreground">Home Services</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '80ms' }}>

                        {/* Presets Gallery */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Casos de Sucesso (Presets) <span className="text-purple-500 text-xl">↓</span>
                                </h2>
                                <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                                    Preenche Auto
                                </span>
                            </div>

                            <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory">
                                {PRESETS_ANTES_DEPOIS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handlePresetClick(preset.id)}
                                        className={cn(
                                            "relative w-[145px] h-[110px] shrink-0 rounded-xl overflow-hidden group text-left border-2 transition-all p-3 flex flex-col justify-end bg-input/50 snap-start",
                                            selectedPreset === preset.id ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)] z-10 scale-[1.02]" : "border-transparent border hover:border-border/50"
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
                                            selectedPreset === preset.id ? "bg-purple-500 border-purple-500 text-white" : "border-white/30 bg-black/40 backdrop-blur-sm"
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

                        {/* Engine Config */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-foreground">Setup do Criativo</h2>
                                    <span className="text-[0.65rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                                        FOCO EM ADS
                                    </span>
                                </div>

                                <div className="flex items-center bg-muted p-1 rounded-xl self-start sm:self-auto">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'simple' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <ListChecks size={18} />
                                        Modo Automático
                                    </button>
                                    <button
                                        onClick={() => setMode("advanced")}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'advanced' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <TerminalWindow size={18} />
                                        Modo Expert
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {mode === 'simple' ? (
                                    <div className="space-y-6">
                                        {/* Niche & Focus */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="niche" className="font-semibold text-foreground">Nicho / Indústria</Label>
                                                <Select value={niche} onValueChange={setNiche}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione um nicho..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider">🏗️ Construção & Reformas</SelectLabel>
                                                            <SelectItem value="Construction">Construction (Construção)</SelectItem>
                                                            <SelectItem value="Kitchen Remodel">Kitchen Remodel (Cozinha)</SelectItem>
                                                            <SelectItem value="Bathroom Remodel">Bathroom (Banheiro)</SelectItem>
                                                            <SelectItem value="Basement Finishing">Basement (Porão)</SelectItem>
                                                            <SelectItem value="Home Addition">Addition (Ampliação)</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🎨 Acabamentos & Superfícies</SelectLabel>
                                                            <SelectItem value="House Painting">House Painting (Pintura)</SelectItem>
                                                            <SelectItem value="Roof Repair">Roof Repair (Telhado)</SelectItem>
                                                            <SelectItem value="Siding Installation">Siding (Revestimento)</SelectItem>
                                                            <SelectItem value="Countertop Installation">Countertops (Bancadas)</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🪵 Pisos</SelectLabel>
                                                            <SelectItem value="Hardwood Flooring">Hardwood (Pisos de Madeira)</SelectItem>
                                                            <SelectItem value="LVP Installation">LVP (Piso Vinílico)</SelectItem>
                                                            <SelectItem value="Epoxy Flooring">Epoxy (Piso Epóxi)</SelectItem>
                                                            <SelectItem value="Floor Sanding & Refinishing">Sand & Refinish (Restauro)</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🌿 Exterior & Serviços</SelectLabel>
                                                            <SelectItem value="Landscaping & Lawn Care">Landscaping (Paisagismo)</SelectItem>
                                                            <SelectItem value="Power Washing">Power Washing (Lavagem a Pressão)</SelectItem>
                                                            <SelectItem value="House Cleaning">House Cleaning (Limpeza)</SelectItem>
                                                            <SelectItem value="Auto Detailing">Auto Detailing (Estética Automotiva)</SelectItem>
                                                        </SelectGroup>
                                                        <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {niche === 'other' && (
                                                    <Input placeholder="Especifique o nicho..." value={nicheOther} onChange={e => setNicheOther(e.target.value)} className="mt-2" />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="focus" className="font-semibold text-foreground">Cenário Típico</Label>
                                                <Select value={focus} onValueChange={setFocus}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="the entire scene">A cena inteira</SelectItem>
                                                        <SelectItem value="the main surface">A superfície principal</SelectItem>
                                                        <SelectItem value="the specific detail">Um detalhe específico</SelectItem>
                                                        <SelectItem value="the workspace">O ambiente de trabalho</SelectItem>
                                                        <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {focus === 'other' && (
                                                    <Input placeholder="Especifique o elemento em foco..." value={focusOther} onChange={e => setFocusOther(e.target.value)} className="mt-2" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Before & After States */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl border border-border bg-background">
                                            <div className="space-y-2">
                                                <Label className="font-semibold text-red-500 flex items-center gap-1.5">
                                                    <Warning size={18} />
                                                    Estado "Antes"
                                                </Label>
                                                <Select value={stateBefore} onValueChange={setStateBefore}>
                                                    <SelectTrigger className="w-full border-red-200 focus:ring-red-500">
                                                        <SelectValue placeholder="Selecione o estado..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="extremely dirty, covered in grime and stains">Extremamente sujo e manchado</SelectItem>
                                                        <SelectItem value="broken, damaged and worn out">Quebrado, danificado e desgastado</SelectItem>
                                                        <SelectItem value="overgrown with weeds and mess">Tomado por mato e bagunça</SelectItem>
                                                        <SelectItem value="old, outdated and peeling">Velho, datado e descascando</SelectItem>
                                                        <SelectItem value="rusty and oxidized">Enferrujado e oxidado</SelectItem>
                                                        <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {stateBefore === 'other' && (
                                                    <Input placeholder="Especifique o estado antes..." value={stateBeforeOther} onChange={e => setStateBeforeOther(e.target.value)} className="mt-2 border-red-200" />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-semibold text-emerald-500 flex items-center gap-1.5">
                                                    <CheckCircle size={18} />
                                                    Estado "Depois"
                                                </Label>
                                                <Select value={stateAfter} onValueChange={setStateAfter}>
                                                    <SelectTrigger className="w-full border-emerald-200 focus:ring-emerald-500">
                                                        <SelectValue placeholder="Selecione o estado..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="spotless, shining like new and pristine">Impecável, brilhando como novo</SelectItem>
                                                        <SelectItem value="fully repaired, professional finish">Totalmente reparado, acabamento pro</SelectItem>
                                                        <SelectItem value="perfectly manicured and organized">Perfeitamente aparado e organizado</SelectItem>
                                                        <SelectItem value="modern, fresh and beautiful">Moderno, renovado e bonito</SelectItem>
                                                        <SelectItem value="polished, smooth and clean">Polido, liso e limpo</SelectItem>
                                                        <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {stateAfter === 'other' && (
                                                    <Input placeholder="Especifique o estado depois..." value={stateAfterOther} onChange={e => setStateAfterOther(e.target.value)} className="mt-2 border-emerald-200" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Custom Niche/Focus */}
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <Label className="font-semibold text-foreground">Nicho / Indústria <span className="text-red-500">*</span></Label>
                                                <Input placeholder="Ex: House Cleaning, Auto Detailing, Roof Repair..." value={nicheAdv} onChange={e => setNicheAdv(e.target.value)} />
                                                <p className="text-xs text-muted-foreground">Contexto geral para a IA entender o cenário.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold text-foreground">Elemento em Foco <span className="text-red-500">*</span></Label>
                                                <Input placeholder="Ex: Kitchen countertop, Suburban lawn, Car interior..." value={focusAdv} onChange={e => setFocusAdv(e.target.value)} />
                                                <p className="text-xs text-muted-foreground">O que está sendo transformado na imagem?</p>
                                            </div>
                                        </div>

                                        {/* Custom States */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl border border-border bg-background">
                                            <div className="space-y-2">
                                                <Label className="font-semibold text-red-500 flex items-center gap-1.5">
                                                    <Warning size={18} />
                                                    Estado "Antes" (Problema) <span className="text-red-500">*</span>
                                                </Label>
                                                <Textarea
                                                    placeholder="Ex: Sujo de graxa preta, aspecto terrível, parede descascada..."
                                                    className="resize-none border-red-200 focus-visible:ring-red-500"
                                                    rows={3}
                                                    value={stateBeforeAdv}
                                                    onChange={e => setStateBeforeAdv(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold text-emerald-500 flex items-center gap-1.5">
                                                    <CheckCircle size={18} />
                                                    Estado "Depois" (Solução) <span className="text-red-500">*</span>
                                                </Label>
                                                <Textarea
                                                    placeholder="Ex: Limpo, brilhando como novo, pintura fresca e sem falhas..."
                                                    className="resize-none border-emerald-200 focus-visible:ring-emerald-500"
                                                    rows={3}
                                                    value={stateAfterAdv}
                                                    onChange={e => setStateAfterAdv(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">Prompt Negativo (O que NÃO deve aparecer)</Label>
                                            <Textarea
                                                placeholder="Ex: Text, before and after labels, distorted surfaces, low resolution..."
                                                className="resize-none"
                                                rows={2}
                                                value={negativeAdv}
                                                onChange={e => setNegativeAdv(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Shared Styles */}
                                <div className="space-y-2 pt-4 border-t border-border">
                                    <Label htmlFor="style" className="font-semibold text-foreground">
                                        Estilo Fotográfico Adicional <span className="text-muted-foreground font-normal">(Opcional)</span>
                                    </Label>
                                    <Select value={style} onValueChange={setStyle}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="photorealistic, highly detailed, captured with DSLR camera">Padrão - Fotorrealista e Limpo</SelectItem>
                                            <SelectItem value="raw street photography style, high contrast, iphone photo">Estilo UGC (Foto de Celular Crua)</SelectItem>
                                            <SelectItem value="commercial bright lighting, studio quality, sharp focus">Comercial Brilhante</SelectItem>
                                            <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {style === 'other' && (
                                        <Input placeholder="Especifique o estilo..." value={styleOther} onChange={e => setStyleOther(e.target.value)} className="mt-2" />
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 pb-2">
                                        {isGenerating ? <div className="animate-pulse">Gerando...</div> : "Gerar Prompt"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Column */}
                    <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: '160ms' }}>
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
                                                onClick={handleClear}
                                                className="bg-input hover:bg-gray-700 text-muted-foreground border-none"
                                            >
                                                Limpar
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
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                                        <Images size={48} className="text-primary mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm">
                                            Preencha os campos e clique em <strong>Gerar Prompt</strong>.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-amber-500/10 border-t border-amber-500/20 p-4">
                                <h3 className="text-amber-500 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <WarningCircle size={16} />
                                    Restrições de Texto na IA
                                </h3>
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                    A IA frequentemente gera deformações se forçarmos ela a escrever "Before" e "After" na foto. O prompt gerado garante que a imagem sairá 100% limpa (NO TEXT), deixando livre para você adicionar a tipografia depois no Canva.
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
                        generatorName="antes-depois"
                    />
                </div>
            </div>

            <FloatingHelpButton pageTitle="Antes e Depois" />
        </div>
    )
}

export default function AntesEDepoisPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Carregando gerador...</div>}>
            <AntesEDepoisContent />
        </Suspense>
    )
}
