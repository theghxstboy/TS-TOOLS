"use client";

import { useState, useEffect, Suspense } from "react"
import {
    Image as ImageIcon,
    Video,
    Check,
    Info,
    CheckCircle2 as CheckCircle,
    ListChecks,
    Terminal as TerminalWindow,
    Eraser as Broom,
    Terminal,
    Wand2 as MagicWand,
    Copy,
    HelpCircle as Question,
    Star,
    Sparkles,
    UserCircle2,
    CheckCircle2
} from "lucide-react"
import { TutorialDialog } from "@/components/TutorialDialog"
import { useFavorites } from "@/hooks/useFavorites"
import { GenerationHistory } from "@/components/GenerationHistory"
import { HistoryItem } from "@/types/generator"
import { HumanoPayload } from "@/hooks/usePromptGenerator"
import { FloatingHelpButton } from "@/components/FloatingHelpButton"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { PRESETS, CHECKBOX_COMMANDS, TABS, TabKey, OutputMode, GeneratorMode } from "@/constants/gerador-humano"
import { usePromptGenerator } from "@/hooks/usePromptGenerator"

function GeradorHumanoContent() {
    const {
        mode, setMode,
        genMode, setGenMode,
        selectedPreset, handlePresetClick,
        activeTab, setActiveTab,
        selectedCheckboxes, toggleCommand,
        sliderPos, setSliderPos,
        isCopied, handleCopy,
        customAction, setCustomAction,
        negativePrompt, setNegativePrompt,
        userDetails, setUserDetails,
        finalPrompt,
        handleClear,
        history, handleRestore
    } = usePromptGenerator();

    const { isFavorited, toggleFavorite } = useFavorites();
    const searchParams = useSearchParams()

    // Handle Restore Effect
    useEffect(() => {
        const restoreId = searchParams.get('restore_id')
        if (restoreId && history.length > 0) {
            const itemToRestore = history.find((item: HistoryItem<HumanoPayload>) => item.id === restoreId)
            if (itemToRestore) {
                handleRestore(itemToRestore)
            }
        }
    }, [searchParams, history, handleRestore])

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
                                        <UserCircle2 size={32} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Human Realism Engine</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                Human <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400">Generator</span>
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">PHOTOREALISTIC PROMPT SYSTEM</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Crie profissionais hiper-realistas para seus anúncios de <span className="text-foreground font-bold">Home Services nos EUA</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Inputs Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '150ms' }}>

                        {/* Output Mode & Comparison Slider */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 relative space-y-0">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <div className="flex bg-muted p-1 rounded-xl shadow-inner border border-border">
                                    <button
                                        onClick={() => setMode("imagem")}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
                                            mode === "imagem"
                                                ? "bg-gradient-to-r from-orange-400 to-primary text-black shadow-md"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        <ImageIcon size={16} /> Imagem
                                    </button>
                                    <button
                                        onClick={() => setMode("video")}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
                                            mode === "video"
                                                ? "bg-background text-foreground shadow-md border border-border"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        <Video size={16} /> Vídeo
                                    </button>
                                </div>
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-none font-black uppercase tracking-widest text-[10px]">
                                    COMPARISON
                                </Badge>
                            </CardHeader>

                            <CardContent className="p-0 relative h-[350px] md:h-[450px] overflow-hidden group select-none cursor-ew-resize">
                                {/* Original Image (Antes) */}
                                <img
                                    src="/humano-antes.jpg"
                                    alt="Sem IA"
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold pointer-events-none z-10 shadow-lg uppercase tracking-widest">
                                    Sem Realismo
                                </div>

                                {/* Realistic Image (Depois - Clipped) */}
                                <div
                                    className="absolute inset-0 pointer-events-none z-10"
                                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                                >
                                    <img
                                        src="/humano-depois.jpeg"
                                        alt="Com Realismo"
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="absolute inset-0 border-r-2 border-white pointer-events-none shadow-[15px_0_30px_rgba(0,0,0,0.5)]"></div>
                                    <div className="absolute top-4 left-4 bg-primary text-black px-4 py-1.5 rounded-full text-xs font-bold pointer-events-none shadow-xl uppercase tracking-widest">
                                        Full Realism
                                    </div>
                                </div>

                                {/* Slider Control Line & Thumb */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center pointer-events-none"
                                    style={{ left: `calc(${sliderPos}% - 1px)` }}
                                >
                                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-2xl font-black text-lg group-hover:scale-110 transition-transform cursor-pointer">
                                        ↔
                                    </div>
                                </div>

                                {/* Interactive Range Input overlaying everything */}
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={sliderPos}
                                    onChange={(e) => setSliderPos(Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0"
                                />
                            </CardContent>
                        </Card>

                        {/* Presets Gallery */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 relative space-y-0">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Perfis Sugeridos <span className="text-orange-500 text-xl">↓</span>
                                </CardTitle>
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-none font-bold uppercase tracking-wider text-[10px]">
                                    AUTO
                                </Badge>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8">
                                <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory perspective-1000">
                                    {PRESETS.map((preset) => (
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

                                            <p className="text-[11px] font-bold text-white leading-tight mt-auto relative z-10 px-1 drop-shadow-md">
                                                {preset.title}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Realism Config */}
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 relative">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-orange-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                                        <Sparkles size={28} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">Configuração Realista</CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground mt-1 font-bold italic tracking-wider uppercase">FOTO & VÍDEO ENGINE</CardDescription>
                                    </div>
                                </div>

                                <div className="flex bg-muted p-1 rounded-xl shadow-inner border border-border">
                                    <button
                                        onClick={() => setGenMode("simple")}
                                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", genMode === 'simple' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <ListChecks size={18} /> Básico
                                    </button>
                                    <button
                                        onClick={() => setGenMode("advanced")}
                                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", genMode === 'advanced' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                    >
                                        <TerminalWindow size={18} /> Expert
                                    </button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8 space-y-8">
                                {/* Demographics Info */}
                                <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 shadow-inner">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge variant="outline" className="text-[10px] font-bold border-orange-500/20 text-orange-500 uppercase">Fase 1</Badge>
                                        <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Características Físicas</Label>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Gênero</Label>
                                            <Select value={userDetails.genero} onValueChange={(v) => setUserDetails({ ...userDetails, genero: v })}>
                                                <SelectTrigger className="bg-card"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Qualquer</SelectItem>
                                                    <SelectItem value="man">Homem</SelectItem>
                                                    <SelectItem value="woman">Mulher</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Idade (aprox)</Label>
                                            <Select value={userDetails.idade} onValueChange={(v) => setUserDetails({ ...userDetails, idade: v })}>
                                                <SelectTrigger className="bg-card"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Qualquer</SelectItem>
                                                    <SelectItem value="20 year old">20 anos</SelectItem>
                                                    <SelectItem value="30 year old">30 anos</SelectItem>
                                                    <SelectItem value="40 year old">40 anos</SelectItem>
                                                    <SelectItem value="50 year old">50 anos</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Etnia</Label>
                                            <Select value={userDetails.etnia} onValueChange={(v) => setUserDetails({ ...userDetails, etnia: v })}>
                                                <SelectTrigger className="bg-card"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Qualquer</SelectItem>
                                                    <SelectItem value="caucasian">Caucasiano</SelectItem>
                                                    <SelectItem value="black">Negro</SelectItem>
                                                    <SelectItem value="asian">Asiático</SelectItem>
                                                    <SelectItem value="latino">Latino</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Cabelo</Label>
                                            <Select value={userDetails.cabelo} onValueChange={(v) => setUserDetails({ ...userDetails, cabelo: v })}>
                                                <SelectTrigger className="bg-card"><SelectValue placeholder="Qualquer" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Qualquer</SelectItem>
                                                    <SelectItem value="blonde">Loiro</SelectItem>
                                                    <SelectItem value="brown">Castanho</SelectItem>
                                                    <SelectItem value="black">Preto</SelectItem>
                                                    <SelectItem value="red">Ruivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Techniques Tabs */}
                                <div className="space-y-6">
                                    <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar">
                                        {TABS.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border whitespace-nowrap",
                                                    activeTab === tab.id
                                                        ? "bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-500/20 scale-105"
                                                        : "bg-muted text-muted-foreground border-border hover:border-orange-500/50 hover:text-foreground"
                                                )}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                        {(() => {
                                            const groupKey = activeTab as keyof typeof CHECKBOX_COMMANDS;
                                            return CHECKBOX_COMMANDS[groupKey]?.map((cmd) => {
                                                const isSelected = selectedCheckboxes.has(cmd.id);
                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        onClick={() => toggleCommand(cmd.id)}
                                                        className={cn(
                                                            "group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left relative overflow-hidden",
                                                            isSelected ? "border-orange-500 bg-orange-500/5 shadow-inner" : "border-border bg-card hover:border-orange-500/30"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "size-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 shadow-sm",
                                                            isSelected ? "bg-orange-500 border-orange-500 text-black" : "border-muted-foreground/30 bg-background"
                                                        )}>
                                                            {isSelected && <CheckCircle2 size={16} strokeWidth={3} />}
                                                        </div>
                                                        <div className="relative z-10">
                                                            <div className="font-bold text-foreground mb-1 leading-tight group-hover:text-orange-500 transition-colors">
                                                                {cmd.title}
                                                            </div>
                                                            <div className="text-[10px] font-medium text-muted-foreground leading-relaxed uppercase tracking-tight">
                                                                {cmd.description}
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            })
                                        })()}
                                    </div>
                                </div>

                                {genMode === "advanced" && (
                                    <div className="space-y-6 pt-6 border-t border-border animate-fade-up">
                                        <div className="space-y-4">
                                            <Label className="font-bold text-primary uppercase text-[10px] tracking-widest">Cenário Primário (Ação / Contexto)</Label>
                                            <Textarea
                                                placeholder="Descreva o que a pessoa está fazendo. Ex: Uma pessoa andando de skate no asfalto molhado..."
                                                className="resize-none bg-input focus:ring-primary/50 text-base p-4 min-h-[80px]"
                                                rows={2}
                                                value={customAction}
                                                onChange={e => setCustomAction(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="font-bold text-destructive uppercase text-[10px] tracking-widest">Prompt Negativo</Label>
                                            <Textarea
                                                placeholder="plastic skin, 3d render, low quality, cartoony, bad eyes..."
                                                className="resize-none bg-destructive/5 focus:ring-destructive/50 text-sm p-4 min-h-[60px]"
                                                rows={1}
                                                value={negativePrompt}
                                                onChange={e => setNegativePrompt(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-6">
                                    <Button
                                        onClick={handleClear}
                                        variant="ghost"
                                        className="w-full mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500"
                                    >
                                        <RotateCcw className="mr-2 size-3" /> Limpar Configuração
                                    </Button>
                                    <Button
                                        onClick={() => {}} // Prompt generates automatically in the side panel via hook
                                        className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] rounded-2xl bg-orange-500 hover:bg-orange-600 text-black shadow-2xl shadow-orange-500/20 transition-all active:scale-[0.98]"
                                        disabled={!finalPrompt}
                                    >
                                        Prompt Pronto
                                    </Button>
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
                                        <TerminalWindow size={24} className="text-orange-500" />
                                        Prompt Gerado
                                    </CardTitle>
                                    <Badge className="bg-orange-500/20 text-orange-500 border-none font-extrabold uppercase tracking-wider text-[0.65rem]">
                                        HUMAN ENGINE
                                    </Badge>
                                </div>
                            </CardHeader>

                            <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex items-start gap-3">
                                <span className="text-2xl mt-0.5 animate-pulse">👥</span>
                                <div>
                                    <h3 className="text-orange-500 font-bold text-sm tracking-tight mb-1">Qualidade Profissional</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                                        Use este prompt no <strong className="text-foreground">Flux.1 Pro</strong> ou <strong className="text-foreground">Midjourney v6.1</strong> para melhores resultados em peles e texturas.
                                    </p>
                                </div>
                            </div>

                            <CardContent className="p-6 min-h-[300px] flex flex-col">
                                {finalPrompt ? (
                                    <div className="flex-1 flex flex-col">
                                        <Textarea
                                            className="flex-1 bg-input border-none text-foreground placeholder:text-muted-foreground resize-none min-h-[250px] text-[14px] font-mono p-4 focus-visible:ring-1 focus-visible:ring-orange-500/50 rounded-xl custom-scrollbar leading-relaxed"
                                            readOnly
                                            value={finalPrompt}
                                        />

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={() => toggleFavorite("gerador-humano", {
                                                    mode, genMode, selectedPreset, selectedCheckboxes: Array.from(selectedCheckboxes), customAction, negativePrompt, userDetails
                                                }, finalPrompt, `Humano ${userDetails.genero || selectedPreset || 'Realista'}`)}
                                                className={cn(
                                                    "bg-input hover:bg-muted-foreground/20 text-muted-foreground border-none transition-all",
                                                    isFavorited(finalPrompt) && "text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20"
                                                )}
                                            >
                                                {isFavorited(finalPrompt) ? <Star size={20} fill="currentColor" className="mr-2" /> : <Star size={20} className="mr-2" />}
                                                {isFavorited(finalPrompt) ? 'Favoritado' : 'Favoritar'}
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
                                        <ImageIcon size={48} className="text-orange-500 mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm font-medium">
                                            Selecione as características e clique para gerar as instruções de realismo.
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
                        generatorName="gerador-humano"
                    />
                </div>
            </div>

            <FloatingHelpButton pageTitle="Gerador Humano" />
        </div>
    );
}

export default function GeradorHumanoPage() {
    return (
        <Suspense fallback={
            <div className="max-w-[1400px] mx-auto px-6 mt-32 space-y-12 text-center">
                <Skeleton className="h-12 w-1/3 mx-auto rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <Skeleton className="h-[400px] w-full rounded-[24px]" />
                        <Skeleton className="h-[400px] w-full rounded-[24px]" />
                    </div>
                    <div className="lg:col-span-5">
                        <Skeleton className="h-[600px] w-full rounded-[24px]" />
                    </div>
                </div>
            </div>
        }>
            <GeradorHumanoContent />
        </Suspense>
    );
}
