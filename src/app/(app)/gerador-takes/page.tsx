"use client"

import { useState, useRef, useCallback } from "react"
import {
    Copy,
    CheckCircle2 as CheckCircle,
    Check,
    Wand2 as MagicWand,
    Terminal as TerminalWindow,
    Info,
    Layout,
    Zap,
    X,
    FileImage,
    Film,
    User,
    Mic,
    Image as ImageIcon,
    Camera,
    RefreshCcw,
    Maximize,
    Smartphone,
    Monitor,
    MonitorPlay,
    Sun
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useClipboard } from "@/hooks/useClipboard"
import { useGenerationHistory } from "@/hooks/useGenerationHistory"
import { GenerationHistory } from "@/components/GenerationHistory"
import { HistoryItem } from "@/types/generator"
import { TAKES_NICHES, TAKES_STYLES, TAKES_RATIOS, TAKES_SETTINGS, TAKES_ACTIONS, TAKES_SOUNDS } from "@/constants/presets-takes"
import { FloatingHelpButton } from "@/components/FloatingHelpButton"

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

export default function GeradorTakes() {
    // States
    const [mode, setMode] = useState<"basic" | "advanced">("basic")

    const [niche, setNiche] = useState("roofing")
    const [nicheOther, setNicheOther] = useState("")
    const [character, setCharacter] = useState("A man")
    const [characterOther, setCharacterOther] = useState("")
    const [setting, setSetting] = useState("soft-natural")
    const [settingOther, setSettingOther] = useState("")
    
    const [action, setAction] = useState("talking-vlog")
    const [actionOther, setActionOther] = useState("")
    
    const [dialogue, setDialogue] = useState("")
    
    const [ambientSound, setAmbientSound] = useState("light-yard")
    const [ambientSoundOther, setAmbientSoundOther] = useState("")
    
    const [style, setStyle] = useState("vlog")
    const [styleOther, setStyleOther] = useState("")
    
    const [ratio, setRatio] = useState("HORIZONTAL")

    // Image States
    const [initialFrame, setInitialFrame] = useState<UploadedFile | null>(null)
    const [finalFrame, setFinalFrame] = useState<UploadedFile | null>(null)
    
    const initialInputRef = useRef<HTMLInputElement>(null)
    const finalInputRef = useRef<HTMLInputElement>(null)

    // Popup states
    const [showWorkflowPopup, setShowWorkflowPopup] = useState(false)
    const [copiedType, setCopiedType] = useState<"prompt" | "initial" | "final" | null>(null)

    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const { isCopied, copy } = useClipboard()

    const { history, saveHistory } = useGenerationHistory<any>("gerador-takes")

    const handleRestore = (item: HistoryItem<any>) => {
        const p = item.payload;
        if (!p) return;
        setMode(p.mode || "basic")
        setNiche(p.niche || "roofing")
        setNicheOther(p.nicheOther || "")
        setCharacter(p.character || "A man")
        setCharacterOther(p.characterOther || "")
        setSetting(p.setting || "soft-natural")
        setSettingOther(p.settingOther || "")
        setAction(p.action || "talking-vlog")
        setActionOther(p.actionOther || "")
        setDialogue(p.dialogue || "")
        setAmbientSound(p.ambientSound || "light-yard")
        setAmbientSoundOther(p.ambientSoundOther || "")
        setStyle(p.style || "vlog")
        setStyleOther(p.styleOther || "")
        setRatio(p.ratio || "HORIZONTAL")
        setGeneratedPrompt(item.prompt || "")
    }

    const handleGenerate = useCallback(() => {
        setIsGenerating(true)
        
        const finalNiche = niche === 'other' ? nicheOther : TAKES_NICHES.find(n => n.id === niche)?.label || niche
        
        const resolveField = (val: string, otherVal: string, list: any[]) => {
            if (mode === 'advanced') return otherVal;
            if (val === 'other') return otherVal;
            return list.find(i => i.id === val)?.label || val;
        }

        const resolveChar = (val: string, otherVal: string) => {
            if (mode === 'advanced') return otherVal;
            if (val === 'other') return otherVal;
            return val;
        }

        const finalStyle = resolveField(style, styleOther, TAKES_STYLES)
        const finalSetting = resolveField(setting, settingOther, TAKES_SETTINGS)
        const finalAction = resolveField(action, actionOther, TAKES_ACTIONS)
        const finalSound = resolveField(ambientSound, ambientSoundOther, TAKES_SOUNDS)
        const finalCharacter = resolveChar(character, characterOther)

        const promptTemplate = `
Scene & Action:
Setting: ${finalSetting}.
${finalCharacter} is ${finalAction}
Style: ${finalStyle} style presentation for ${finalNiche}.
Aspect Ratio: ${ratio === 'HORIZONTAL' ? '16:9' : '9:16'}

Dialogue: The character speaks in a simple, natural tone:
Spoken dialogue: "${dialogue}"

Ambient Sound: ${finalSound}
`.trim()

        setTimeout(() => {
            setGeneratedPrompt(promptTemplate)
            saveHistory({
                mode, niche, nicheOther, character, setting, settingOther, action, actionOther, dialogue, ambientSound, ambientSoundOther, style, styleOther, ratio
            }, promptTemplate)
            setIsGenerating(false)
        }, 600)
    }, [niche, nicheOther, character, setting, action, dialogue, ambientSound, style, ratio, mode, saveHistory])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'initial' | 'final') => {
        const file = e.target.files?.[0]
        if (!file) return
        const previewUrl = await toBase64(file)
        if (type === 'initial') {
            setInitialFrame({ file, previewUrl, name: file.name })
        } else {
            setFinalFrame({ file, previewUrl, name: file.name })
        }
    }

    const removeImage = (type: 'initial' | 'final') => {
        if (type === 'initial') {
            setInitialFrame(null)
            if (initialInputRef.current) initialInputRef.current.value = ""
        } else {
            setFinalFrame(null)
            if (finalInputRef.current) finalInputRef.current.value = ""
        }
    }

    const copyImageToClipboard = async (dataUrl: string, type: "initial" | "final") => {
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

    const handleMainAction = () => {
        if (initialFrame || finalFrame) {
            setShowWorkflowPopup(true)
        } else {
            copy(generatedPrompt)
        }
    }

    const handleReset = () => {
        setNiche("roofing")
        setNicheOther("")
        setCharacter("A man")
        setCharacterOther("")
        setSetting("soft-natural")
        setSettingOther("")
        setAction("talking-vlog")
        setActionOther("")
        setDialogue("")
        setAmbientSound("light-yard")
        setAmbientSoundOther("")
        setStyle("vlog")
        setStyleOther("")
        setRatio("HORIZONTAL")
        setGeneratedPrompt("")
        removeImage('initial')
        removeImage('final')
    }

    return (
        <div className="flex-1 w-full relative font-sans">
            <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 md:py-12">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="flex items-center gap-4 justify-center mb-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="size-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-xl relative group cursor-help transition-transform hover:scale-110">
                                        <MonitorPlay size={32} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Gerador de Criativos em Vídeo</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                Gerador de <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Takes</span>
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mt-1">AUDIOVISUAL & TRÁFEGO PAGO</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Estruture prompts de cenas perfeitas (takes) com copy e roteiro, ideais para gerar vídeos impressionantes para anúncios.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Formulário - 7 Colunas */}
                    <div className="lg:col-span-7 space-y-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden bg-card">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 relative border-b border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                        <Film size={28} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight leading-none uppercase">
                                            Roteiro do Take
                                        </CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground mt-1 font-bold italic tracking-wider uppercase">
                                            Cena, Ação & Falas
                                        </CardDescription>
                                    </div>
                                </div>

                                <div className="flex bg-muted p-1 rounded-xl shadow-inner border border-border">
                                    <button
                                        onClick={() => setMode("basic")}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                            mode === "basic" ? "bg-card text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Zap size={16} /> Básico
                                    </button>
                                    <button
                                        onClick={() => setMode("advanced")}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                            mode === "advanced" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Layout size={16} /> Avançado
                                    </button>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="p-6 md:p-8 space-y-8">
                                {/* Nicho & Estilo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Layout size={14} className="text-blue-500" /> Nicho
                                        </Label>
                                        <Select value={niche} onValueChange={setNiche}>
                                            <SelectTrigger className="bg-card h-12 border-2">
                                                <SelectValue placeholder="Selecione o nicho..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">Exterior</SelectLabel>
                                                    {TAKES_NICHES.filter(n => n.group === 'Exterior').map(n => (
                                                        <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                                                    ))}
                                                    <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2 mt-2">Interior</SelectLabel>
                                                    {TAKES_NICHES.filter(n => n.group === 'Interior').map(n => (
                                                        <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                                <SelectItem value="other" className="font-bold text-blue-600">Outro (Personalizado)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {niche === 'other' && (
                                            <Input placeholder="Qual o nicho?" value={nicheOther} onChange={e => setNicheOther(e.target.value)} className="mt-2" />
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Camera size={14} className="text-blue-500" /> Estilo de Vídeo
                                        </Label>
                                        {mode === 'basic' ? (
                                            <>
                                                <Select value={style} onValueChange={setStyle}>
                                                    <SelectTrigger className="bg-card h-14 border-2">
                                                        <SelectValue placeholder="Estilo visual" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TAKES_STYLES.map(s => (
                                                            <SelectItem key={s.id} value={s.id}>
                                                                <div className="flex flex-col py-0.5 text-left">
                                                                    <span className="font-bold">{s.label}</span>
                                                                    <span className="text-[10px] text-muted-foreground">{s.description}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                        <SelectItem value="other" className="font-bold text-blue-600">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {style === 'other' && (
                                                    <Input placeholder="Especifique o estilo do vídeo" value={styleOther} onChange={e => setStyleOther(e.target.value)} className="mt-2" />
                                                )}
                                            </>
                                        ) : (
                                            <Input placeholder="Descreva o estilo completo do seu take..." value={styleOther} onChange={e => setStyleOther(e.target.value)} className="h-14 border-2" />
                                        )}
                                    </div>
                                </div>

                                {/* Direção de Cena */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                                                <User size={14} className="text-blue-500" /> Personagem
                                            </Label>
                                            {mode === 'basic' ? (
                                                <>
                                                    <Select value={character} onValueChange={setCharacter}>
                                                        <SelectTrigger className="bg-card h-10 border-2">
                                                            <SelectValue placeholder="Selecione o personagem" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="A man">Homem (A man)</SelectItem>
                                                            <SelectItem value="A woman">Mulher (A woman)</SelectItem>
                                                            <SelectItem value="Hands">Mãos - Estilo POV (Hands working)</SelectItem>
                                                            <SelectItem value="None">Sem Personagem (Empty scene/No character)</SelectItem>
                                                            <SelectItem value="other" className="font-bold text-blue-600">Outro (Personalizado)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {character === 'other' && (
                                                        <Input 
                                                            value={characterOther} 
                                                            onChange={e => setCharacterOther(e.target.value)}
                                                            placeholder="Especifique o personagem"
                                                            className="border-2 mt-2"
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <Input 
                                                    value={characterOther} 
                                                    onChange={e => setCharacterOther(e.target.value)}
                                                    placeholder="Ex: A man in his 30s"
                                                    className="border-2"
                                                />
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                                                <Sun size={14} className="text-blue-500" /> Ambiente / Luz
                                            </Label>
                                            {mode === 'basic' ? (
                                                <>
                                                    <Select value={setting} onValueChange={setSetting}>
                                                        <SelectTrigger className="bg-card h-10 border-2">
                                                            <SelectValue placeholder="Selecione o ambiente" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TAKES_SETTINGS.map(s => (
                                                                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                                            ))}
                                                            <SelectItem value="other" className="font-bold text-blue-600">Outro (Personalizado)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {setting === 'other' && (
                                                        <Input 
                                                            value={settingOther} 
                                                            onChange={e => setSettingOther(e.target.value)}
                                                            placeholder="Descreva o ambiente e a iluminação"
                                                            className="border-2 mt-2"
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <Input 
                                                    value={settingOther} 
                                                    onChange={e => setSettingOther(e.target.value)}
                                                    placeholder="Descreva o ambiente e luz com suas palavras"
                                                    className="border-2"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Film size={14} className="text-blue-500" /> Ação (O que o personagem faz?)
                                        </Label>
                                        {mode === 'basic' ? (
                                            <>
                                                <Select value={action} onValueChange={setAction}>
                                                    <SelectTrigger className="bg-card h-10 border-2">
                                                        <SelectValue placeholder="Ação da Cena" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TAKES_ACTIONS.map(s => (
                                                            <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                                        ))}
                                                        <SelectItem value="other" className="font-bold text-blue-600">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {action === 'other' && (
                                                    <Textarea 
                                                        value={actionOther} 
                                                        onChange={e => setActionOther(e.target.value)}
                                                        placeholder="Descreva a ação detalhadamente..."
                                                        className="min-h-[60px] border-2 resize-none mt-2"
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <Textarea 
                                                value={actionOther} 
                                                onChange={e => setActionOther(e.target.value)}
                                                placeholder="Descreva a ação do take detalhadamente em inglês..."
                                                className="min-h-[80px] border-2 resize-none"
                                            />
                                        )}
                                    </div>
                                </div>

                                
                                <Separator />

                                {/* Áudio e Falas */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1 mb-2">
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Mic size={14} className="text-blue-500" /> Falas do Personagem (Copy)
                                            </Label>
                                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">⏱️ Copys curtas: 5 a 8s | Copys grandes: 10 a 15s+</span>
                                        </div>
                                        <Textarea 
                                            value={dialogue} 
                                            onChange={e => setDialogue(e.target.value)}
                                            className="min-h-[100px] border-2 font-medium text-lg leading-relaxed focus-visible:ring-blue-500"
                                            placeholder="Hey! If you need your roof fixed, look no further..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Som Ambiente</Label>
                                        {mode === 'basic' ? (
                                            <>
                                                <Select value={ambientSound} onValueChange={setAmbientSound}>
                                                    <SelectTrigger className="bg-card h-10 border-2">
                                                        <SelectValue placeholder="Som Ambiente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TAKES_SOUNDS.map(s => (
                                                            <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                                        ))}
                                                        <SelectItem value="other" className="font-bold text-blue-600">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {ambientSound === 'other' && (
                                                    <Input 
                                                        value={ambientSoundOther} 
                                                        onChange={e => setAmbientSoundOther(e.target.value)}
                                                        placeholder="Descreva o som ambiente em inglês..."
                                                        className="border-2 mt-2 text-sm"
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <Input 
                                                value={ambientSoundOther} 
                                                onChange={e => setAmbientSoundOther(e.target.value)}
                                                placeholder="Descreva de forma livre o som ambiente em inglês..."
                                                className="border-2 text-sm"
                                            />
                                        )}
                                    </div>
                                </div>

                                <Separator />
                                
                                {/* Proporção & Referências (Avançado) */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                                            <Maximize size={14} className="text-blue-500" /> Proporção (Aspect Ratio)
                                        </Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {TAKES_RATIOS.map(r => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => setRatio(r.id)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all relative",
                                                        ratio === r.id 
                                                            ? "border-blue-600 bg-blue-600/5 shadow-md shadow-blue-600/10" 
                                                            : "border-border/50 bg-background/30 hover:border-border"
                                                    )}
                                                >
                                                    <div className={cn("size-6 mb-1 text-muted-foreground", ratio === r.id && "text-blue-600")}>
                                                        {r.id.includes('HORIZONTAL') ? <Monitor size={20} /> : <Smartphone size={20} />}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{r.id}</span>
                                                    {ratio === r.id && <div className="absolute top-1 right-1"><CheckCircle size={10} className="text-blue-600" /></div>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                                                <ImageIcon size={14} className="text-blue-500" /> Imagens de Referência
                                            </Label>
                                            <p className="text-[10px] text-muted-foreground px-1 mb-2">Para guiar a IA, você pode enviar o primeiro frame e o último frame desejados (útil para Luma Dream Machine, Kling, Sora).</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Initial Frame */}
                                            <div
                                                onClick={() => initialInputRef.current?.click()}
                                                className="border-2 border-dashed border-border hover:border-blue-500/50 rounded-xl p-4 text-center cursor-pointer transition-all group min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden"
                                            >
                                                {initialFrame ? (
                                                    <>
                                                        <img src={initialFrame.previewUrl} alt="Initial" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                                        <Badge className="bg-blue-600 absolute top-2 left-2 text-[8px]">Início</Badge>
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeImage('initial') }} className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white shadow-lg z-10"><X size={12} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileImage size={24} className="mb-2 text-muted-foreground" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Frame Inicial</p>
                                                    </>
                                                )}
                                                <input ref={initialInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'initial')} />
                                            </div>

                                            {/* Final Frame */}
                                            <div
                                                onClick={() => finalInputRef.current?.click()}
                                                className="border-2 border-dashed border-border hover:border-blue-500/50 rounded-xl p-4 text-center cursor-pointer transition-all group min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden"
                                            >
                                                {finalFrame ? (
                                                    <>
                                                        <img src={finalFrame.previewUrl} alt="Final" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                                        <Badge className="bg-blue-600 absolute top-2 left-2 text-[8px]">Fim</Badge>
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeImage('final') }} className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white shadow-lg z-10"><X size={12} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileImage size={24} className="mb-2 text-muted-foreground" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Frame Final</p>
                                                    </>
                                                )}
                                                <input ref={finalInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'final')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/50 flex gap-4">
                                    <Button variant="outline" onClick={handleReset} className="h-14 px-6 rounded-2xl border-2 font-bold uppercase tracking-widest text-[10px]">
                                        <RefreshCcw size={16} className="mr-2" /> Limpar
                                    </Button>
                                    <Button 
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="flex-1 py-8 text-lg font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 transition-all rounded-2xl flex items-center justify-center gap-3 group"
                                    >
                                        {isGenerating ? <Layout className="animate-spin" /> : <MagicWand className="group-hover:rotate-12 transition-transform" />}
                                        Estruturar Cena
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resultado - 5 Colunas */}
                    <div className="lg:col-span-5 relative">
                        <Card className="rounded-[24px] border-border shadow-xl overflow-hidden sticky top-24 animate-fade-up" style={{ animationDelay: '200ms' }}>
                            <CardHeader className="px-6 py-5 bg-muted/50 relative border-none">
                                <Separator className="absolute bottom-0 left-0 right-0" />
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-widest">
                                        <TerminalWindow size={20} className="text-blue-600" />
                                        Resultado
                                    </CardTitle>
                                    <Badge className="bg-blue-600/20 text-blue-600 border-none font-black uppercase tracking-widest text-[9px] px-2 py-1">
                                        READY
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 min-h-[400px] flex flex-col">
                                {generatedPrompt ? (
                                    <>
                                        <Textarea 
                                            className="flex-1 bg-input border-2 border-border text-foreground font-mono text-[12px] p-5 leading-relaxed resize-none rounded-xl custom-scrollbar"
                                            readOnly
                                            value={generatedPrompt}
                                        />
                                        <div className="mt-6 flex flex-col gap-3">
                                            <Button 
                                                onClick={handleMainAction}
                                                className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl"
                                            >
                                                {(initialFrame || finalFrame) ? (
                                                    <><Layout size={18} className="mr-2" /> Workflow de Exportação</>
                                                ) : (
                                                    <>{isCopied ? <CheckCircle size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />} {isCopied ? "Copiado!" : "Copiar Prompt"}</>
                                                )}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-50 p-6 text-center w-full">
                                        <div className="size-20 border-4 border-dashed border-muted-foreground/20 rounded-3xl flex items-center justify-center animate-pulse">
                                            <Film size={40} className="text-blue-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-black uppercase tracking-widest italic">Aguardando Direção...</p>
                                            <p className="text-[10px] font-bold uppercase tracking-wider leading-none max-w-[200px] mx-auto text-center">Configure os parâmetros e clique em Estruturar Cena</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-8 animate-fade-up w-full col-span-full" style={{ animationDelay: '450ms' }}>
                    <GenerationHistory
                        history={history}
                        onRestore={handleRestore}
                        generatorName="gerador-takes"
                    />
                </div>

                <footer className="py-12 text-center border-t border-border mt-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
                    <div className="flex flex-col items-center gap-4">
                        <img src="/logo/TS-TOOLS-ALLWHITE.svg" alt="TS TOOLS" className="h-[25px] opacity-20 hover:opacity-50 transition-opacity grayscale" />
                        <p className="text-[11px] text-muted-foreground/60 font-semibold uppercase tracking-widest leading-none">
                            TS TOOLS &copy; {new Date().getFullYear()} &bull; CENTRAL DE FERRAMENTAS
                        </p>
                        <p className="text-[10px] text-muted-foreground/40 font-medium">
                            A solução definitiva para escalar operações de Home Services.
                        </p>
                        <a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="text-[9px] text-blue-600 hover:text-blue-500 font-bold uppercase tracking-widest mt-2 underline underline-offset-2">
                            ABRIR IA EXTERNA →
                        </a>
                    </div>
                </footer>
            </div>

            {/* Workflow Popup */}
            {showWorkflowPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowWorkflowPopup(false)} />
                    
                    <div className="relative w-full max-w-[1000px] max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col outline-none z-10 animate-in zoom-in-95 duration-200">
                        <div className="bg-blue-600 px-6 py-5 flex items-center justify-between shrink-0 border-b border-black/10">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-black/10 flex items-center justify-center">
                                    <MonitorPlay size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">
                                        Workflow AI Video
                                    </h2>
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-1">
                                        Siga os passos e cole diretamente no Luma/Runway/Kling
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white hover:bg-black/10 rounded-full h-10 w-10" 
                                onClick={() => setShowWorkflowPopup(false)}
                            >
                                <X size={24} />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 h-full min-h-[400px]">
                                {/* STEP 1: Prompt */}
                                <div className="p-8 flex flex-col gap-6 bg-zinc-950">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">1</div>
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
                                            copiedType === "prompt" ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700 text-white"
                                        )}
                                    >
                                        {copiedType === "prompt" ? <Check size={20} /> : <Copy size={20} />}
                                        <span>{copiedType === "prompt" ? "Prompt Copiado!" : "Copiar Prompt"}</span>
                                    </Button>
                                </div>

                                {/* STEP 2: Imagens */}
                                <div className="p-8 flex flex-col gap-6 bg-zinc-900/20">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">2</div>
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Frames de Referência</h3>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-6 justify-center">
                                        {initialFrame && (
                                            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                                                <img src={initialFrame.previewUrl} alt="Initial" className="size-16 rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white uppercase mb-1">Frame Inicial</p>
                                                    <Button 
                                                        size="sm"
                                                        onClick={() => copyImageToClipboard(initialFrame.previewUrl, "initial")}
                                                        className={cn("w-full text-[10px] font-bold uppercase h-8", copiedType === "initial" ? "bg-green-600" : "bg-zinc-800 hover:bg-zinc-700")}
                                                    >
                                                        {copiedType === "initial" ? "Copiado!" : "Copiar Imagem"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {finalFrame && (
                                            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                                                <img src={finalFrame.previewUrl} alt="Final" className="size-16 rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white uppercase mb-1">Frame Final</p>
                                                    <Button 
                                                        size="sm"
                                                        onClick={() => copyImageToClipboard(finalFrame.previewUrl, "final")}
                                                        className={cn("w-full text-[10px] font-bold uppercase h-8", copiedType === "final" ? "bg-green-600" : "bg-zinc-800 hover:bg-zinc-700")}
                                                    >
                                                        {copiedType === "final" ? "Copiado!" : "Copiar Imagem"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <FloatingHelpButton pageTitle="Gerador de Takes" />
        </div>
    )
}
