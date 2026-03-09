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
    Star
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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

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
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-20 font-sans">
            {/* Top Bar matching TS TOOLS branding */}
            <div className="max-w-[1400px] mx-auto px-6 py-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-primary flex items-center justify-center text-black shadow-lg relative group">
                        <TerminalWindow size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                                Gerador <span className="text-primary text-xl">↓</span>
                            </h1>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">REALISM OVERRIDE SYSTEM</p>
                    </div>
                </div>

                <div className="flex bg-card rounded-xl p-1 shadow-inner border border-border">
                    <button
                        onClick={() => setMode("imagem")}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
                            mode === "imagem"
                                ? "bg-gradient-to-r from-orange-400 to-primary text-black shadow-md"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <ImageIcon size={18} /> Imagem
                    </button>
                    <button
                        onClick={() => setMode("video")}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
                            mode === "video"
                                ? "bg-background text-foreground shadow-md border border-border"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <Video size={18} /> Vídeo
                    </button>
                </div>
            </div>

            {/* Main Layout - Output Left, Inputs Right ? User didn't ask to revert, but we'll stick to Output Right, Inputs Left */}
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: Settings (Presets & Commands) */}
                    <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Empty container just to keep spacing if needed or you can remove entirely */}
                        </div>

                        {/* Thumbnail View (Above Presets) */}
                        <div className="bg-background w-full h-[300px] md:h-[400px] rounded-[24px] border border-border shadow-xl relative overflow-hidden group flex items-center justify-center select-none">
                            {/* Original Image (Antes) */}
                            <img
                                src="/humano-antes.jpg"
                                alt="Sem IA"
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold pointer-events-none z-10">
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
                                <div className="absolute inset-0 border-r-[2px] border-white pointer-events-none shadow-[10px_0_20px_rgba(0,0,0,0.5)]"></div>
                                <div className="absolute top-4 left-4 bg-primary text-black px-3 py-1 rounded-full text-xs font-bold pointer-events-none shadow-md">
                                    Com Realismo
                                </div>
                            </div>

                            {/* Fake Slider Line & Thumb */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center pointer-events-none"
                                style={{ left: `calc(${sliderPos}% - 1px)` }}
                            >
                                <div className="w-8 h-8 min-w-8 min-h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg font-bold text-xs shadow-white/20">
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
                        </div>

                        {/* Presets Gallery */}
                        <div className="bg-card rounded-[24px] p-8 border border-border shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Nichos Prontos (Presets) <span className="text-primary text-xl">↓</span>
                                </h2>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                    Realismo Ativado
                                </span>
                            </div>



                            <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory">
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

                                        {/* Gradient overlay to make text readable */}
                                        <div className="absolute inset-[-1px] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                        {/* Fake Checkbox in top right */}
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
                        </div>

                        {/* Realism Commands */}
                        <div className="bg-card rounded-[24px] p-8 border border-border shadow-xl flex-grow">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Comandos para realismo <span className="text-primary text-xl">↓</span>
                                </h2>
                            </div>

                            {/* User Details Form Row */}
                            <div className="bg-background rounded-xl p-6 border border-border mb-6">
                                <h3 className="text-sm font-bold text-foreground mb-4 opacity-80 uppercase tracking-wider">
                                    1. Características da Pessoa (Opcional)
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <Label className="block text-xs text-muted-foreground mb-2">Gênero</Label>
                                        <Select value={userDetails.genero} onValueChange={(v) => setUserDetails({ ...userDetails, genero: v })}>
                                            <SelectTrigger><SelectValue placeholder="Qualquer" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Qualquer</SelectItem>
                                                <SelectItem value="man">Homem</SelectItem>
                                                <SelectItem value="woman">Mulher</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="block text-xs text-muted-foreground mb-2">Idade (aprox)</Label>
                                        <Select value={userDetails.idade} onValueChange={(v) => setUserDetails({ ...userDetails, idade: v })}>
                                            <SelectTrigger><SelectValue placeholder="Qualquer" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Qualquer</SelectItem>
                                                <SelectItem value="20 year old">20 anos</SelectItem>
                                                <SelectItem value="30 year old">30 anos</SelectItem>
                                                <SelectItem value="40 year old">40 anos</SelectItem>
                                                <SelectItem value="50 year old">50 anos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="block text-xs text-muted-foreground mb-2">Etnia</Label>
                                        <Select value={userDetails.etnia} onValueChange={(v) => setUserDetails({ ...userDetails, etnia: v })}>
                                            <SelectTrigger><SelectValue placeholder="Qualquer" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Qualquer</SelectItem>
                                                <SelectItem value="caucasian">Caucasiano</SelectItem>
                                                <SelectItem value="black">Negro</SelectItem>
                                                <SelectItem value="asian">Asiático</SelectItem>
                                                <SelectItem value="latino">Latino</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="block text-xs text-muted-foreground mb-2">Cabelo</Label>
                                        <Select value={userDetails.cabelo} onValueChange={(v) => setUserDetails({ ...userDetails, cabelo: v })}>
                                            <SelectTrigger><SelectValue placeholder="Qualquer" /></SelectTrigger>
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

                            <h3 className="text-sm font-bold text-foreground mb-4 opacity-80 uppercase tracking-wider">
                                2. Técnicas e Ambientação
                            </h3>

                            {/* Tabs */}
                            <div className="flex flex-wrap gap-2 pb-4 mb-4">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border",
                                            activeTab === tab.id
                                                ? "bg-gradient-to-r from-orange-400 to-primary text-black border-transparent"
                                                : "bg-background text-muted-foreground hover:text-foreground border-border hover:border-primary/50"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Checkbox List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(() => {
                                    const groupKey = activeTab as keyof typeof CHECKBOX_COMMANDS;
                                    return CHECKBOX_COMMANDS[groupKey]?.map((cmd) => {
                                        const isSelected = selectedCheckboxes.has(cmd.id);
                                        return (
                                            <button
                                                key={cmd.id}
                                                onClick={() => toggleCommand(cmd.id)}
                                                className={cn(
                                                    "flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                                                    isSelected ? "border-primary bg-primary/5 shadow-[0_4px_20px_-5px_rgba(255,107,0,0.15)]" : "border-border bg-input/50 hover:border-primary/50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 shrink-0 rounded-[6px] border-[2.5px] flex items-center justify-center transition-all mt-0.5",
                                                    isSelected ? "bg-primary border-primary text-black" : "border-muted-foreground/30 group-hover:border-primary/50 bg-background"
                                                )}>
                                                    {isSelected && <Check size={14} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors pr-2">
                                                        {cmd.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground leading-relaxed">
                                                        {cmd.description}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })
                                })()}
                            </div>

                            {/* Mode Toggles for Simple / Advanced & Custom Textareas */}
                            <div className="mt-8 pt-8 border-t border-border/50">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                                    <h3 className="text-md font-bold text-foreground">Ajustes Adicionais</h3>
                                    <div className="flex items-center bg-muted p-1 rounded-xl self-start sm:self-auto w-fit mt-3 sm:mt-0">
                                        <button
                                            onClick={() => setGenMode("simple")}
                                            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", genMode === 'simple' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                        >
                                            <ListChecks size={18} />
                                            Básico
                                        </button>
                                        <button
                                            onClick={() => setGenMode("advanced")}
                                            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all", genMode === 'advanced' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                                        >
                                            <TerminalWindow size={18} />
                                            Avançado
                                        </button>
                                    </div>
                                </div>

                                {genMode === "advanced" && (
                                    <div className="p-5 rounded-xl bg-background border border-border space-y-4 shadow-inner">
                                        <div>
                                            <Label className="block mb-2 font-semibold text-primary">Cenário Primário (Ação / Contexto)</Label>
                                            <Textarea
                                                placeholder="Descreva o que a pessoa está fazendo. Ex: Uma pessoa andando de skate no asfalto molhado..."
                                                className="resize-none bg-input focus:ring-primary/50"
                                                rows={2}
                                                value={customAction}
                                                onChange={e => setCustomAction(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="block mb-2 font-semibold text-destructive">Prompt Negativo</Label>
                                            <Textarea
                                                placeholder="plastic skin, 3d render, low quality..."
                                                className="resize-none bg-input focus:ring-destructive/50"
                                                rows={1}
                                                value={negativePrompt}
                                                onChange={e => setNegativePrompt(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Output (Prompt Top, Slider Bottom) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2">

                        {/* Output Column - Standardized */}
                        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden sticky top-24">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/50">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <TerminalWindow size={24} className="text-primary" />
                                    Resultado do Prompt
                                </h2>
                                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-primary/20 text-primary">
                                    HUMAN REALISM OTIMIZADO
                                </span>
                            </div>

                            <div className="p-6 min-h-[300px] flex flex-col">
                                {finalPrompt ? (
                                    <div className="flex-1 flex flex-col">
                                        <Textarea
                                            className="flex-1 bg-input border-none text-foreground placeholder:text-muted-foreground resize-none min-h-[200px] text-base p-4 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl custom-scrollbar"
                                            readOnly
                                            value={finalPrompt}
                                        />

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={() => toggleFavorite("gerador-humano", {
                                                    mode, genMode, selectedPreset, selectedCheckboxes: Array.from(selectedCheckboxes), customAction, negativePrompt, userDetails
                                                }, finalPrompt, `Humano ${userDetails.genero || selectedPreset}`)}
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
                                                className={`font-semibold shadow-md border-none ${isCopied ? 'bg-green-600 hover:bg-green-700 text-black' : 'bg-card text-foreground hover:bg-muted'}`}
                                            >
                                                {isCopied ? <Check size={20} className="mr-2" /> : <Copy size={20} className="mr-2" />}
                                                {isCopied ? 'Copiado!' : 'Copiar'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 min-h-[200px]">
                                        <MagicWand size={48} className="text-primary mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm">
                                            Configure as características para ver o prompt realista aqui.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-primary/10 border-t border-primary/20 p-4">
                                <h3 className="text-primary font-bold text-xs uppercase tracking-wider mb-1">Dica de Realismo</h3>
                                <p className="text-muted-foreground text-[10px] leading-relaxed">
                                    Recomendamos o uso do <strong className="text-primary">Flux.1 Pro</strong> ou <strong className="text-primary">Midjourney v6</strong> para a criação das imagens, e <strong className="text-primary">Kling AI</strong> para vídeo.
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
                        generatorName="gerador-humano"
                    />
                </div>
            </div>

            <FloatingHelpButton pageTitle="Gerador Humano" />
        </div>
    )
}

export default function GeradorHumanoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Carregando gerador...</div>}>
            <GeradorHumanoContent />
        </Suspense>
    )
}
