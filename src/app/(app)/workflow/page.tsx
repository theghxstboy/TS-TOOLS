"use client"

import { useState, useRef, useCallback, useEffect, Suspense } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Copy,
    Check,
    ImagePlus,
    X,
    Palette,
    MapPin,
    Briefcase,
    Upload,
    FileImage,
    Workflow as WorkflowIcon,
    Shield,
    MessageSquare,
    MousePointerClick,
    Info,
    Wand2,
    History,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGenerationHistory } from "@/hooks/useGenerationHistory"
import { GenerationHistory } from "@/components/GenerationHistory"
import { useSearchParams } from "next/navigation"
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
import { useClipboard } from "@/hooks/useClipboard"

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkflowPayload {
    service: string;
    serviceOther?: string;
    city?: string;
    state?: string;
    seals?: string[];
    customSeals?: string[];
    copyTone?: string;
    cta?: string;
    specificOffer?: string;
    photoDesc?: string;
    extraNotes?: string;
    primaryColor?: string;
    secondaryColor?: string;
    customColors?: string[];
    aspectRatio?: string;
    specificCopy?: string;
    sealOther?: string;
    copyToneOther?: string;
    ctaOther?: string;
    aspectRatioOther?: string;
    orientation?: string;
    orientationOther?: string;
    stateOther?: string;
    targetAge?: string;
    targetAgeOther?: string;
    targetGender?: string;
    targetGenderOther?: string;
    socioeconomicStatus?: string;
    socioeconomicStatusOther?: string;
    campaignContext?: string;
    campaignContextOther?: string;
    platform?: string;
    platformOther?: string;
    hasPhotos: boolean;
    hasLogo: boolean;
    hasReferencePhotos: boolean;
    hasSealFiles?: boolean;
}

interface UploadedFile {
    file: File
    previewUrl: string
    name: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEALS_OPTIONS = [
    { value: "none", label: "Nenhum Selo" },
    { value: "Licensed & Insured", label: "🛡️ Licensed & Insured" },
    { value: "5-Star Rated", label: "⭐ 5-Star Rated" },
    { value: "A+ BBB Rated", label: "🏆 A+ BBB Rated" },
    { value: "Free Estimate", label: "🎁 Free Estimate" },
    { value: "Satisfaction Guaranteed", label: "✅ Satisfaction Guaranteed" },
    { value: "Family Owned & Operated", label: "🏠 Family Owned & Operated" },
    { value: "Locally Owned & Operated", label: "📍 Locally Owned & Operated" },
    { value: "10+ Years Experience", label: "🔟 10+ Years Experience" },
    { value: "Veteran Owned", label: "🇺🇸 Veteran Owned" },
    { value: "100% Satisfaction Guarantee", label: "💯 100% Satisfaction Guarantee" },
    { value: "No Hidden Fees", label: "💰 No Hidden Fees" },
    { value: "Same Day Service", label: "⚡ Same Day Service" },
    { value: "Financing Available", label: "💳 Financing Available" },
    { value: "other", label: "Outro (Personalizado)" },
]

const COPY_TONE_OPTIONS = [
    { value: "none", label: "Sem tom específico" },
    { value: "Urgência / Escassez (oferta limitada, últimas vagas)", label: "🔥 Urgência / Escassez" },
    { value: "Prova Social (clientes satisfeitos, avaliações 5 estrelas)", label: "⭐ Prova Social" },
    { value: "Dor / Problema (destaca o problema que o cliente resolve)", label: "😤 Foco na Dor / Problema" },
    { value: "Transformação / Resultado antes e depois", label: "✨ Transformação / Antes & Depois" },
    { value: "Autoridade / Expertise (anos de experiência, especialistas certificados)", label: "🏆 Autoridade / Expertise" },
    { value: "Custo-Benefício / Economia (melhor preço, sem taxas escondidas)", label: "💰 Custo-Benefício" },
    { value: "Localidade / Comunidade (empresa local, atende sua região)", label: "📍 Local / Comunidade" },
    { value: "Garantia / Confiança (satisfação garantida, licenciado e segurado)", label: "🛡️ Garantia / Confiança" },
    { value: "other", label: "Outro (Personalizado)" },
]

const CTA_OPTIONS = [
    { value: "none", label: "Sem CTA específico" },
    { value: "Call Now — Free Estimate!", label: "📞 Call Now — Free Estimate!" },
    { value: "Get Your Free Quote Today!", label: "💬 Get Your Free Quote Today!" },
    { value: "Schedule Your Free Consultation!", label: "📅 Schedule Free Consultation!" },
    { value: "Book Online Now!", label: "🖥️ Book Online Now!" },
    { value: "Text Us For A Free Quote!", label: "📱 Text Us For A Free Quote!" },
    { value: "Call or Text Anytime!", label: "☎️ Call or Text Anytime!" },
    { value: "Limited Spots — Book Today!", label: "⚡ Limited Spots — Book Today!" },
    { value: "See Our Work — Call Now!", label: "👀 See Our Work — Call Now!" },
    { value: "Get Started Today!", label: "🚀 Get Started Today!" },
    { value: "Don't Wait — Call Now!", label: "⏰ Don't Wait — Call Now!" },
    { value: "other", label: "Outro (Personalizado)" },
]

const ASPECT_RATIO_OPTIONS = [
    { value: "none", label: "Não especificar (Livre)" },
    { value: "1:1", label: "Quadrado (1:1) - Feed" },
    { value: "4:5", label: "Vertical (4:5) - Feed Instagram" },
    { value: "9:16", label: "Tela Cheia (9:16) - Stories / Reels" },
    { value: "16:9", label: "Paisagem (16:9) - YouTube / TV" },
    { value: "other", label: "Outro (Personalizado)" },
]

const ORIENTATION_OPTIONS = [
    { value: "none", label: "Não especificar" },
    { value: "Texto à Esquerda (Left)", label: "⬅️ Texto à Esquerda (Left)" },
    { value: "Texto à Direita (Right)", label: "➡️ Texto à Direita (Right)" },
    { value: "Texto Centralizado (Centered)", label: "🎯 Texto Centralizado (Center)" },
    { value: "Layout Dividido (Split Screen)", label: "🌓 Layout Dividido (Split)" },
    { value: "other", label: "Outro (Personalizado)" },
]

const TARGET_AGE_OPTIONS = [
    { value: "none", label: "Não especificar (Amplo)" },
    { value: "Jovens (18-24)", label: "🎒 Jovens (18-24)" },
    { value: "Adultos Jovens (25-34)", label: "🚀 Adultos Jovens (25-34)" },
    { value: "Adultos (35-44)", label: "💼 Adultos (35-44)" },
    { value: "Seniores (45-54)", label: "🏡 Seniores (45-54)" },
    { value: "Idosos (55+)", label: "👴 Idosos (55+)" },
    { value: "other", label: "Outro (Personalizado)" },
]

const TARGET_GENDER_OPTIONS = [
    { value: "none", label: "Ambos os gêneros" },
    { value: "Feminino", label: "👩 Feminino" },
    { value: "Masculino", label: "👨 Masculino" },
    { value: "other", label: "Outro (Personalizado)" },
]

const SOCIOECONOMIC_OPTIONS = [
    { value: "none", label: "Não especificar" },
    { value: "Alto Padrão / Luxo", label: "💎 Alto Padrão / Luxo" },
    { value: "Médio-Alto", label: "🏠 Médio-Alto" },
    { value: "Classe Média", label: "🏘️ Classe Média" },
    { value: "Popular / Econômico / Acessível", label: "🏷️ Popular / Econômico" },
    { value: "other", label: "Outro (Personalizado)" },
]

const CAMPAIGN_CONTEXT_OPTIONS = [
    { value: "none", label: "Campanha Comum (Evergreen)" },
    { value: "Black Friday", label: "🖤 Black Friday" },
    { value: "Promoção de Verão (Summer)", label: "☀️ Promoção de Verão" },
    { value: "Promoção de Inverno (Winter)", label: "❄️ Promoção de Inverno" },
    { value: "Fim de Ano (Holiday Season)", label: "🎄 Fim de Ano (Holidays)" },
    { value: "Limpeza de Primavera (Spring Cleaning)", label: "🌸 Spring Cleaning" },
    { value: "other", label: "Outro (Personalizado)" },
]

const PLATFORM_OPTIONS = [
    { value: "none", label: "Múltiplas / Não especificar" },
    { value: "Meta (Facebook/Instagram)", label: "📱 Meta (FB/IG)" },
    { value: "Google Ads (Display/PMax)", label: "🔍 Google Ads" },
    { value: "TikTok", label: "🎵 TikTok" },
    { value: "YouTube", label: "📺 YouTube" },
    { value: "TV Local / Streaming", label: "📡 TV Local / Hulu" },
    { value: "other", label: "Outro (Personalizado)" },
]

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
    if (!ctx) return { primary: "#FF6B00", secondary: "#1E1E1E" }

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
        primary: sorted[0]?.[0] ?? "#FF6B00",
        secondary: sorted[1]?.[0] ?? "#1E1E1E",
    }
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function ImagePreviewGrid({ files, onRemove }: { files: UploadedFile[]; onRemove: (i: number) => void }) {
    if (files.length === 0) return null
    return (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
            {files.map((f, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-input">
                    <img src={f.previewUrl} alt={f.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => onRemove(i)} className="p-1.5 bg-red-500 rounded-full text-white">
                            <X size={12} />
                        </button>
                    </div>
                    <p className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] px-1 py-0.5 truncate">{f.name}</p>
                </div>
            ))}
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WorkflowPage() {
    return (
        <Suspense fallback={<div className="flex-1 p-8 rounded-2xl flex items-center justify-center min-h-[50vh] text-muted-foreground font-semibold">Carregando...</div>}>
            <WorkflowContent />
        </Suspense>
    )
}

function WorkflowContent() {
    // Dados do serviço
    const [service, setService] = useState("")
    const [serviceOther, setServiceOther] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")

    // Criativo
    const [seals, setSeals] = useState<string[]>([])
    const [sealOther, setSealOther] = useState("") // Deprecado em prol de customSeals, mantido fallback
    const [customSeals, setCustomSeals] = useState<string[]>([])
    const [newCustomSeal, setNewCustomSeal] = useState("")
    
    const [copyTone, setCopyTone] = useState("none")
    const [copyToneOther, setCopyToneOther] = useState("")
    const [cta, setCta] = useState("none")
    const [ctaOther, setCtaOther] = useState("")
    const [specificOffer, setSpecificOffer] = useState("")
    const [aspectRatio, setAspectRatio] = useState("none")
    const [aspectRatioOther, setAspectRatioOther] = useState("")
    const [orientation, setOrientation] = useState("none")
    const [orientationOther, setOrientationOther] = useState("")
    const [stateOther, setStateOther] = useState("")

    // Avançado
    const [isAdvancedMode, setIsAdvancedMode] = useState(false)
    const [specificCopy, setSpecificCopy] = useState("")
    const [referencePhotos, setReferencePhotos] = useState<UploadedFile[]>([])
    const [targetAge, setTargetAge] = useState("none")
    const [targetAgeOther, setTargetAgeOther] = useState("")
    const [targetGender, setTargetGender] = useState("none")
    const [targetGenderOther, setTargetGenderOther] = useState("")
    const [socioeconomicStatus, setSocioeconomicStatus] = useState("none")
    const [socioeconomicStatusOther, setSocioeconomicStatusOther] = useState("")
    const [campaignContext, setCampaignContext] = useState("none")
    const [campaignContextOther, setCampaignContextOther] = useState("")
    const [platform, setPlatform] = useState("none")
    const [platformOther, setPlatformOther] = useState("")

    // Fotos, logo e selos
    const [photos, setPhotos] = useState<UploadedFile[]>([])
    const [logoFile, setLogoFile] = useState<UploadedFile | null>(null)
    const [sealFiles, setSealFiles] = useState<UploadedFile[]>([])
    const [currentSealIndex, setCurrentSealIndex] = useState(0)
    const [photoDesc, setPhotoDesc] = useState("")
    const [extraNotes, setExtraNotes] = useState("")

    // Cores
    const [primaryColor, setPrimaryColor] = useState("#FF6B00")
    const [secondaryColor, setSecondaryColor] = useState("#1E1E1E")
    const [customColors, setCustomColors] = useState<string[]>([])
    const [newCustomColor, setNewCustomColor] = useState("#FFFFFF")
    const [colorsExtracted, setColorsExtracted] = useState(false)

    // Magic Fill
    const [showMagicFill, setShowMagicFill] = useState(false)
    const [magicFillText, setMagicFillText] = useState("")

    // Output
    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    // History Hook
    const { history, saveHistory } = useGenerationHistory<WorkflowPayload>("workflow")
    const searchParams = useSearchParams()

    useEffect(() => {
        const restoreId = searchParams.get('restore_id')
        if (restoreId && history.length > 0) {
            const itemToRestore = history.find(item => item.id === restoreId)
            if (itemToRestore) {
                handleRestore(itemToRestore)
            }
        }
    }, [searchParams, history])

    const handleRestore = (item: any) => {
        const p = item.payload as WorkflowPayload
        if (!p) return

        setService(p.service || "")
        setServiceOther(p.serviceOther || "")
        setCity(p.city || "")
        setState(p.state || "")
        setSeals(p.seals || [])
        setCopyTone(p.copyTone || "none")
        setCta(p.cta || "none")
        setAspectRatio(p.aspectRatio || "none")
        setSealOther(p.sealOther || "")
        setCopyToneOther(p.copyToneOther || "")
        setCtaOther(p.ctaOther || "")
        setAspectRatioOther(p.aspectRatioOther || "")
        setOrientation(p.orientation || "none")
        setOrientationOther(p.orientationOther || "")
        setStateOther(p.stateOther || "")
        setSpecificCopy(p.specificCopy || "")
        setCustomSeals(p.customSeals || [])
        setSpecificOffer(p.specificOffer || "")
        setCustomColors(p.customColors || [])
        setTargetAge(p.targetAge || "none")
        setTargetAgeOther(p.targetAgeOther || "")
        setTargetGender(p.targetGender || "none")
        setTargetGenderOther(p.targetGenderOther || "")
        setSocioeconomicStatus(p.socioeconomicStatus || "none")
        setSocioeconomicStatusOther(p.socioeconomicStatusOther || "")
        setCampaignContext(p.campaignContext || "none")
        setCampaignContextOther(p.campaignContextOther || "")
        setPlatform(p.platform || "none")
        setPlatformOther(p.platformOther || "")
        // If we restore a payload with advanced configurations, auto-enable advanced mode
        if (p.specificCopy || p.hasReferencePhotos || p.targetAge !== "none" || p.targetGender !== "none" || p.campaignContext !== "none" || p.platform !== "none" || p.socioeconomicStatus !== "none") {
            setIsAdvancedMode(true)
        }
        setPhotoDesc(p.photoDesc || "")
        setExtraNotes(p.extraNotes || "")
        setPrimaryColor(p.primaryColor || "#FF6B00")
        setSecondaryColor(p.secondaryColor || "#1E1E1E")
        setGeneratedPrompt(item.prompt || "")
        
        // Note: Files (photos/logo) cannot be easily restored from localStorage
        // but we keep the text data.
    }

    // Popup de imagens
    const [showImagePopup, setShowImagePopup] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [currentRefIndex, setCurrentRefIndex] = useState(0)
    const [copiedType, setCopiedType] = useState<"prompt" | "photo" | "logo" | "ref" | "seal" | null>(null)

    const allImages = [
        ...(logoFile ? [{ ...logoFile, type: "Logo" }] : []),
        ...photos.map((p, i) => ({ ...p, type: `Foto ${i + 1}` })),
        ...sealFiles.map((p, i) => ({ ...p, type: `Selo ${i + 1}` })),
        ...(isAdvancedMode ? referencePhotos.map((p, i) => ({ ...p, type: `Ref ${i + 1}` })) : [])
    ]

    const { isCopied, copy } = useClipboard()
    const photoInputRef = useRef<HTMLInputElement>(null)
    const logoInputRef = useRef<HTMLInputElement>(null)
    const sealFileInputRef = useRef<HTMLInputElement>(null)

    const finalService = service === "other" ? serviceOther : service
    const isReady = !!finalService

    // ── Handlers ───────────────────────────────────────────────────────────────

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

    const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const newFiles: UploadedFile[] = await Promise.all(
            Array.from(files).map(async (file) => ({ file, previewUrl: await toBase64(file), name: file.name }))
        )
        setPhotos((prev) => [...prev, ...newFiles])
    }

    const handleSealsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const newFiles: UploadedFile[] = await Promise.all(
            Array.from(files).map(async (file) => ({ file, previewUrl: await toBase64(file), name: file.name }))
        )
        setSealFiles((prev) => [...prev, ...newFiles])
    }

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
        if (!files.length) return
        const newFiles: UploadedFile[] = await Promise.all(
            files.map(async (file) => ({ file, previewUrl: await toBase64(file), name: file.name }))
        )
        setPhotos((prev) => [...prev, ...newFiles])
    }, [])

    const removeLogo = () => {
        setLogoFile(null)
        setColorsExtracted(false)
        if (logoInputRef.current) logoInputRef.current.value = ""
    }

    const copyImageToClipboard = async (dataUrl: string, type: "photo" | "logo" | "ref" | "seal") => {
        try {
            // Criar imagem temporária para desenhar no Canvas (resolve suporte a JPEG)
            const img = new Image()
            img.src = dataUrl
            await new Promise((resolve) => (img.onload = resolve))

            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            if (!ctx) return
            ctx.drawImage(img, 0, 0)

            // Converter para PNG (formato universalmente aceito no clipboard)
            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob((b) => resolve(b), "image/png")
            )
            if (!blob) return

            const item = new ClipboardItem({ "image/png": blob })
            await navigator.clipboard.write([item])
            
            setCopiedType(type)
            setTimeout(() => setCopiedType(null), 2000)

            // Avançar para a próxima imagem automaticamente se for galeria
            if (type === "photo" && photos.length > 1) {
                setTimeout(() => {
                    setCurrentImageIndex((prev) => (prev + 1) % photos.length)
                }, 800)
            } else if (type === "ref" && referencePhotos.length > 1) {
                setTimeout(() => {
                    setCurrentRefIndex((prev) => (prev + 1) % referencePhotos.length)
                }, 800)
            } else if (type === "seal" && sealFiles.length > 1) {
                setTimeout(() => {
                    setCurrentSealIndex((prev) => (prev + 1) % sealFiles.length)
                }, 800)
            }
        } catch (err) {
            console.error("Erro ao copiar imagem:", err)
        }
    }

    const handleCopyPrompt = () => {
        copy(generatedPrompt)
        setShowImagePopup(true)
        setCurrentImageIndex(0)
    }

    // ── Magic Fill ─────────────────────────────────────────────────────────────

    const handleMagicFill = () => {
        if (!magicFillText.trim()) return

        const lines = magicFillText.split("\n")
        const data: Record<string, string> = {}
        let currentKey = ""
        let currentBlock = ""

        const keys = [
            "SERVIÇO", "CIDADE", "ESTADO", "SELOS", "TOM", "CTA", "PREÇO",
            "FORMATO", "LAYOUT", "FAIXA_ETARIA", "GENERO", "NIVEL_SOCIAL",
            "SAZONALIDADE", "PLATAFORMA", "COPY", "OBSERVACOES"
        ]

        lines.forEach(line => {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith("═══")) return

            const foundKey = keys.find(k => trimmed.startsWith(`${k}:`))
            if (foundKey) {
                if (currentKey === "COPY" || currentKey === "OBSERVACOES") {
                    data[currentKey] = currentBlock.trim()
                }
                currentKey = foundKey
                currentBlock = trimmed.substring(foundKey.length + 1).trim()
                if (currentKey !== "COPY" && currentKey !== "OBSERVACOES") {
                    data[currentKey] = currentBlock
                }
            } else if (currentKey) {
                currentBlock += "\n" + line
            }
        })
        if (currentKey === "COPY" || currentKey === "OBSERVACOES") {
            data[currentKey] = currentBlock.trim()
        }

        // Apply preenchimento
        if (data["SERVIÇO"]) {
            const val = data["SERVIÇO"].trim()
            // Tenta encontrar nos selects
            const options = [
                "Construction / Remodeling", "Carpentry", "Framing", "Additions",
                "Painting", "Roofing", "Siding", "Insulation", "Countertops",
                "Hardwood Flooring", "Luxury Vinyl Plank (LVP)", "Laminate Flooring",
                "Sand & Refinish", "Epoxy Flooring", "Tile & Stone",
                "Landscaping", "Cleaning / Maid Services", "HVAC", "Plumbing", "Electrical"
            ]
            if (options.some(o => val.toLowerCase().includes(o.toLowerCase()))) {
                const matched = options.find(o => val.toLowerCase().includes(o.toLowerCase()))
                setService(matched || "")
            } else {
                setService("other")
                setServiceOther(val)
            }
        }

        if (data["CIDADE"]) setCity(data["CIDADE"].trim())
        
        if (data["ESTADO"]) {
            const val = data["ESTADO"].trim()
            // Tenta dar match no label "Florida (FL)"
            const stateMatch = val.match(/\((.*?)\)/)
            const code = stateMatch ? stateMatch[1] : val
            
            const states = [["FL","Florida"],["TX","Texas"],["CA","California"],["NY","New York"],["GA","Georgia"],["NC","North Carolina"],["AZ","Arizona"],["NV","Nevada"],["OH","Ohio"],["IL","Illinois"],["PA","Pennsylvania"],["WA","Washington"],["CO","Colorado"],["MA","Massachusetts"],["NJ","New Jersey"],["VA","Virginia"],["TN","Tennessee"],["SC","South Carolina"],["MN","Minnesota"],["MO","Missouri"]]
            const found = states.find(s => s[0] === code || val.includes(s[1]))
            if (found) {
                setState(`${found[1]} (${found[0]})`)
            } else {
                setState("other")
                setStateOther(val)
            }
        }

        if (data["SELOS"]) {
            const parts = data["SELOS"].split("|").map(s => s.trim())
            const newSeals: string[] = []
            const newCustoms: string[] = []
            
            parts.forEach(p => {
                const found = SEALS_OPTIONS.find(o => p.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === p)
                if (found && found.value !== "other" && found.value !== "none") {
                    newSeals.push(found.value)
                } else {
                    newCustoms.push(p)
                }
            })
            setSeals(newSeals)
            setCustomSeals(newCustoms)
        }

        if (data["TOM"]) {
            const val = data["TOM"].trim()
            const found = COPY_TONE_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setCopyTone(found.value)
            else {
                setCopyTone("other")
                setCopyToneOther(val)
            }
        }

        if (data["CTA"]) {
            const val = data["CTA"].trim()
            const found = CTA_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setCta(found.value)
            else {
                setCta("other")
                setCtaOther(val)
            }
        }

        if (data["PREÇO"]) setSpecificOffer(data["PREÇO"].trim())

        if (data["FORMATO"]) {
            const val = data["FORMATO"].trim()
            const found = ASPECT_RATIO_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val || val.includes(o.value))
            if (found) setAspectRatio(found.value)
            else {
                setAspectRatio("other")
                setAspectRatioOther(val)
            }
        }

        if (data["LAYOUT"]) {
            const val = data["LAYOUT"].trim()
            const found = ORIENTATION_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setOrientation(found.value)
            else {
                setOrientation("other")
                setOrientationOther(val)
            }
        }

        // Avançados
        let hasAdvanced = false
        if (data["FAIXA_ETARIA"]) {
            const val = data["FAIXA_ETARIA"].trim()
            const found = TARGET_AGE_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setTargetAge(found.value)
            else {
                setTargetAge("other")
                setTargetAgeOther(val)
            }
            hasAdvanced = true
        }

        if (data["GENERO"]) {
            const val = data["GENERO"].trim()
            const found = TARGET_GENDER_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setTargetGender(found.value)
            else {
                setTargetGender("other")
                setTargetGenderOther(val)
            }
            hasAdvanced = true
        }

        if (data["NIVEL_SOCIAL"]) {
            const val = data["NIVEL_SOCIAL"].trim()
            const found = SOCIOECONOMIC_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setSocioeconomicStatus(found.value)
            else {
                setSocioeconomicStatus("other")
                setSocioeconomicStatusOther(val)
            }
            hasAdvanced = true
        }

        if (data["SAZONALIDADE"]) {
            const val = data["SAZONALIDADE"].trim()
            const found = CAMPAIGN_CONTEXT_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setCampaignContext(found.value)
            else {
                setCampaignContext("other")
                setCampaignContextOther(val)
            }
            hasAdvanced = true
        }

        if (data["PLATAFORMA"]) {
            const val = data["PLATAFORMA"].trim()
            const found = PLATFORM_OPTIONS.find(o => val.toLowerCase().includes(o.label.toLowerCase().replace(/.*?\s/, "")) || o.value === val)
            if (found) setPlatform(found.value)
            else {
                setPlatform("other")
                setPlatformOther(val)
            }
            hasAdvanced = true
        }

        if (data["COPY"]) {
            setSpecificCopy(data["COPY"].trim())
            hasAdvanced = true
        }

        if (data["OBSERVACOES"]) setExtraNotes(data["OBSERVACOES"].trim())

        if (hasAdvanced) setIsAdvancedMode(true)
        setShowMagicFill(false)
        setMagicFillText("")
    }

    const handleResetForm = () => {
        setService("")
        setServiceOther("")
        setCity("")
        setState("")
        setSeals([])
        setSealOther("")
        setCustomSeals([])
        setCopyTone("none")
        setCopyToneOther("")
        setCta("none")
        setCtaOther("")
        setSpecificOffer("")
        setAspectRatio("none")
        setAspectRatioOther("")
        setOrientation("none")
        setOrientationOther("")
        setStateOther("")
        setSpecificCopy("")
        setTargetAge("none")
        setTargetAgeOther("")
        setTargetGender("none")
        setTargetGenderOther("")
        setSocioeconomicStatus("none")
        setSocioeconomicStatusOther("")
        setCampaignContext("none")
        setCampaignContextOther("")
        setPlatform("none")
        setPlatformOther("")
        setPhotos([])
        setLogoFile(null)
        setSealFiles([])
        setPhotoDesc("")
        setExtraNotes("")
        setPrimaryColor("#FF6B00")
        setSecondaryColor("#1E1E1E")
        setCustomColors([])
        setColorsExtracted(false)
        setIsAdvancedMode(false)
        setGeneratedPrompt("")
        setCurrentSealIndex(0)
        setCurrentRefIndex(0)
        setCurrentImageIndex(0)
    }

    // ── Gerar Prompt ───────────────────────────────────────────────────────────

    const handleGenerate = () => {
        setIsGenerating(true)
        const location = [city, state].filter(Boolean).join(", ") || "Localização não especificada"
        const logoInfo = logoFile ? logoFile.name : "Não fornecida"

        const extraColorsSection = customColors.length > 0 ? `\n• Cores Adicionais (Paleta Extra): ${customColors.join(", ")}` : ""
        const colorSection = `🎨 PALETA DE CORES${colorsExtracted ? " (extraída da logo automaticamente)" : ""}:
• Primária: ${primaryColor}  |  Secundária: ${secondaryColor}${extraColorsSection}
→ Use essas cores exatas nos elementos de marca, botões e destaques do criativo.`

        const finalCopyTone = copyTone === "other" ? copyToneOther : copyTone
        const finalCta = cta === "other" ? ctaOther : cta
        const finalAspectRatio = aspectRatio === "other" ? aspectRatioOther : aspectRatio
        const finalOrientation = orientation === "other" ? orientationOther : orientation
        const finalState = state === "other" ? stateOther : state
        const finalTargetAge = targetAge === "other" ? targetAgeOther : targetAge
        const finalTargetGender = targetGender === "other" ? targetGenderOther : targetGender
        const finalSocioeconomicStatus = socioeconomicStatus === "other" ? socioeconomicStatusOther : socioeconomicStatus
        const finalCampaignContext = campaignContext === "other" ? campaignContextOther : campaignContext
        const finalPlatform = platform === "other" ? platformOther : platform

        const predefinedSeals = seals.filter(s => s !== "none" && s !== "other");
        const activeSeals = [...predefinedSeals, ...customSeals].filter(Boolean);

        const sealImagesSection = sealFiles.length > 0 
            ? `\n🛡️ IMAGENS DE SELOS PERSONALIZADOS:\n${sealFiles.map((p, i) => `  • Selo ${i + 1}: ${p.name}`).join("\n")}` : ""

        const sealSection = activeSeals.length > 0 ? `\n🛡️ SELO(S) DE CREDIBILIDADE (TEXTO):\n→ Incluir destaque visual com: ${activeSeals.map(s => `"${s}"`).join(", ")}` : ""
        
        let copySection = ""
        if (specificCopy && isAdvancedMode) {
            copySection = `\n✍️ COPY EXATA (APLICAR EXATAMENTE ESTE TEXTO):\n"${specificCopy}"`
        } else if (finalCopyTone !== "none" && finalCopyTone !== "") {
            copySection = `\n✍️ TOM DA COPY:\n→ ${finalCopyTone}`
        }

        const ctaSection = finalCta !== "none" && finalCta !== "" ? `\n🖱️ BOTÃO CTA:\n→ Texto do botão: "${finalCta}"` : ""
        const aspectRatioSection = finalAspectRatio !== "none" && finalAspectRatio !== "" ? `\n📐 PROPORÇÃO/FORMATO:\n→ O criativo deve seguir a proporção ${finalAspectRatio} exata.` : ""
        const orientationSection = finalOrientation !== "none" && finalOrientation !== "" ? `\n🧭 LAYOUT/ALINHAMENTO:\n→ Os elementos/textos devem estar posicionados: ${finalOrientation}.` : ""

        const photosSection = photos.length > 0
            ? photos.map((p, i) => `  • Foto ${i + 1}: ${p.name}`).join("\n")
            : "  • Nenhuma foto anexada"

        const refPhotosSection = referencePhotos.length > 0 && isAdvancedMode
            ? `\n🖼️ FOTOS DE REFERÊNCIA/INSPIRAÇÃO:\n${referencePhotos.map((p, i) => `  • Ref ${i + 1}: ${p.name}`).join("\n")}\n  ⚠️ (Use estas imagens APENAS como estilo de inspiração, NÃO AS INSIRA DIRETAMENTE NO CRIATIVO)`
            : ""

        const prompt = `🔧 WORKFLOW CRIATIVO — HOME SERVICES USA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 BRIEFING DO CLIENTE:
• Serviço: ${finalService}
• Região: ${location}${isAdvancedMode && finalTargetAge !== "none" ? `\n• Faixa Etária Alvo: ${finalTargetAge}` : ""}${isAdvancedMode && finalTargetGender !== "none" ? `\n• Gênero Alvo: ${finalTargetGender}` : ""}${isAdvancedMode && finalSocioeconomicStatus !== "none" ? `\n• Nível Socioeconômico: ${finalSocioeconomicStatus}` : ""}${isAdvancedMode && finalCampaignContext !== "none" ? `\n• Contexto/Sazonalidade: ${finalCampaignContext}` : ""}${isAdvancedMode && finalPlatform !== "none" ? `\n• Plataforma Destino: ${finalPlatform}` : ""}${specificOffer ? `\n• OFERTA / PREÇO: ${specificOffer}` : ""}

📸 FOTOS DO CLIENTE:
${photosSection}${photoDesc ? `\n  📝 Descrição: "${photoDesc}"` : ""}${refPhotosSection}

🏷️ LOGO DO CLIENTE: ${logoInfo}

${colorSection}
${sealImagesSection}
${sealSection}${copySection}${ctaSection}${aspectRatioSection}${orientationSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ SUA MISSÃO — CRIATIVO DE ALTA CONVERSÃO:

Analise as fotos e a logo do cliente e crie um criativo profissional para tráfego pago seguindo TODAS estas diretrizes:

1. VISUAL:
   → Use as fotos enviadas como base do criativo (antes/depois se possível)
   → Aplique a paleta "${primaryColor}" (primária) e "${secondaryColor}" (secundária)
   → Mantenha a identidade visual da logo em todo o layout

2. COPY:${copyTone !== "none" ? `
   → Tom: ${copyTone}` : `
   → Tom: Profissional, confiável e orientado a resultados`}
   → Destaque o serviço de ${finalService} na região de ${location}
   → Headline poderosa que conecta com o problema do cliente

3. ELEMENTOS VISUAIS:
   → ⚠️ IMPORTANTE: NÃO ALTERE NADA NA LOGO FORNECIDA. Mantenha a integridade total da marca e cores.${activeSeals.length > 0 ? `
   → Incluir selos: ${activeSeals.map(s => `"${s}"`).join(", ")} em posição de destaque` : ""}${finalCta !== "none" && finalCta !== "" ? `
   → Botão CTA com texto: "${finalCta}"` : `
   → CTA forte e visível`}
   → Layout Mobile-First (maioria vê em celular)
${extraNotes ? `\n📋 OBSERVAÇÕES DO CLIENTE:\n"${extraNotes}"\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ATENÇÃO: As fotos e logo estão ANEXADAS e serão enviadas agora. Use-as como referência visual obrigatória.`

        setGeneratedPrompt(prompt)
        setTimeout(() => {
            setIsGenerating(false)
            saveHistory({
                service,
                serviceOther,
                city,
                state,
                seals,
                customSeals,
                copyTone,
                cta,
                specificOffer,
                aspectRatio,
                orientation,
                sealOther,
                copyToneOther,
                ctaOther,
                aspectRatioOther,
                orientationOther,
                stateOther,
                specificCopy: isAdvancedMode ? specificCopy : undefined,
                targetAge: isAdvancedMode ? targetAge : undefined,
                targetAgeOther,
                targetGender: isAdvancedMode ? targetGender : undefined,
                targetGenderOther,
                socioeconomicStatus: isAdvancedMode ? socioeconomicStatus : undefined,
                socioeconomicStatusOther,
                campaignContext: isAdvancedMode ? campaignContext : undefined,
                campaignContextOther,
                platform: isAdvancedMode ? platform : undefined,
                platformOther,
                photoDesc,
                extraNotes,
                primaryColor,
                secondaryColor,
                customColors,
                hasPhotos: photos.length > 0,
                hasReferencePhotos: isAdvancedMode ? referencePhotos.length > 0 : false,
                hasLogo: !!logoFile,
                hasSealFiles: sealFiles.length > 0
            }, prompt)
        }, 700)
    }

    // Handlers adicionais do avançado
    const handleRefPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const newFiles: UploadedFile[] = await Promise.all(
            Array.from(files).map(async (file) => ({ file, previewUrl: await toBase64(file), name: file.name }))
        )
        setReferencePhotos((prev) => [...prev, ...newFiles])
    }

    const refPhotoInputRef = useRef<HTMLInputElement>(null)

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="flex-1 w-full font-sans">
            <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">

                {/* Header */}
                <div className="text-center mb-12 animate-fade-up">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
                        <WorkflowIcon size={14} /> Workflow Generator
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Crie o{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-400">
                            Prompt Perfeito
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                        Preencha o briefing completo e gere um prompt estruturado + imagens prontas para colar na IA.
                    </p>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => setShowMagicFill(true)}
                            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-white/10 cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Wand2 size={20} className="group-hover:rotate-12 transition-transform duration-300" /> 
                            Prompt Mágico
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ── Coluna Esquerda: Formulário ── */}
                    <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '80ms' }}>

                        {/* Card 1: Serviço & Região */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">Dados do Serviço</h2>
                                    <p className="text-xs text-muted-foreground">Serviço principal e localização do cliente</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Serviço */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="font-semibold text-foreground">
                                        Serviço Principal <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={service} onValueChange={setService}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Selecione o serviço..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className="bg-input uppercase text-xs font-bold text-muted-foreground tracking-wider">🏗️ Construção & Reformas</SelectLabel>
                                                <SelectItem value="Construction / Remodeling">Construction / Remodeling</SelectItem>
                                                <SelectItem value="Carpentry">Carpentry (Marcenaria)</SelectItem>
                                                <SelectItem value="Framing">Framing (Estrutura)</SelectItem>
                                                <SelectItem value="Additions">Additions (Ampliações)</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🎨 Acabamentos</SelectLabel>
                                                <SelectItem value="Painting">Painting (Pintura)</SelectItem>
                                                <SelectItem value="Roofing">Roofing (Telhados)</SelectItem>
                                                <SelectItem value="Siding">Siding (Revestimento)</SelectItem>
                                                <SelectItem value="Insulation">Insulation (Isolamento)</SelectItem>
                                                <SelectItem value="Countertops">Countertops (Bancadas)</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🪵 Pisos (Flooring)</SelectLabel>
                                                <SelectItem value="Hardwood Flooring">Hardwood Flooring</SelectItem>
                                                <SelectItem value="Luxury Vinyl Plank (LVP)">Luxury Vinyl Plank (LVP)</SelectItem>
                                                <SelectItem value="Laminate Flooring">Laminate Flooring</SelectItem>
                                                <SelectItem value="Sand & Refinish">Sand & Refinish</SelectItem>
                                                <SelectItem value="Epoxy Flooring">Epoxy Flooring</SelectItem>
                                                <SelectItem value="Tile & Stone">Tile & Stone</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel className="bg-muted uppercase text-xs font-bold text-muted-foreground tracking-wider mt-2">🌿 Exterior & Outros</SelectLabel>
                                                <SelectItem value="Landscaping">Landscaping</SelectItem>
                                                <SelectItem value="Cleaning / Maid Services">Cleaning / Maid Services</SelectItem>
                                                <SelectItem value="HVAC">HVAC</SelectItem>
                                                <SelectItem value="Plumbing">Plumbing</SelectItem>
                                                <SelectItem value="Electrical">Electrical</SelectItem>
                                                <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {service === "other" && (
                                        <Input placeholder="Especifique o serviço..." value={serviceOther} onChange={(e) => setServiceOther(e.target.value)} className="mt-2" />
                                    )}
                                </div>

                                {/* Cidade */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground flex items-center gap-1.5">
                                        <MapPin size={14} className="text-primary" /> Cidade
                                    </Label>
                                    <Input placeholder="Ex: Orlando, Miami..." value={city} onChange={(e) => setCity(e.target.value)} />
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">Estado</Label>
                                    <Select value={state} onValueChange={setState}>
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            {[["FL","Florida"],["TX","Texas"],["CA","California"],["NY","New York"],["GA","Georgia"],["NC","North Carolina"],["AZ","Arizona"],["NV","Nevada"],["OH","Ohio"],["IL","Illinois"],["PA","Pennsylvania"],["WA","Washington"],["CO","Colorado"],["MA","Massachusetts"],["NJ","New Jersey"],["VA","Virginia"],["TN","Tennessee"],["SC","South Carolina"],["MN","Minnesota"],["MO","Missouri"]].map(([code, name]) => (
                                                <SelectItem key={code} value={`${name} (${code})`}>{name} ({code})</SelectItem>
                                            ))}
                                            <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {state === "other" && (
                                        <Input placeholder="Especifique o estado..." value={stateOther} onChange={(e) => setStateOther(e.target.value)} className="mt-2" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Criativo (Selos, Copy, CTA) */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                    <MousePointerClick size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">Configuração do Criativo</h2>
                                    <p className="text-xs text-muted-foreground">Selos, tom da copy e botão de CTA</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Selos */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground flex items-center gap-1.5">
                                        <Shield size={14} className="text-emerald-400" /> Selos de Credibilidade <span className="text-muted-foreground font-normal text-xs ml-auto">(Opcional, selecione vários)</span>
                                    </Label>
                                    <Select value="none" onValueChange={(val) => {
                                        if (val === "none") return;
                                        if (!seals.includes(val)) setSeals([...seals, val]);
                                    }}>
                                        <SelectTrigger className="w-full bg-input/50 h-12 hover:bg-input transition-colors"><SelectValue placeholder="Adicionar selo..." /></SelectTrigger>
                                        <SelectContent>
                                            {SEALS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    
                                    {(seals.filter(s => s !== "other").length > 0 || customSeals.length > 0) && (
                                        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-input/20 border border-border rounded-lg">
                                            {seals.filter(s => s !== "other").map(s => (
                                                <div key={s} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1.5 rounded-full border border-emerald-500/20">
                                                    {SEALS_OPTIONS.find(o => o.value === s)?.label}
                                                    <button onClick={() => setSeals(seals.filter(x => x !== s))} className="hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {customSeals.map((cs, i) => (
                                                <div key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1.5 rounded-full border border-emerald-500/20">
                                                    {cs}
                                                    <button onClick={() => setCustomSeals(customSeals.filter((_, idx) => idx !== i))} className="hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {seals.includes("other") && (
                                        <div className="flex gap-2 mt-2">
                                            <Input 
                                                placeholder="Selo personalizado (Ex: BBB Accredited)..." 
                                                value={newCustomSeal} 
                                                onChange={(e) => setNewCustomSeal(e.target.value)} 
                                                onKeyDown={(e) => { 
                                                    if (e.key === "Enter") { 
                                                        e.preventDefault(); 
                                                        if (newCustomSeal.trim()) { 
                                                            setCustomSeals([...customSeals, newCustomSeal.trim()]); 
                                                            setNewCustomSeal(""); 
                                                        } 
                                                    } 
                                                }} 
                                            />
                                            <Button 
                                                type="button" 
                                                variant="secondary"
                                                onClick={() => { 
                                                    if (newCustomSeal.trim()) { 
                                                        setCustomSeals([...customSeals, newCustomSeal.trim()]); 
                                                        setNewCustomSeal(""); 
                                                    } 
                                                }}
                                            >
                                                Adicionar
                                            </Button>
                                        </div>
                                    )}

                                    {/* Upload de Selos Customizados */}
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Ou envie selos personalizados (Imagens)</Label>
                                        <div 
                                            onClick={() => sealFileInputRef.current?.click()}
                                            className="border-2 border-dashed border-border hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer transition-all group hover:bg-emerald-500/5 mb-3"
                                        >
                                            <Upload size={20} className="mx-auto mb-2 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                                            <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">Upload de Selos em Imagem</p>
                                            <input ref={sealFileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleSealsUpload} />
                                        </div>
                                        <ImagePreviewGrid files={sealFiles} onRemove={(i) => setSealFiles(prev => prev.filter((_, idx) => idx !== i))} />
                                    </div>
                                </div>

                                {/* Tom da Copy */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground flex items-center gap-1.5">
                                        <MessageSquare size={14} className="text-blue-400" /> Tom da Copy (Ângulo de Venda)
                                    </Label>
                                    <Select value={copyTone} onValueChange={setCopyTone}>
                                        <SelectTrigger className="w-full bg-input/50 h-12 hover:bg-input transition-colors"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {COPY_TONE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {copyTone === "other" && (
                                        <Input placeholder="Especifique o tom (ex: Divertido, Urgente para Black Friday)..." value={copyToneOther} onChange={(e) => setCopyToneOther(e.target.value)} className="mt-2" />
                                    )}
                                </div>

                                {/* CTA */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground flex items-center gap-1.5">
                                        <MousePointerClick size={14} className="text-primary" /> Botão de Chamada para Ação (CTA)
                                    </Label>
                                    <Select value={cta} onValueChange={setCta}>
                                        <SelectTrigger className="w-full bg-input/50 h-12 hover:bg-input transition-colors"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {CTA_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {cta === "other" && (
                                        <Input placeholder="Especifique o botão CTA (ex: Solicite Orçamento)..." value={ctaOther} onChange={(e) => setCtaOther(e.target.value)} className="mt-2" />
                                    )}
                                </div>

                                {/* Oferta Especifica */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-amber-400" /> Preço ou Oferta Específica <span className="text-muted-foreground font-normal text-xs ml-auto">(Opcional)</span>
                                    </Label>
                                    <Input placeholder="Ex: $1,99 o sqft, 20% OFF, Instalation Included..." value={specificOffer} onChange={(e) => setSpecificOffer(e.target.value)} className="h-12 bg-input/50 focus:bg-input transition-colors" />
                                </div>

                                {/* Aspect Ratio */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground flex items-center gap-1.5">
                                        <ImagePlus size={14} className="text-purple-400" /> Formato da Imagem (Aspect Ratio)
                                    </Label>
                                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                                        <SelectTrigger className="w-full bg-input/50 h-12 hover:bg-input transition-colors"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {ASPECT_RATIO_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {aspectRatio === "other" && (
                                        <Input placeholder="Especifique o formato (ex: 2:1 panorâmico)..." value={aspectRatioOther} onChange={(e) => setAspectRatioOther(e.target.value)} className="mt-2" />
                                    )}
                                </div>

                                {/* Orientation */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground flex items-center gap-1.5">
                                        <WorkflowIcon size={14} className="text-amber-400" /> Layout de Texto e Elementos
                                    </Label>
                                    <Select value={orientation} onValueChange={setOrientation}>
                                        <SelectTrigger className="w-full bg-input/50 h-12 hover:bg-input transition-colors"><SelectValue placeholder="Selecione o layout..." /></SelectTrigger>
                                        <SelectContent>
                                            {ORIENTATION_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {orientation === "other" && (
                                        <Input placeholder="Especifique o layout (ex: Diagonal, texto no topo e elementos na base)..." value={orientationOther} onChange={(e) => setOrientationOther(e.target.value)} className="mt-2" />
                                    )}
                                </div>
                            </div>

                            {/* Preview chips */}
                            {(copyTone !== "none" || cta !== "none" || aspectRatio !== "none") && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {aspectRatio !== "none" && <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20">{aspectRatio === "other" ? (aspectRatioOther || "Outro Formato") : ASPECT_RATIO_OPTIONS.find(o => o.value === aspectRatio)?.label}</span>}
                                    {copyTone !== "none" && <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">{copyTone === "other" ? (copyToneOther || "Outro Tom") : COPY_TONE_OPTIONS.find(o => o.value === copyTone)?.label}</span>}
                                    {cta !== "none" && <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">{cta === "other" ? (ctaOther || "Outro CTA") : CTA_OPTIONS.find(o => o.value === cta)?.label}</span>}
                                </div>
                            )}
                        </div>

                        {/* Card 3: Fotos */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                    <ImagePlus size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">Fotos do Serviço</h2>
                                    <p className="text-xs text-muted-foreground">Arraste ou clique • Múltiplos arquivos</p>
                                </div>
                            </div>

                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => photoInputRef.current?.click()}
                                className="border-2 border-dashed border-border hover:border-blue-500/50 rounded-xl p-6 text-center cursor-pointer transition-all group hover:bg-blue-500/5"
                            >
                                <Upload size={28} className="mx-auto mb-2 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                                <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">
                                    Arraste imagens ou <span className="text-blue-400">clique para selecionar</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP • Múltiplos arquivos</p>
                                <input ref={photoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handlePhotosUpload} />
                            </div>

                            <ImagePreviewGrid files={photos} onRemove={(i) => setPhotos(prev => prev.filter((_, idx) => idx !== i))} />

                            <div className="mt-4 space-y-2">
                                <Label className="font-semibold text-foreground text-sm">
                                    Descrição <span className="text-muted-foreground font-normal">(Opcional)</span>
                                </Label>
                                <Textarea
                                    placeholder="Ex: Foto antes da instalação do LVP, foto após o serviço finalizado..."
                                    rows={2} className="resize-none text-sm"
                                    value={photoDesc} onChange={(e) => setPhotoDesc(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Card 4: Logo */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                                    <Palette size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">Logo do Cliente</h2>
                                    <p className="text-xs text-muted-foreground">Extrai a paleta de cores automaticamente</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div
                                    onClick={() => logoInputRef.current?.click()}
                                    className="border-2 border-dashed border-border hover:border-purple-500/50 rounded-xl p-5 text-center cursor-pointer transition-all group hover:bg-purple-500/5"
                                >
                                    {logoFile ? (
                                        <div className="relative">
                                            <img src={logoFile.previewUrl} alt="Logo" className="max-h-20 mx-auto object-contain rounded-lg" />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); removeLogo() }} className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"><X size={12} /></button>
                                            <p className="text-xs text-muted-foreground mt-2 truncate">{logoFile.name}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <FileImage size={28} className="mx-auto mb-2 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                                            <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">Clique para selecionar a logo</p>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG</p>
                                        </>
                                    )}
                                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                </div>

                                <div className="flex flex-col gap-4">
                                    {colorsExtracted && (
                                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                                            <Check size={14} className="text-green-400 shrink-0" />
                                            <p className="text-xs text-green-400 font-semibold">Cores extraídas automaticamente!</p>
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cor Primária</Label>
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0" />
                                            <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-9 font-mono text-xs uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cor Secundária</Label>
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0" />
                                            <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-9 font-mono text-xs uppercase" />
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-border space-y-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cores Adicionais</Label>
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={newCustomColor} onChange={(e) => setNewCustomColor(e.target.value)} className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0" />
                                            <Input value={newCustomColor} onChange={(e) => setNewCustomColor(e.target.value)} className="h-9 font-mono text-xs uppercase" />
                                            <Button type="button" onClick={() => { setCustomColors([...customColors, newCustomColor.toUpperCase()]); setNewCustomColor("#FFFFFF") }} variant="secondary" className="h-9 px-3">Adicionar</Button>
                                        </div>
                                        {customColors.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {customColors.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 bg-input/50 border border-border rounded-md pl-2 pr-1 py-1">
                                                        <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c }} />
                                                        <span className="text-xs font-mono text-muted-foreground">{c}</span>
                                                        <button type="button" onClick={() => setCustomColors(customColors.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 p-0.5"><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 5: Observações */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            <h2 className="text-base font-bold text-foreground mb-3">Observações Adicionais</h2>
                            <Textarea
                                placeholder="Ex: Cliente quer destacar o prazo de entrega rápido, focar no público de imóveis de luxo..."
                                rows={3} className="resize-none"
                                value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)}
                            />
                        </div>

                        {/* Card 6: Avançado */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 overflow-hidden transition-all duration-300">
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsAdvancedMode(!isAdvancedMode)}>
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isAdvancedMode ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Modo Avançado</h2>
                                        <p className="text-xs text-muted-foreground">Force uma copy específica e adicione fotos de referência</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isAdvancedMode ? 'bg-primary' : 'bg-input'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAdvancedMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {isAdvancedMode && (
                                <div className="mt-8 pt-6 border-t border-border space-y-8 animate-in slide-in-from-top-4 fade-in duration-300">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-input/20 border border-border p-5 rounded-xl">
                                            <div className="md:col-span-2 mb-2">
                                                <h3 className="text-sm font-bold text-foreground">🎯 Público e Contexto</h3>
                                                <p className="text-xs text-muted-foreground">Quem verá este anúncio e onde</p>
                                            </div>
                                            
                                            {/* Target Age */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Faixa Etária</Label>
                                                <Select value={targetAge} onValueChange={setTargetAge}>
                                                    <SelectTrigger className="w-full bg-input/50 h-10 hover:bg-input"><SelectValue /></SelectTrigger>
                                                    <SelectContent>{TARGET_AGE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                                {targetAge === "other" && <Input placeholder="Especifique..." value={targetAgeOther} onChange={(e) => setTargetAgeOther(e.target.value)} className="mt-2 h-9 text-sm" />}
                                            </div>

                                            {/* Target Gender */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Gênero Predominante</Label>
                                                <Select value={targetGender} onValueChange={setTargetGender}>
                                                    <SelectTrigger className="w-full bg-input/50 h-10 hover:bg-input"><SelectValue /></SelectTrigger>
                                                    <SelectContent>{TARGET_GENDER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                                {targetGender === "other" && <Input placeholder="Especifique..." value={targetGenderOther} onChange={(e) => setTargetGenderOther(e.target.value)} className="mt-2 h-9 text-sm" />}
                                            </div>

                                            {/* Socioeconomic */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Nível Sócioeconômico</Label>
                                                <Select value={socioeconomicStatus} onValueChange={setSocioeconomicStatus}>
                                                    <SelectTrigger className="w-full bg-input/50 h-10 hover:bg-input"><SelectValue /></SelectTrigger>
                                                    <SelectContent>{SOCIOECONOMIC_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                                {socioeconomicStatus === "other" && <Input placeholder="Especifique..." value={socioeconomicStatusOther} onChange={(e) => setSocioeconomicStatusOther(e.target.value)} className="mt-2 h-9 text-sm" />}
                                            </div>

                                            {/* Campaign Context */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Sazonalidade da Campanha</Label>
                                                <Select value={campaignContext} onValueChange={setCampaignContext}>
                                                    <SelectTrigger className="w-full bg-input/50 h-10 hover:bg-input"><SelectValue /></SelectTrigger>
                                                    <SelectContent>{CAMPAIGN_CONTEXT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                                {campaignContext === "other" && <Input placeholder="Especifique..." value={campaignContextOther} onChange={(e) => setCampaignContextOther(e.target.value)} className="mt-2 h-9 text-sm" />}
                                            </div>

                                            {/* Platform */}
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Plataforma Onde Vai Rodar</Label>
                                                <Select value={platform} onValueChange={setPlatform}>
                                                    <SelectTrigger className="w-full bg-input/50 h-10 hover:bg-input"><SelectValue /></SelectTrigger>
                                                    <SelectContent>{PLATFORM_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                                {platform === "other" && <Input placeholder="Especifique as plataformas envolvidas..." value={platformOther} onChange={(e) => setPlatformOther(e.target.value)} className="mt-2 h-9 text-sm" />}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <Label className="font-semibold text-foreground flex items-center gap-1.5 text-base">
                                                <MessageSquare size={16} className="text-primary" /> Copy Específica
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1 mb-3">
                                                Deseja forçar um texto exato no criativo? Cole a copy final aqui. Isso substituirá as instruções de "Tom da Copy".
                                            </p>
                                            <Textarea
                                                placeholder="Cole a copy exata que deve aparecer no design..."
                                                rows={4} className="resize-none"
                                                value={specificCopy} onChange={(e) => setSpecificCopy(e.target.value)}
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <Label className="font-semibold text-foreground flex items-center gap-1.5 text-base">
                                                <ImagePlus size={16} className="text-blue-400" /> Fotos de Referência (Inspiração)
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1 mb-3">
                                                Anexe criativos ou designs que você gostou. A IA usará apenas como inspiração visual, sem misturar com as fotos originais do cliente.
                                            </p>
                                            
                                            <div
                                                onClick={() => refPhotoInputRef.current?.click()}
                                                className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer transition-all group hover:bg-primary/5"
                                            >
                                                <Upload size={24} className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">
                                                    Arraste referências ou <span className="text-primary">clique para anexar</span>
                                                </p>
                                                <input ref={refPhotoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleRefPhotosUpload} />
                                            </div>
                                            
                                            <ImagePreviewGrid files={referencePhotos} onRemove={(i) => setReferencePhotos(prev => prev.filter((_, idx) => idx !== i))} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botão Gerar */}
                        <Button
                            onClick={handleGenerate}
                            disabled={!isReady || isGenerating}
                            className={cn(
                                "w-full py-7 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300",
                                isReady ? "bg-primary hover:bg-primary/90 text-black hover:-translate-y-1 hover:shadow-primary/30" : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            {isGenerating ? <><Check size={22} className="mr-2" /> Prompt Gerado!</> : <><Sparkles size={22} className="mr-2" /> Gerar Prompt</>}
                        </Button>
                        {!isReady && <p className="text-center text-xs text-muted-foreground -mt-3">Selecione o <strong>Serviço Principal</strong> para continuar.</p>}

                        {/* Histórico Recente */}
                        <GenerationHistory 
                            history={history} 
                            onRestore={handleRestore} 
                            generatorName="workflow" 
                        />
                    </div>

                    {/* ── Coluna Direita: Output ── */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 flex flex-col gap-4">

                            {/* Aviso clipboard */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                                <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <strong className="text-blue-400">Sobre as imagens:</strong> Por limitação do browser, não é possível copiar imagens junto com o texto em uma única operação. Copie o prompt e <strong className="text-foreground">arraste as imagens do painel abaixo</strong> para a IA.
                                </p>
                            </div>

                            {/* Prompt Output */}
                            <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/50">
                                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                        <WorkflowIcon size={20} className="text-primary" /> Prompt Gerado
                                    </h2>
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-primary/20 text-primary">
                                        PRONTO PARA IA
                                    </span>
                                </div>

                                <div className="p-5 min-h-[280px] flex flex-col">
                                    {generatedPrompt ? (
                                        <>
                                            <Textarea
                                                className="flex-1 bg-input border-none text-foreground resize-none min-h-[220px] text-[12px] font-mono p-4 leading-relaxed focus-visible:ring-1 focus-visible:ring-primary/40 rounded-xl custom-scrollbar"
                                                readOnly value={generatedPrompt}
                                            />
                                            <div className="flex gap-2 mt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={handleResetForm}
                                                    className="flex-1 font-bold border-border text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all h-11 rounded-xl"
                                                >
                                                    <X size={18} className="mr-2" /> Limpar Tudo
                                                </Button>
                                                <Button
                                                    onClick={handleCopyPrompt}
                                                    className={cn("flex-[2] font-bold transition-all h-11 rounded-xl", isCopied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary hover:bg-primary/90 text-black")}
                                                >
                                                    {isCopied ? <><Check size={18} className="mr-2" /> Copiado!</> : <><Copy size={18} className="mr-2" /> Copiar Prompt</>}
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                            <WorkflowIcon size={44} className="text-primary mb-4" />
                                            <p className="text-muted-foreground text-sm max-w-[200px]">Preencha o formulário e clique em <strong>"Gerar Prompt"</strong>.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Painel de imagens para arrastar */}
                            {(photos.length > 0 || logoFile) && (
                                <div className="bg-card border border-amber-500/30 rounded-2xl overflow-hidden shadow-lg">
                                    <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
                                        <span className="text-lg">🖼️</span>
                                        <div>
                                            <p className="text-amber-400 font-bold text-sm">Passo 2: Arraste estas imagens para a IA</p>
                                            <p className="text-muted-foreground text-xs">Cole o prompt primeiro, depois arraste as imagens abaixo</p>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-4 gap-2">
                                            {logoFile && (
                                                <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/40 aspect-square bg-input group cursor-grab">
                                                    <img src={logoFile.previewUrl} alt="logo" className="w-full h-full object-contain p-1" />
                                                    <div className="absolute bottom-0 inset-x-0 bg-purple-500/80 text-white text-[8px] font-bold px-1 py-0.5 text-center uppercase tracking-wide">Logo</div>
                                                </div>
                                            )}
                                            {photos.map((p, i) => (
                                                <div key={i} className="relative rounded-xl overflow-hidden border border-amber-500/30 aspect-square bg-input cursor-grab">
                                                    <img src={p.previewUrl} alt={p.name} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] px-1 py-0.5 truncate">Foto {i + 1}</div>
                                                </div>
                                            ))}
                                            {sealFiles.map((p, i) => (
                                                <div key={i} className="relative rounded-xl overflow-hidden border border-emerald-500/30 aspect-square bg-input cursor-grab">
                                                    <img src={p.previewUrl} alt={p.name} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 inset-x-0 bg-emerald-500/80 text-white text-[8px] font-bold px-1 py-0.5 text-center uppercase tracking-wide">Selo {i + 1}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-3 text-center">
                                            {(photos.length + (logoFile ? 1 : 0) + sealFiles.length)} imagem(ns) • Arraste-as para o chat da IA após colar o prompt
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            {(photos.length > 0 || logoFile || finalService) && (
                                <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-4 divide-x divide-border text-center">
                                    <div className="px-2">
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Serviço</p>
                                        <p className="text-xs font-bold text-foreground truncate">{finalService || "—"}</p>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Fotos</p>
                                        <p className="text-sm font-bold text-blue-400">{photos.length}</p>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Logo</p>
                                        <p className="text-sm font-bold text-purple-400">{logoFile ? "✓" : "—"}</p>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-[10px] text-muted-foreground mb-0.5">CTA</p>
                                        <p className="text-sm font-bold text-primary">{cta !== "none" ? "✓" : "—"}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup de Fluxo de Trabalho Customizado (Prompt > Imagens > Logo) */}
            {showImagePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowImagePopup(false)} />
                    
                    <div className="relative w-full max-w-[1200px] max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col outline-none z-10 animate-in zoom-in-95 duration-200">
                    {/* Header Premium */}
                    <div className="bg-primary px-6 py-4 flex items-center justify-between shrink-0 border-b border-black/10">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-black/10 flex items-center justify-center">
                                <Sparkles size={24} className="text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-black uppercase tracking-tight leading-none">
                                    Workflow de Finalização
                                </h2>
                                <p className="text-black/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                                    Siga os passos e cole diretamente no ChatGPT/Claude
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
                            "grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-zinc-800 h-full min-h-[400px]",
                            (referencePhotos.length > 0 && isAdvancedMode) ? (sealFiles.length > 0 ? "md:grid-cols-5" : "md:grid-cols-4") : (sealFiles.length > 0 ? "md:grid-cols-4" : "md:grid-cols-3")
                        )}>
                            
                            {/* PASSO 1: TEXTO */}
                            <div className="p-6 lg:p-10 flex flex-col gap-6 bg-zinc-950 min-h-[400px]">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-primary text-black flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 shrink-0">1</div>
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
                                        "w-full py-7 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3", 
                                        copiedType === "prompt" ? "bg-green-600 text-white hover:bg-green-700" : "bg-primary hover:bg-orange-500 text-black"
                                    )}
                                >
                                    {copiedType === "prompt" ? <Check size={20} /> : <Copy size={20} />}
                                    <span>{copiedType === "prompt" ? "Copiado!" : "Copiar Prompt"}</span>
                                </Button>
                            </div>

                            {/* PASSO 2: FOTOS */}
                            <div className="p-6 lg:p-10 flex flex-col gap-6 bg-zinc-900/20">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20 shrink-0">2</div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Anexar Fotos</h3>
                                </div>

                                <div className="flex-1 flex flex-col gap-6">
                                    {photos.length > 0 ? (
                                        <>
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-3 shadow-xl">
                                                <img 
                                                    src={photos[currentImageIndex]?.previewUrl} 
                                                    alt="Preview" 
                                                    className="max-w-full max-h-full object-contain rounded-lg"
                                                />
                                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                                                    Foto {currentImageIndex + 1} / {photos.length}
                                                </div>
                                                
                                                {photos.length > 1 && (
                                                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p === 0 ? photos.length - 1 : p - 1)) }} 
                                                            className="p-1.5 bg-black/80 rounded-lg text-white hover:bg-blue-500 transition-colors pointer-events-auto border border-white/10"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p === photos.length - 1 ? 0 : p + 1)) }} 
                                                            className="p-1.5 bg-black/80 rounded-lg text-white hover:bg-blue-500 transition-colors pointer-events-auto border border-white/10"
                                                        >
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <Button 
                                                onClick={() => copyImageToClipboard(photos[currentImageIndex]?.previewUrl, "photo")}
                                                className={cn(
                                                    "w-full py-7 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3", 
                                                    copiedType === "photo" ? "bg-green-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                                                )}
                                            >
                                                {copiedType === "photo" ? <Check size={20} /> : <Copy size={20} />}
                                                <span>{copiedType === "photo" ? "Foto Copiada!" : "Copiar Esta Foto"}</span>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl opacity-40">
                                            <ImagePlus size={44} className="mb-4 text-zinc-500" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center leading-relaxed">Nenhuma foto<br/>carregada</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* PASSO 3: LOGO */}
                            <div className="p-6 lg:p-10 flex flex-col gap-6 bg-zinc-950">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20 shrink-0">3</div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Anexar Logo</h3>
                                </div>

                                <div className="flex-1 flex flex-col gap-6">
                                    {logoFile ? (
                                        <>
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-6 shadow-xl">
                                                <img 
                                                    src={logoFile.previewUrl} 
                                                    alt="Logo" 
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                                                    Logo Cliente
                                                </div>
                                            </div>

                                            <Button 
                                                onClick={() => copyImageToClipboard(logoFile.previewUrl, "logo")}
                                                className={cn(
                                                    "w-full py-7 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3", 
                                                    copiedType === "logo" ? "bg-green-600 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
                                                )}
                                            >
                                                {copiedType === "logo" ? <Check size={20} /> : <Copy size={20} />}
                                                <span>{copiedType === "logo" ? "Logo Copiada!" : "Copiar Logo"}</span>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl opacity-40">
                                            <Palette size={44} className="mb-4 text-zinc-500" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center leading-relaxed">Nenhuma logo<br/>carregada</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* PASSO 4: SELOS (OPCIONAL) */}
                            {sealFiles.length > 0 && (
                                <div className="p-6 lg:p-10 flex flex-col gap-6 bg-zinc-900/40">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20 shrink-0">{referencePhotos.length > 0 && isAdvancedMode ? "4" : "4"}</div>
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Anexar Selos</h3>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-6">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-3 shadow-xl">
                                            <img 
                                                src={sealFiles[currentSealIndex]?.previewUrl} 
                                                alt="Selo" 
                                                className="max-w-full max-h-full object-contain rounded-lg"
                                            />
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                                Selo {currentSealIndex + 1} / {sealFiles.length}
                                            </div>
                                            
                                            {sealFiles.length > 1 && (
                                                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setCurrentSealIndex(p => (p === 0 ? sealFiles.length - 1 : p - 1)) }} 
                                                        className="p-1.5 bg-black/80 rounded-lg text-white hover:bg-emerald-500 transition-colors pointer-events-auto border border-white/10"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setCurrentSealIndex(p => (p === sealFiles.length - 1 ? 0 : p + 1)) }} 
                                                        className="p-1.5 bg-black/80 rounded-lg text-white hover:bg-emerald-500 transition-colors pointer-events-auto border border-white/10"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <Button 
                                            onClick={() => copyImageToClipboard(sealFiles[currentSealIndex]?.previewUrl, "seal")}
                                            className={cn(
                                                "w-full py-7 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3", 
                                                copiedType === "seal" ? "bg-green-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                            )}
                                        >
                                            {copiedType === "seal" ? <Check size={20} /> : <Copy size={20} />}
                                            <span>{copiedType === "seal" ? "Selo Copiado!" : "Copiar Selo"}</span>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* PASSO 5: REFERÊNCIAS (OPCIONAL) */}
                            {referencePhotos.length > 0 && isAdvancedMode && (
                                <div className="p-6 lg:p-10 flex flex-col gap-6 bg-zinc-900/60">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20 shrink-0">{sealFiles.length > 0 ? "5" : "4"}</div>
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Anexar Referências</h3>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-6">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-3 shadow-xl">
                                            <img 
                                                src={referencePhotos[currentRefIndex]?.previewUrl} 
                                                alt="Referência" 
                                                className="max-w-full max-h-full object-contain rounded-lg"
                                            />
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-orange-400 border border-orange-500/20 uppercase tracking-widest">
                                                Ref {currentRefIndex + 1} / {referencePhotos.length}
                                            </div>
                                            
                                            {referencePhotos.length > 1 && (
                                                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setCurrentRefIndex(p => (p === 0 ? referencePhotos.length - 1 : p - 1)) }} 
                                                        className="p-1.5 bg-black/80 rounded-lg text-white hover:bg-orange-500 transition-colors pointer-events-auto border border-white/10"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setCurrentRefIndex(p => (p === referencePhotos.length - 1 ? 0 : p + 1)) }} 
                                                        className="p-1.5 bg-black/80 rounded-lg text-white hover:bg-orange-500 transition-colors pointer-events-auto border border-white/10"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <Button 
                                            onClick={() => copyImageToClipboard(referencePhotos[currentRefIndex]?.previewUrl, "ref")}
                                            className={cn(
                                                "w-full py-7 text-base font-bold uppercase transition-all shadow-xl rounded-xl flex items-center justify-center gap-3", 
                                                copiedType === "ref" ? "bg-green-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
                                            )}
                                        >
                                            {copiedType === "ref" ? <Check size={20} /> : <Copy size={20} />}
                                            <span>{copiedType === "ref" ? "Ref Copiada!" : "Copiar Referência"}</span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Clean */}
                    <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Check size={14} className="text-primary" /> 
                            Processo finalizado? Basta colar e pronto!
                        </p>
                        <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => setShowImagePopup(false)}>Fechar Popup</Button>
                    </div>
                </div>
                </div>
            )}

            {/* Magic Fill Dialog */}
            <Dialog open={showMagicFill} onOpenChange={setShowMagicFill}>
                <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 p-0 shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar">
                    <div className="p-6 md:p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
                                <Sparkles size={28} />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-white tracking-tight">Magic Fill</DialogTitle>
                                <DialogDescription className="text-zinc-400 text-sm">
                                    Cole o bloco de texto estruturado para preencher o formulário automaticamente.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-primary/20 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                            <Textarea
                                placeholder="Cole aqui o briefing formatado...&#10;&#10;Exemplo:&#10;SERVIÇO: Hardwood Flooring&#10;CIDADE: Orlando&#10;..."
                                className="relative bg-zinc-900/80 border-zinc-700 text-zinc-100 min-h-[300px] font-mono text-sm leading-relaxed focus-visible:ring-1 focus-visible:ring-amber-500/50 rounded-xl p-5 custom-scrollbar"
                                value={magicFillText}
                                onChange={(e) => setMagicFillText(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button 
                                variant="outline" 
                                className="flex-1 border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all rounded-xl h-12 font-bold"
                                onClick={() => setMagicFillText("")}
                            >
                                Limpar
                            </Button>
                            <Button 
                                className="flex-[2] bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl h-12 font-bold flex items-center gap-2"
                                onClick={handleMagicFill}
                                disabled={!magicFillText.trim()}
                            >
                                <Sparkles size={18} /> Preencher Formulário
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
