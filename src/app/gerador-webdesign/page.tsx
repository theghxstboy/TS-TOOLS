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
    Question,
    PaintBrush,
    Code
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
import { PRESETS_WEBDESIGN } from "@/constants/presets-webdesign"

function GeradorWebDesignContent() {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

    // States - Simple Mode
    const [pageType, setPageType] = useState("landing-page")
    const [niche, setNiche] = useState("construction")
    const [nicheOther, setNicheOther] = useState("")

    const [primaryColor, setPrimaryColor] = useState("#FF6B00")
    const [secondaryColor, setSecondaryColor] = useState("#1E1E1E")
    const [bgColor, setBgColor] = useState("#FAFAFA")
    const [textColor, setTextColor] = useState("#333333")

    const [fontFamily, setFontFamily] = useState("Inter")
    const [fontOther, setFontOther] = useState("")
    const [borderRadius, setBorderRadius] = useState("rounded-xl")

    const [copyTone, setCopyTone] = useState("dor")
    const [keyFeature, setKeyFeature] = useState("faq")

    // Global State
    const [productName, setProductName] = useState("")
    const [promise, setPromise] = useState("")

    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    // History Hook
    const { history, saveHistory } = useGenerationHistory("gerador-webdesign")
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

        setPageType(p.pageType || "landing-page")
        setNiche(p.niche || "construction")
        setNicheOther(p.nicheOther || "")

        setPrimaryColor(p.primaryColor || "#FF6B00")
        setSecondaryColor(p.secondaryColor || "#1E1E1E")
        setBgColor(p.bgColor || "#FAFAFA")
        setTextColor(p.textColor || "#333333")

        setFontFamily(p.fontFamily || "Inter")
        setFontOther(p.fontOther || "")
        setBorderRadius(p.borderRadius || "rounded-xl")

        setCopyTone(p.copyTone || "dor")
        setKeyFeature(p.keyFeature || "faq")

        setProductName(p.productName || "")
        setPromise(p.promise || "")

        setGeneratedPrompt(item.prompt || "")
        setSelectedPreset("")
    }

    const handlePresetClick = (id: string) => {
        setSelectedPreset(id);
        const preset = PRESETS_WEBDESIGN.find(p => p.id === id);
        if (preset) {
            setPageType(preset.data.pageType);
            setNiche(preset.data.niche);
            setPrimaryColor(preset.data.primaryColor);
            setSecondaryColor(preset.data.secondaryColor);
            setBgColor(preset.data.bgColor);
            setTextColor(preset.data.textColor);
            setFontFamily(preset.data.fontFamily);
            setBorderRadius(preset.data.borderRadius);
            setCopyTone(preset.data.copyTone);
            setKeyFeature(preset.data.keyFeature);
            setProductName(preset.data.productName);
            setPromise(preset.data.promise);

            // Clear other fields to keep it clean
            setNicheOther("");
            setFontOther("");
        }
    }

    const handleGenerate = () => {
        setIsGenerating(true)

        const finalNiche = niche === 'other' ? nicheOther : niche
        const finalFont = fontFamily === 'other' ? fontOther : fontFamily

        let promptTemplate = `Atue como um Engenheiro Front-end Sênior e Especialista em CRO (Otimização de Conversão).
Sua missão é desenvolver o código de uma ${pageType.replace('-', ' ')} de alta conversão (Mobile-First) focada no nicho de ${finalNiche} para tráfego pago. A arquitetura do código deve ser perfeitamente limpa para futura conversão para WordPress.

🧠 **REGRA DE OURO DE REFERÊNCIA VISUAL (IMPORTANTE)**
Se eu anexei imagens a este prompt, considere-as sua **fonte de verdade absoluta** para o design.
Sua prioridade deve ser:
1. Analisar visualmente as imagens para replicar a paleta de cores, a tipografia (ou equivalente Google Font), o espaçamento, o raio de borda, as animações implícitas e a estrutura visual geral.
2. Usar a técnica de OCR para extrair os textos das imagens e colocá-los nas posições correspondentes do código.

**SE EU NÃO ANEXEI IMAGENS**, use as configurações padrão definidas nas seções 🎨 1 e 📑 3 abaixo.

⚙️ **1. STACK TECNOLÓGICO OBRIGATÓRIO**
- Estrutura: HTML5 Semântico (\`<header>\`, \`<section>\`, \`<article>\`, \`<footer>\`).
- Estilização: Tailwind CSS via CDN. As classes devem usar as variáveis do Design System abaixo (ex: \`bg-primary\`, \`text-secondary\`).
- Interatividade: Apenas Vanilla JS (JavaScript puro). Sem React, Vue ou jQuery.

🎨 **2. DESIGN SYSTEM E IDENTIDADE VISUAL (FALLBACK - Use se não houver imagens)**
Configure o script do Tailwind no \`<head>\` para incluir as seguintes variáveis de estilo como padrão:
- Cor Primária: ${primaryColor}
- Cor Secundária: ${secondaryColor}
- Cor de Fundo Principal: ${bgColor}
- Cor do Texto Principal: ${textColor}
- Fonte Principal: ${finalFont} - via Google Fonts
- Estilo de Bordas (Border Radius): ${borderRadius}

📑 **3. ESTRUTURA DA PÁGINA E COPY (FALLBACK - Use se não houver imagens)**
O produto/serviço que estamos vendendo é: "${productName || '[INSERIR NOME DO PRODUTO/SERVIÇO]'}".
A promessa principal é: "${promise || '[INSERIR PROMESSA AQUI]'}"
O tom da copy deve ser focado em: ${copyTone}.

Utilize a seguinte estrutura de seções:
1. Hero: Fundo [Cor]. Headline forte focada na promessa principal. Subheadline explicando o mecanismo. Botão de CTA grande e pulsante.
2. Problematização/Transformação: 3 blocos mostrando as dores ou benefícios claros. Usar ícones SVG simples (Feather Icons ou Heroicons).
3. Solução/Benefícios: Z-pattern (texto/imagem alternados). Mostrar detalhes precisos sobre o serviço/produto.
4. Feature Chave Especial: Implemente obrigatoriamente um(a) ${keyFeature.replace('-', ' ')} com alto nível de design e interatividade fluida via Vanilla JS.
5. Prova Social: 3 cards de depoimentos de clientes satisfeitos com foto circular de perfil, nome e texto do depoimento focando no resultado obtido.
6. Oferta e Garantia: Destaque visual forte. Preço ancorado. Selo de garantia de satisfação em SVG. CTA final idêntico ao do Hero com micro-animações de hover.
7. Rodapé (Compliance Ads): Fundo neutro/escuro. Texto: "[NOME DA EMPRESA] - CNPJ: [00.000.000/0001-00]". Links discretos para "Termos de Uso" e "Políticas de Privacidade". Texto obrigatório de isenção de responsabilidade do Meta/Google.

🛠️ **4. REGRAS RIGOROSAS DE EXECUÇÃO**
1. Responsividade Absoluta: A página deve quebrar perfeitamente para 1 coluna no mobile (telas de 320px a 400px). Elementos clicáveis devem ter no mínimo 48px de altura.
2. Imagens: Use placeholders do 'placehold.co' com as dimensões exatas em pixels (ex: 800x600) para facilitar a substituição futura.
3. Entrega: Gere APENAS UM arquivo \`index.html\` completo. O CSS do Tailwind deve ser configurado no \`<script>\` do cabeçalho e o Vanilla JS deve ficar antes do fechamento da tag \`</body>\`. O código deve estar pronto para rodar com 2 cliques.`;

        setGeneratedPrompt(promptTemplate);

        setTimeout(() => {
            setIsGenerating(false)
            saveHistory({
                pageType,
                niche, nicheOther,
                primaryColor, secondaryColor, bgColor, textColor,
                fontFamily, fontOther, borderRadius,
                copyTone, keyFeature,
                productName, promise
            }, promptTemplate)
        }, 800)
    }

    const handleClear = () => {
        setPageType("landing-page")
        setNiche("construction")
        setNicheOther("")
        setPrimaryColor("#FF6B00")
        setSecondaryColor("#1E1E1E")
        setBgColor("#FAFAFA")
        setTextColor("#333333")
        setFontFamily("Inter")
        setFontOther("")
        setBorderRadius("rounded-xl")
        setCopyTone("dor")
        setKeyFeature("faq")
        setProductName("")
        setPromise("")
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    const handleCopy = async () => {
        if (!generatedPrompt) return
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(generatedPrompt)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            } else {
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
                    <Link href="/gerador" className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-secondary/80 transition-colors shadow-sm">
                        <ArrowLeft size={20} weight="bold" />
                        VOLTAR AO GERADOR DE IMAGENS
                    </Link>
                </div>

                {/* Header Content */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Web Design</span> Generator
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Estruture prompts de código de alta conversão para IAs (Lovable, v0, Antigravity) criarem LPs perfeitas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-gradient-to-tr from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg relative group">
                                <Code size={28} weight="bold" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                        Gerador <span className="text-blue-500">HTML</span>
                                    </h1>
                                </div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">FRONT-END PROMPT SYSTEM</p>
                            </div>
                        </div>

                        {/* Presets Gallery */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    Templates Prontos (Presets) <span className="text-blue-500 text-xl">↓</span>
                                </h2>
                                <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                    Preenche Auto
                                </span>
                            </div>

                            <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x snap-mandatory perspective-1000">
                                {PRESETS_WEBDESIGN.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handlePresetClick(preset.id)}
                                        className={cn(
                                            "relative w-[135px] h-[160px] shrink-0 rounded-xl overflow-hidden group text-left border-2 transition-all p-3 flex flex-col justify-end bg-input/50 snap-start",
                                            selectedPreset === preset.id ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] z-10 scale-[1.02]" : "border-transparent border hover:border-border/50"
                                        )}
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                            <PaintBrush size={32} weight="duotone" className="text-muted-foreground opacity-50" />
                                        </div>
                                        {/* Image placeholder for future mapping */}
                                        {preset.image && (
                                            <img
                                                src={preset.image}
                                                alt={preset.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-40 mix-blend-overlay"
                                            />
                                        )}
                                        <div className="absolute inset-[-1px] bg-gradient-to-t from-black/95 via-black/60 to-black/10 pointer-events-none" />

                                        <div className={cn(
                                            "absolute top-2 right-2 size-5 rounded-md border flex items-center justify-center transition-colors shadow-sm",
                                            selectedPreset === preset.id ? "bg-blue-500 border-blue-500 text-white" : "border-white/30 bg-black/40 backdrop-blur-sm"
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
                                <h2 className="text-xl font-bold text-foreground">Configurações Base</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="pageType" className="font-semibold text-foreground">Tipo de Projeto</Label>
                                        <Select value={pageType} onValueChange={setPageType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tipo..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="landing-page">Landing Page (Conversão Geral)</SelectItem>
                                                <SelectItem value="vsl">VSL (Página de Vídeo)</SelectItem>
                                                <SelectItem value="squeeze-page">Página de Captura (Squeeze/Lead Gen)</SelectItem>
                                                <SelectItem value="product-page">Página de Produto (E-commerce)</SelectItem>
                                                <SelectItem value="institucional">Institucional / Agência</SelectItem>
                                                <SelectItem value="bio-link">Link na Bio / Micro-page</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="niche" className="font-semibold text-foreground">Nicho / Mercado</Label>
                                        <Select value={niche} onValueChange={setNiche}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o nicho..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel className="bg-input uppercase text-xs font-bold text-muted-foreground tracking-wider">🇺🇸 Home Services (USA)</SelectLabel>
                                                    <SelectItem value="construction">Construction / Remodeling</SelectItem>
                                                    <SelectItem value="roofing">Roofing</SelectItem>
                                                    <SelectItem value="hvac">HVAC</SelectItem>
                                                    <SelectItem value="plumbing">Plumbing</SelectItem>
                                                    <SelectItem value="electrical">Electrical</SelectItem>
                                                    <SelectItem value="cleaning">Cleaning / Maid Services</SelectItem>
                                                    <SelectItem value="landscaping">Landscaping</SelectItem>
                                                </SelectGroup>
                                                <SelectGroup>
                                                    <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🌎 Outros Mercados</SelectLabel>
                                                    <SelectItem value="info-business">Infoprodutos / Mentorias</SelectItem>
                                                    <SelectItem value="health-beauty">Saúde, Estética e Beleza</SelectItem>
                                                    <SelectItem value="real-estate">Imóveis / Corretores</SelectItem>
                                                    <SelectItem value="b2b-saas">B2B / Software (SaaS)</SelectItem>
                                                    <SelectItem value="ecommerce">E-commerce / Físicos</SelectItem>
                                                    <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {niche === 'other' && (
                                            <Input placeholder="Especifique o nicho..." value={nicheOther} onChange={e => setNicheOther(e.target.value)} className="mt-2" />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="copyTone" className="font-semibold text-foreground">Tom da Copy Principal</Label>
                                        <Select value={copyTone} onValueChange={setCopyTone}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tom..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dor">Focado na Dor / Problematização forte</SelectItem>
                                                <SelectItem value="transformacao">Focado na Transformação / Desejos</SelectItem>
                                                <SelectItem value="autoridade">Alta Autoridade & Prova Social extrema</SelectItem>
                                                <SelectItem value="logico">Lógico & Direto ao Ponto (Custo-Benefício)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="keyFeature" className="font-semibold text-foreground">Feature de Conversão Chave</Label>
                                        <Select value={keyFeature} onValueChange={setKeyFeature}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a feature..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="faq">FAQ em Accordion Dinâmico</SelectItem>
                                                <SelectItem value="sticky-btn">Botão "Sticky" (Flutuante ao rolar)</SelectItem>
                                                <SelectItem value="countdown">Contador Regressivo (Escassez visual)</SelectItem>
                                                <SelectItem value="testimonials-carousel">Carrossel / Slider de Depoimentos</SelectItem>
                                                <SelectItem value="video-delay">Vídeo com Autoplay e Delay de Botão</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Colors - Advanced Pickers */}
                                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Cor Primária</Label>
                                            <div className="flex gap-2 items-center">
                                                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer bg-transparent" />
                                                <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="h-8 font-mono text-xs uppercase" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Secundária</Label>
                                            <div className="flex gap-2 items-center">
                                                <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer bg-transparent" />
                                                <Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="h-8 font-mono text-xs uppercase" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Fundo (BG)</Label>
                                            <div className="flex gap-2 items-center">
                                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer bg-transparent" />
                                                <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-8 font-mono text-xs uppercase" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Texto Main</Label>
                                            <div className="flex gap-2 items-center">
                                                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer bg-transparent" />
                                                <Input value={textColor} onChange={e => setTextColor(e.target.value)} className="h-8 font-mono text-xs uppercase" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label htmlFor="fontFamily" className="font-semibold text-foreground">Família de Fonte</Label>
                                        <Select value={fontFamily} onValueChange={setFontFamily}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a fonte..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Inter">Inter (Clean / Tech)</SelectItem>
                                                <SelectItem value="Poppins">Poppins (Redonda / Amigável)</SelectItem>
                                                <SelectItem value="Outfit">Outfit (Moderna / Elegante)</SelectItem>
                                                <SelectItem value="DM Sans">DM Sans (Geométrica / Limpa)</SelectItem>
                                                <SelectItem value="Playfair Display">Playfair Display (Serif / Luxo)</SelectItem>
                                                <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fontFamily === 'other' && (
                                            <Input placeholder="Nome da fonte no Google Fonts..." value={fontOther} onChange={e => setFontOther(e.target.value)} className="mt-2" />
                                        )}
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label htmlFor="borderRadius" className="font-semibold text-foreground">Estilo de Bordas</Label>
                                        <Select value={borderRadius} onValueChange={setBorderRadius}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione as bordas..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rounded-none">Reto / Quadrado (0px)</SelectItem>
                                                <SelectItem value="rounded-md">Curvatura Suave (md)</SelectItem>
                                                <SelectItem value="rounded-xl">Arredondado Padrão (xl)</SelectItem>
                                                <SelectItem value="rounded-2xl">Arredondado Intenso (2xl)</SelectItem>
                                                <SelectItem value="rounded-full">Em forma de pílula (full)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>

                                {/* Custom Copy Infos */}
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div className="space-y-2">
                                        <Label htmlFor="productName" className="font-semibold text-foreground">
                                            Nome do Produto / Serviço <span className="text-muted-foreground font-normal">(Opcional)</span>
                                        </Label>
                                        <Input
                                            id="productName"
                                            placeholder="Ex: Formação Expert em Resina Epóxi"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="promise" className="font-semibold text-foreground">
                                            Promessa Principal da Solução <span className="text-muted-foreground font-normal">(Opcional)</span>
                                        </Label>
                                        <Textarea
                                            id="promise"
                                            placeholder="Ex: Aprenda a faturar R$10k/mês aplicando pisos de resina com técnica americana exclusiva..."
                                            className="resize-none"
                                            rows={2}
                                            value={promise}
                                            onChange={(e) => setPromise(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">A IA preencherá automaticamente os textos baseada nessas informações e na imagem anexada.</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 pb-2">
                                    <Button
                                        onClick={handleGenerate}
                                        className={`w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all ${isGenerating ? 'bg-blue-600 opacity-90' : 'bg-blue-500 hover:bg-blue-600 hover:-translate-y-1'}`}
                                    >
                                        {isGenerating ? <CheckCircle size={24} weight="fill" className="mr-2" /> : <Code size={24} weight="bold" className="mr-2" />}
                                        {isGenerating ? 'Código Pronto!' : 'Gerar Prompt p/ Código'}
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
                                    <TerminalWindow size={24} className="text-blue-500" />
                                    Resultado do Prompt
                                </h2>
                            </div>

                            {/* ALERTA IMPORTANTE PARA IMAGEM */}
                            <div className="bg-blue-500/10 border-b border-blue-500/20 p-4 flex items-start gap-3">
                                <span className="text-2xl mt-0.5 animate-pulse">🖼️</span>
                                <div>
                                    <h3 className="text-blue-500 font-bold text-sm tracking-tight mb-1">Passo Fundamental</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                                        Para o resultado perfeito, <strong className="text-foreground">copie o prompt abaixo e anexe uma ou mais imagens de referência de design</strong> na sua IA favorita (Lovable, v0, etc). A IA irá "ler" a imagem OCR e replicar os estilos reais com seu texto.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 min-h-[300px] flex flex-col">
                                {generatedPrompt ? (
                                    <div className="flex-1 flex flex-col">
                                        <Textarea
                                            className="flex-1 bg-input border-none text-foreground placeholder:text-muted-foreground resize-none min-h-[200px] text-[13px] font-mono p-4 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-xl custom-scrollbar"
                                            readOnly
                                            value={generatedPrompt}
                                        />

                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <Button
                                                variant="secondary"
                                                onClick={handleClear}
                                                className="bg-input hover:bg-muted-foreground/20 text-muted-foreground border-none"
                                            >
                                                Limpar
                                            </Button>
                                            <Button
                                                onClick={handleCopy}
                                                className={`font-semibold shadow-md border-none ${isCopied ? 'bg-green-600 hover:bg-green-700 text-black' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                            >
                                                {isCopied ? <Check size={20} weight="bold" className="mr-2" /> : <Copy size={20} weight="bold" className="mr-2" />}
                                                {isCopied ? 'Copiado!' : 'Copiar p/ IA'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                                        <Code size={48} weight="duotone" className="text-blue-500 mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm">
                                            Selecione as cores da paleta, preencha os dados e clique em gerar para ver o prompt estruturado de código HTML/Tailwind.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section - Full Width */}
                <div className="mt-6">
                    <GenerationHistory
                        history={history}
                        onRestore={handleRestore}
                        generatorName="gerador-webdesign"
                    />
                </div>
            </div>

            <FloatingHelpButton pageTitle="Gerador Front-end" />
        </div >
    )
}

export default function GeradorWebDesignPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Carregando gerador...</div>}>
            <GeradorWebDesignContent />
        </Suspense>
    )
} 
