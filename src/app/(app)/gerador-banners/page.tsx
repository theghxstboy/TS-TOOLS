"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Sparkles,
    Copy,
    CheckCircle2 as CheckCircle,
    Monitor,
    Smartphone,
    Layout,
    Palette,
    Layers,
    Info,
    RefreshCcw,
    Zap,
    Image as ImageIcon,
    Type,
    Maximize,
    MousePointer2
} from "lucide-react"
import { useClipboard } from "@/hooks/useClipboard"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { BANNER_NICHES, BANNER_STYLES, BANNER_RATIOS, BANNER_COMPOSITIONS, BANNER_THEMES } from "@/constants/presets-banners"

export default function GeradorBanners() {
    const [niche, setNiche] = useState("roofing")
    const [nicheOther, setNicheOther] = useState("")
    const [style, setStyle] = useState("photorealistic")
    const [styleOther, setStyleOther] = useState("")
    const [theme, setTheme] = useState("none")
    const [themeOther, setThemeOther] = useState("")
    const [ratio, setRatio] = useState("desktop-hd")
    const [composition, setComposition] = useState("left")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const { isCopied, copy } = useClipboard()

    const handleGenerate = () => {
        setIsGenerating(true)
        
        const finalNiche = niche === 'other' ? nicheOther : BANNER_NICHES.find(n => n.id === niche)?.label || niche
        const finalStyle = style === 'other' ? styleOther : BANNER_STYLES.find(s => s.id === style)?.label || style
        const finalTheme = theme === 'other' ? themeOther : BANNER_THEMES.find(t => t.id === theme)?.label || theme
        
        const selectedStyle = BANNER_STYLES.find(s => s.id === style)
        const selectedRatio = BANNER_RATIOS.find(r => r.id === ratio)
        const selectedComp = BANNER_COMPOSITIONS.find(c => c.id === composition)

        let prompt = `Professional background image for a commercial banner, niche: ${finalNiche}. `
        
        if (theme !== 'none') {
            prompt += `Seasonal Thematic: ${finalTheme}. `
        }
        
        prompt += `Visual Style: ${finalStyle}. ${selectedStyle?.description || ""} `
        prompt += `Composition: ${selectedComp?.description} MUST LEAVE CLEAR EMPTY SPACE for text overlay. `
        prompt += `High-end quality, 8k resolution, cinematic lighting, professional photography. `
        prompt += `STRICT RULE: NO TEXT, NO LETTERS, NO WORDS, NO CHARACTERS, NO SIGNAGE, NO NUMBERS. Pure visual background only.`
        
        if (selectedRatio?.id.includes('desktop')) {
            prompt += ` Optimized for desktop width.`
        } else if (selectedRatio?.id.includes('mobile')) {
            prompt += ` Optimized for mobile vertical perspective.`
        }

        // Midjourney parameters if applicable
        if (selectedRatio) {
            const mjRatio = selectedRatio.ratio.replace('/', ':')
            prompt += ` --ar ${mjRatio} --v 6.0 --stylize 250`
        }

        setTimeout(() => {
            setGeneratedPrompt(prompt)
            setIsGenerating(false)
        }, 600)
    }

    const handleClear = () => {
        setNiche("roofing")
        setNicheOther("")
        setStyle("photorealistic")
        setStyleOther("")
        setTheme("none")
        setThemeOther("")
        setRatio("desktop-hd")
        setComposition("left")
        setGeneratedPrompt("")
    }

    return (
        <div className="flex-1 w-full relative font-sans">
            <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8 md:py-12">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-6 mb-16 animate-fade-up">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-20 rounded-[28px] bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/30">
                            <ImageIcon size={48} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase">
                                Gerador de <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Banners</span>
                            </h1>
                            <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1 italic opacity-70">
                                BACKGROUND ENGINE FOR ELEMENTOR
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Config Column */}
                    <div className="lg:col-span-7 space-y-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                            <CardHeader className="pb-6 relative border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold uppercase tracking-tight">Parâmetros da Imagem</CardTitle>
                                        <CardDescription className="text-xs font-medium">Configure as diretrizes para a IA</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8 space-y-8">
                                <div className="space-y-10">
                                    {/* Row 1: Basic Config */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Niche Selection */}
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                                                <Layout size={16} className="text-cyan-500" />
                                                Nicho do Projeto
                                            </Label>
                                            <Select value={niche} onValueChange={setNiche}>
                                                <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl focus:ring-cyan-500/20">
                                                    <SelectValue placeholder="Selecione o nicho..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border">
                                                    <SelectGroup>
                                                        <SelectLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2 py-1.5 grayscale opacity-50">Exterior</SelectLabel>
                                                        {BANNER_NICHES.filter(n => n.group === 'Exterior').map(n => (
                                                            <SelectItem key={n.id} value={n.id} className="rounded-lg">{n.label}</SelectItem>
                                                        ))}
                                                        <SelectLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2 py-1.5 grayscale opacity-50 mt-2">Interior</SelectLabel>
                                                        {BANNER_NICHES.filter(n => n.group === 'Interior').map(n => (
                                                            <SelectItem key={n.id} value={n.id} className="rounded-lg">{n.label}</SelectItem>
                                                        ))}
                                                        <SelectLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-2 py-1.5 grayscale opacity-50 mt-2">Personalizado</SelectLabel>
                                                        <SelectItem value="other" className="rounded-lg font-bold text-cyan-500">Outro (Especifique)</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {niche === 'other' && (
                                                <Input 
                                                    placeholder="Qual o nicho?" 
                                                    value={nicheOther} 
                                                    onChange={e => setNicheOther(e.target.value)}
                                                    className="bg-background/30 border-cyan-500/30 h-11 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                                                />
                                            )}
                                        </div>

                                        {/* Theme Selection */}
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                                                <Sparkles size={16} className="text-cyan-500" />
                                                Temática Sazonal
                                            </Label>
                                            <Select value={theme} onValueChange={setTheme}>
                                                <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl focus:ring-cyan-500/20">
                                                    <SelectValue placeholder="Escolha um tema..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border">
                                                    {BANNER_THEMES.map(t => (
                                                        <SelectItem key={t.id} value={t.id} className="rounded-lg">
                                                            <div className="flex flex-col gap-0.5 py-1">
                                                                <span className="font-bold text-sm tracking-tight">{t.label}</span>
                                                                <span className="text-[10px] text-muted-foreground opacity-70 leading-none">{t.description}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {theme === 'other' && (
                                                <Input 
                                                    placeholder="Qual a temática?" 
                                                    value={themeOther} 
                                                    onChange={e => setThemeOther(e.target.value)}
                                                    className="bg-background/30 border-cyan-500/30 h-11 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 2: Visual Style (Full Width) */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Palette size={16} className="text-cyan-500" />
                                            Estilo Visual
                                        </Label>
                                        <Select value={style} onValueChange={setStyle}>
                                            <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl focus:ring-cyan-500/20">
                                                <SelectValue placeholder="Escolha o estilo..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border">
                                                {BANNER_STYLES.map(s => (
                                                    <SelectItem key={s.id} value={s.id} className="rounded-lg">
                                                        <div className="flex flex-col gap-0.5 py-1">
                                                            <span className="font-bold text-sm tracking-tight">{s.label}</span>
                                                            <span className="text-[10px] text-muted-foreground opacity-70 leading-none">{s.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {style === 'other' && (
                                            <Input 
                                                placeholder="Qual o estilo visual?" 
                                                value={styleOther} 
                                                onChange={e => setStyleOther(e.target.value)}
                                                className="bg-background/30 border-cyan-500/30 h-11 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                                            />
                                        )}
                                    </div>

                                    {/* Row 3: Aspect Ratio Tiles (Full Width) */}
                                    <div className="space-y-4">
                                        <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Maximize size={16} className="text-cyan-500" />
                                            Aspect Ratio (Proporção)
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {BANNER_RATIOS.map(r => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => setRatio(r.id)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all group overflow-hidden relative min-h-[90px]",
                                                        ratio === r.id 
                                                            ? "border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/10" 
                                                            : "border-border/50 bg-background/30 hover:border-border hover:bg-background/50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "size-8 mb-2 flex items-center justify-center rounded-lg transition-transform",
                                                        ratio === r.id ? "text-cyan-500 scale-110" : "text-muted-foreground group-hover:scale-110"
                                                    )}>
                                                        {r.id.includes('desktop') ? <Monitor size={24} /> : <Smartphone size={24} />}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest line-clamp-1">{r.label.split('(')[0]}</span>
                                                    <span className="text-[9px] font-bold text-muted-foreground">{r.value}</span>
                                                    {ratio === r.id && (
                                                        <div className="absolute top-1 right-1">
                                                            <div className="size-3 bg-cyan-500 rounded-full flex items-center justify-center">
                                                                <CheckCircle size={10} className="text-black" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Row 4: Composition Tiles (Full Width) */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                                                <MousePointer2 size={16} className="text-cyan-500" />
                                                Espaço da Copy (Composição)
                                            </Label>
                                            <p className="text-[10px] text-muted-foreground font-medium italic">Define onde a IA deixará espaço limpo para o texto no WordPress.</p>
                                        </div>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                            {BANNER_COMPOSITIONS.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setComposition(c.id)}
                                                    className={cn(
                                                        "aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all p-1",
                                                        composition === c.id 
                                                            ? "border-cyan-500 bg-cyan-500/5 shadow-md shadow-cyan-500/10" 
                                                            : "border-border/50 bg-background/30 hover:border-border hover:bg-background/50"
                                                    )}
                                                >
                                                    {/* Visual Indicator of Composition */}
                                                    <div className="size-10 border border-muted-foreground/30 rounded bg-muted/20 relative overflow-hidden">
                                                        <div className={cn(
                                                            "absolute transition-all duration-300",
                                                            c.id === 'left' && "inset-y-0 left-0 w-1/2 bg-cyan-500/40",
                                                            c.id === 'right' && "inset-y-0 right-0 w-1/2 bg-cyan-500/40",
                                                            c.id === 'center' && "inset-2 bg-cyan-500/40 rounded-sm",
                                                            c.id === 'top' && "inset-x-0 top-0 h-1/2 bg-cyan-500/40",
                                                            c.id === 'bottom' && "inset-x-0 bottom-0 h-1/2 bg-cyan-500/40"
                                                        )} />
                                                        <Type size={12} className={cn(
                                                            "absolute z-10 text-white/80 drop-shadow-md transition-all",
                                                            c.id === 'left' && "left-2 top-1/2 -translate-y-1/2",
                                                            c.id === 'right' && "right-2 top-1/2 -translate-y-1/2",
                                                            c.id === 'center' && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                                                            c.id === 'top' && "top-2 left-1/2 -translate-x-1/2",
                                                            c.id === 'bottom' && "bottom-2 left-1/2 -translate-x-1/2"
                                                        )} />
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase tracking-tight text-center leading-none px-1 h-3">{c.label.split(' ')[2] || c.label.split(' ')[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleClear}
                                        className="h-14 px-6 rounded-2xl border-border/50 hover:bg-muted font-bold text-muted-foreground"
                                    >
                                        <RefreshCcw size={18} className="mr-2" /> Limpar
                                    </Button>
                                    <Button 
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="flex-1 h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-600 shadow-xl shadow-cyan-500/20 text-black font-black uppercase tracking-widest text-base transition-transform active:scale-95"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <RefreshCcw size={22} className="mr-3 animate-spin" /> Processando...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={22} className="mr-3" /> Gerar Prompt
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Output Column */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 animate-fade-up" style={{ animationDelay: '200ms' }}>
                        <Card className="rounded-[24px] border-cyan-500/20 shadow-2xl overflow-hidden bg-background relative overflow-hidden group">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 size-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-cyan-500/10 pointer-events-none" />
                            
                            <CardHeader className="bg-cyan-500/10 border-b border-cyan-500/20 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ImageIcon size={20} className="text-cyan-500" />
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-cyan-500 leading-none">Prompt Resultante</CardTitle>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase border-cyan-500/30 text-cyan-500 bg-cyan-500/5 px-2 py-0.5">
                                        IMG-ONLY
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8 space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <div className="bg-muted/30 border border-border/50 p-6 rounded-2xl min-h-[220px] relative group-output">
                                        {generatedPrompt ? (
                                            <p className="text-sm font-medium leading-relaxed text-foreground animate-in fade-in duration-500 font-mono">
                                                {generatedPrompt}
                                            </p>
                                        ) : (
                                            <div className="h-full flex flex-row items-center justify-center gap-4 text-muted-foreground opacity-50 absolute inset-0">
                                                <div className="size-16 border-4 border-dashed border-muted-foreground/20 rounded-2xl flex items-center justify-center animate-pulse">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black uppercase tracking-widest italic">Aguardando geração...</p>
                                                    <p className="text-[10px] font-medium leading-none">Configure os dados ao lado.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button 
                                        disabled={!generatedPrompt}
                                        onClick={() => copy(generatedPrompt)}
                                        className={cn(
                                            "w-full h-14 rounded-2xl font-black uppercase tracking-widest transition-all",
                                            isCopied 
                                                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                                                : "bg-foreground hover:bg-foreground/90 text-background shadow-lg"
                                        )}
                                    >
                                        {isCopied ? (
                                            <>
                                                <CheckCircle size={20} className="mr-2" /> Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={20} className="mr-2" /> Copiar para o Mural
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <Separator className="bg-border/50" />

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <Info size={14} className="text-cyan-500" /> Como Utilizar
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 items-start group">
                                            <div className="size-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-black text-cyan-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">1</div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Copie o prompt acima e cole no <strong className="text-foreground">Midjourney</strong> (usando /imagine) ou no <strong className="text-foreground">DALL-E 3</strong>.</p>
                                        </li>
                                        <li className="flex gap-3 items-start group">
                                            <div className="size-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-black text-cyan-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">2</div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Baixe a imagem gerada (limpa, sem textos) e suba para o <strong className="text-foreground">WordPress Elementor</strong>.</p>
                                        </li>
                                        <li className="flex gap-3 items-start group">
                                            <div className="size-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-black text-cyan-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">3</div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Use widgets de <strong className="text-foreground">Heading/Editor de Texto</strong> para sobrepor a copy exatamente na área limpa selecionada.</p>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
