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
    Paintbrush as PaintBrush,
    Code2 as Code,
    Star,
    Bot as Robot,
    Zap as Lightning
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
import { PRESETS_WEBDESIGN } from "@/constants/presets-webdesign"

interface WebDesignPayload {
    mode: "simple" | "expert";
    pageType?: string;
    niche?: string;
    nicheOther?: string;
    primaryColor?: string;
    secondaryColor?: string;
    bgColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontOther?: string;
    borderRadius?: string;
    copyTone?: string;
    keyFeature?: string;
    productName?: string;
    promise?: string;
    conversionLink?: string;
    assetFiles?: string[];
    targetAI?: string;
}

function GeradorWebDesignContent() {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

    // States - Mode
    const [mode, setMode] = useState<"simple" | "expert">("simple")

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
    const [targetAI, setTargetAI] = useState("v0")

    // Global State
    const [productName, setProductName] = useState("")
    const [promise, setPromise] = useState("")

    const [conversionLink, setConversionLink] = useState("https://google.com")
    const [assetFiles, setAssetFiles] = useState<string[]>([])
    const [logoFile, setLogoFile] = useState<File | null>(null)

    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const { isCopied, copy } = useClipboard()

    // History & Favorites Hooks
    const { history, saveHistory } = useGenerationHistory<WebDesignPayload>("gerador-webdesign")
    const { isFavorited, toggleFavorite } = useFavorites()
    const searchParams = useSearchParams()

    // Handle Restore Effect
    useEffect(() => {
        const restoreId = searchParams.get('restore_id')
        if (restoreId && history.length > 0) {
            const itemToRestore = history.find((item: HistoryItem<WebDesignPayload>) => item.id === restoreId)
            if (itemToRestore) {
                handleRestore(itemToRestore)
            }
        }
    }, [searchParams, history])

    const handleRestore = (item: HistoryItem<WebDesignPayload>) => {
        const p = item.payload;
        if (!p) return;

        setMode(p.mode || "simple")
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
        setConversionLink(p.conversionLink || "https://google.com")
        setAssetFiles(p.assetFiles || [])
        setTargetAI(p.targetAI || "v0")

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

    const extractColors = (image: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorCounts: Record<string, number> = {};

        // Simple dominant color detection
        // Sampling every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 4];

            if (a < 128) continue; // Skip semi-transparent

            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

            // Skip whites and blacks (approximate)
            const sum = r + g + b;
            if (sum > 700 || sum < 50) continue;

            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

        if (sortedColors.length > 0) {
            setPrimaryColor(sortedColors[0][0]);
            if (sortedColors.length > 1) {
                setSecondaryColor(sortedColors[1][0]);
            }
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => extractColors(img);
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleAssetsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const names = Array.from(files).map(f => f.name);
        setAssetFiles(names);
    };

    const handleGenerate = () => {
        setIsGenerating(true)

        const finalNiche = niche === 'other' ? nicheOther : niche
        const finalFont = fontFamily === 'other' ? fontOther : fontFamily

        const assetsList = assetFiles.length > 0
            ? assetFiles.map(name => `- ${name}`).join('\n')
            : 'Nenhum arquivo anexado ainda.';

        let aiInstruction = "";
        if (targetAI === 'v0') {
            aiInstruction = "Otimize o código para o v0.dev. Use Shadcn UI (se disponível no ambiente) e garanta que o componente seja exportado corretamente.";
        } else if (targetAI === 'lovable') {
            aiInstruction = "Otimize para Lovable (GPT Engineer). Foque em uma estrutura modular pronta para edições rápidas e integração com Supabase se necessário.";
        } else if (targetAI === 'bolt') {
            aiInstruction = "Otimize para Bolt.new. Garanta que o projeto inclua todos os arquivos necessários para rodar instantaneamente via WebContainer.";
        } else if (targetAI === 'claude') {
            aiInstruction = "Otimize para o Claude (Artifacts). O código deve ser auto-contido e visualmente impressionante no frame lateral.";
        }

        let promptTemplate = `Atue como um Engenheiro Front-end Sênior e Especialista em CRO (Otimização de Conversão).
Sua missão é desenvolver o código de uma Landing Page de alta conversão (Mobile-First) focada em tráfego pago para o nicho de ${finalNiche}. A arquitetura do código deve ser perfeitamente limpa para futura conversão para WordPress.

${aiInstruction ? `🤖 **MODELO DE IA ALVO: ${targetAI.toUpperCase()}**\n${aiInstruction}\n` : ""}

🧠 **REGRA DE OURO DE REFERÊNCIA VISUAL**
Se eu anexei imagens/prints a este prompt, considere-as sua **fonte de verdade absoluta** para o design. Replique a paleta de cores, tipografia, espaçamento e estrutura visual, extraindo os textos via OCR para as posições corretas. Se não houver prints, use os padrões da seção 🎨 2 e 📑 3.

📂 **MODO AVANÇADO DE ASSETS (LEITURA DE ARQUIVOS ANEXADOS)**
Eu também anexei os arquivos de imagem que serão usados no projeto (ex: logotipos, fotos de fundo, mockups do produto). 
Lista de arquivos anexados:
${assetsList}

Sua tarefa OBRIGATÓRIA é:
1. Ler os **nomes reais dos arquivos** que eu anexei.
2. Fazer o mapeamento inteligente: deduzir pelo nome ou visual da imagem onde ela deve entrar (Logo, Hero, Depoimentos, etc.).
3. Usar esses nomes EXATOS nos atributos \`src\` das tags \`<img>\` ou em backgrounds.
- Exemplo: Se eu anexar um arquivo chamado \`minha-logo-oficial-v2.png\`, a tag no código deve ser exatamente \`<img src="./assets/images/minha-logo-oficial-v2.png" ...>\`.

🔗 **LINK DE CONVERSÃO (GLOBAL)**
- Link do Formulário/Checkout: ${conversionLink}
*Regra: Todos os botões de CTA da página devem ser tags \`<a>\` apontando exatamente (href) para este link.*

⚙️ **1. STACK TECNOLÓGICO OBRIGATÓRIO**
- Estrutura: HTML5 Semântico (\`<nav>\`, \`<header>\`, \`<section>\`, \`<article>\`, \`<footer>\`). 
- Estilização: Tailwind CSS via CDN.
- Interatividade: Apenas Vanilla JS (JavaScript puro). Sem React, Vue ou jQuery.

🎨 **2. DESIGN SYSTEM E IDENTIDADE VISUAL (FALLBACK)**
Se não houver print de referência, configure o script do Tailwind no \`<head>\` usando:
- Cor Primária: ${primaryColor} | Secundária: ${secondaryColor} | Fundo Principal: ${bgColor} | Texto Principal: ${textColor} | Fonte: ${finalFont} | Borda: ${borderRadius}

📑 **3. ESTRUTURA DA PÁGINA E COPY (FALLBACK)**
O produto/serviço: "${productName || '[NOME DO PRODUTO]'}"
Promessa: "${promise || '[PROMESSA]'}"

Utilize a seguinte estrutura de seções:
0. Navbar: Barra superior com a imagem do Logo alinhada à esquerda.
1. Hero: Fundo [Cor]. Headline forte: "[INSERIR HEADLINE]". Subheadline: "[INSERIR SUBHEADLINE]". Botão de CTA grande: "[TEXTO DO BOTÃO]".
2. Problematização: 3 blocos mostrando as dores: "[DOR 1]", "[DOR 2]", "[DOR 3]". Usar ícones SVG simples.
3. Solução/Benefícios: Z-pattern (texto/imagem alternados). 4 benefícios claros.
4. Prova Social: 3 cards de depoimentos com foto circular, nome e "[TEXTO DO DEPOIMENTO]".
5. Oferta e Garantia: Destaque visual forte. Preço ancorado. Selo de garantia em SVG. CTA final.
6. FAQ: Estrutura de 'Accordion' em Vanilla JS. Perguntas: "[PERGUNTA 1]", "[PERGUNTA 2]".
7. Rodapé: Fundo neutro/escuro. Texto: "[NOME DA EMPRESA] - CNPJ: [CNPJ]". Links para "Termos de Uso" e "Políticas de Privacidade". Texto de isenção do Meta/Google.

🛠️ **4. REGRAS RIGOROSAS DE EXECUÇÃO**
1. Responsividade Absoluta: A página deve quebrar perfeitamente para 1 coluna no mobile (telas de 320px).
2. Imagens e Nomenclatura (Atributo SRC): Utilize o "Modo Avançado de Assets" para preencher os \`src\`. Se faltar alguma imagem essencial para o layout que não foi anexada, defina um nome lógico para ela (ex: \`src="./assets/images/beneficio1.webp"\`) para que eu saiba como nomear o arquivo futuro.
3. Entrega do Código: Gere APENAS UM arquivo \`index.html\` completo. O CSS do Tailwind no \`<head>\` e o JS no final do \`<body>\`.
4. **CHECKLIST DE ASSETS (OBRIGATÓRIO):** Imediatamente após me entregar o bloco de código HTML, você DEVE gerar uma lista em Markdown confirmando:
   - Quais arquivos você leu dos meus anexos e injetou no código.
   - Quais imagens faltaram e quais nomes lógicos você gerou para elas no código.

---
🖼️ **MAPA LOGICO DE ASSETS PARA ESTE PROJETO:**
- LOGO: ${assetFiles.find(f => f.toLowerCase().includes('logo')) || 'logo.png'}
- HERO BG/IMAGE: ${assetFiles.find(f => f.toLowerCase().includes('hero')) || 'hero.webp'}
- BENEFICIO 1: ${assetFiles.find(f => f.toLowerCase().includes('beneficio1')) || 'beneficio1.webp'}
- BENEFICIO 2: ${assetFiles.find(f => f.toLowerCase().includes('beneficio2')) || 'beneficio2.webp'}
- BENEFICIO 3: ${assetFiles.find(f => f.toLowerCase().includes('beneficio3')) || 'beneficio3.webp'}
- BENEFICIO 4: ${assetFiles.find(f => f.toLowerCase().includes('beneficio4')) || 'beneficio4.webp'}
- DEPOIMENTO 1: ${assetFiles.find(f => f.toLowerCase().includes('user1')) || 'user1.jpg'}
- DEPOIMENTO 2: ${assetFiles.find(f => f.toLowerCase().includes('user2')) || 'user2.jpg'}
- DEPOIMENTO 3: ${assetFiles.find(f => f.toLowerCase().includes('user3')) || 'user3.jpg'}
- SELO GARANTIA: ${assetFiles.find(f => f.toLowerCase().includes('garantia')) || 'garantia.svg'}`;

        setGeneratedPrompt(promptTemplate);

        setTimeout(() => {
            setIsGenerating(false)
            saveHistory({
                pageType,
                niche, nicheOther,
                primaryColor, secondaryColor, bgColor, textColor,
                fontFamily, fontOther, borderRadius,
                copyTone, keyFeature,
                productName, promise,
                conversionLink, assetFiles,
                mode, targetAI
            }, promptTemplate)
        }, 800)
    }

    const handleClear = () => {
        setMode("simple")
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
        setConversionLink("https://google.com")
        setAssetFiles([])
        setLogoFile(null)
        setGeneratedPrompt("")
        setSelectedPreset("")
    }

    const handleCopy = () => copy(generatedPrompt)

    return (
        <div className="flex-1 w-full relative font-sans">
            <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 md:py-12">
                {/* Hero */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 justify-center mb-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-tr from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-lg relative group">
                            <Code size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                    Web Design <span className="text-blue-500">Generator</span>
                                </h1>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-left">FRONT-END PROMPT SYSTEM</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Estruture prompts de código de alta conversão para IAs (Lovable, v0, Bolt) criarem LPs <span className="text-foreground">perfeitas</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Inputs Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">


                        {/* Presets Gallery */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black tracking-tight leading-none uppercase flex items-center gap-2">
                                    Templates Prontos <span className="text-blue-500 text-xl">↓</span>
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
                                            <PaintBrush size={32} className="text-muted-foreground opacity-50" />
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Code size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black tracking-tight leading-none uppercase">Configuração Base</h2>
                                        <p className="text-xs text-muted-foreground mt-1 font-bold italic tracking-wider">ESTRUTURA & DESIGN SYSTEM</p>
                                    </div>
                                </div>

                                <div className="flex items-center bg-muted p-1 rounded-2xl">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", mode === 'simple' ? "bg-card text-blue-500 shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Modo Automático
                                    </button>
                                    <button
                                        onClick={() => setMode("expert")}
                                        className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", mode === 'expert' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Modo Expert
                                    </button>
                                </div>
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
                                        <Label htmlFor="targetAI" className="font-semibold text-foreground flex items-center gap-2">
                                            <Robot size={18} className="text-blue-500" />
                                            IA de Destino (Otimização)
                                        </Label>
                                        <Select value={targetAI} onValueChange={setTargetAI}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione a IA..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard">Padrão (Qualquer LLM)</SelectItem>
                                                <SelectItem value="v0">v0.dev (Shadcn/Vercel)</SelectItem>
                                                <SelectItem value="lovable">Lovable.dev (GPT Engineer)</SelectItem>
                                                <SelectItem value="bolt">Bolt.new (Full-stack)</SelectItem>
                                                <SelectItem value="claude">Claude Artifacts</SelectItem>
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

                                {mode === 'expert' && (
                                    <div className="space-y-6 pt-6 border-t border-border">
                                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                            <Sparkle size={20} className="text-blue-500" />
                                            Expert: Assets & Extração
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="font-semibold text-foreground">Escolher Logo (Extrair Cores)</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="cursor-pointer"
                                                />
                                                <p className="text-[10px] text-muted-foreground">Extrai automaticamente a paleta de cores da sua logo.</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-semibold text-foreground">Anexar Assets p/ Mapeamento (Imagens)</Label>
                                                <Input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleAssetsUpload}
                                                    className="cursor-pointer"
                                                />
                                                <p className="text-[10px] text-muted-foreground">
                                                    Arquivos lidos: {assetFiles.length > 0 ? assetFiles.join(", ") : "Nenhum arquivo lido."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="conversionLink" className="font-semibold text-foreground">Link de Conversão (Checkout/Form)</Label>
                                        <Input
                                            id="conversionLink"
                                            placeholder="https://google.com/forms/..."
                                            value={conversionLink}
                                            onChange={e => setConversionLink(e.target.value)}
                                        />
                                        <p className="text-[10px] text-muted-foreground">Todos os botões de CTA usarão este link.</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 pb-2">
                                    <Button
                                        onClick={handleGenerate}
                                        className="w-full py-8 text-lg font-bold uppercase tracking-[0.2em] rounded-2xl bg-blue-500 hover:bg-blue-600 text-white shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                                    >
                                        {isGenerating ? <CheckCircle size={28} /> : "Gerar Prompt de Código"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Column */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden sticky top-24 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/50">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <TerminalWindow size={24} className="text-blue-500" />
                                    Prompt Gerado
                                </h2>
                                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-500/20 text-blue-500">
                                    PRONTO PARA IA
                                </span>
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
                                                onClick={() => toggleFavorite("gerador-webdesign", {
                                                    pageType, niche, nicheOther, primaryColor, secondaryColor, bgColor, textColor, fontFamily, fontOther, borderRadius, copyTone, keyFeature, productName, promise, conversionLink, assetFiles, mode, targetAI
                                                }, generatedPrompt, `${productName || niche}`)}
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
                                        <Code size={48} className="text-blue-500 mb-4" />
                                        <p className="text-muted-foreground max-w-[250px] text-sm">
                                            Preencha os campos e clique em <strong>Gerar Prompt de Código</strong>.
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
