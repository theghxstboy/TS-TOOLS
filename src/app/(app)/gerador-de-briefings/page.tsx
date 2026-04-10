"use client"

import { useState, useEffect } from "react"
import {
    Briefcase,
    Building2,
    Users,
    Settings,
    Layout,
    Share2,
    Target,
    MapPin,
    Calendar,
    Phone,
    User,
    Mail,
    Lock,
    Star,
    Sparkles,
    ClipboardCheck,
    AlertCircle,
    CheckCircle2,
    Copy,
    Search,
    Wand2,
    HelpCircle,
    LayoutDashboard,
    Clock,
    Palette,
    Globe,
    Facebook,
    Instagram,
    SearchCheck,
    FileCheck,
    PenTool,
    TrendingUp,
    ImageIcon,
    X,
    Eye,
    EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useClipboard } from "@/hooks/useClipboard"

// --- Types & Initial State ---

interface BriefingData {
    // PERGUNTAS GERAIS
    servicosContratados: string[];
    servicosContratadosCustom: string[];
    responsavel: string;
    dataNascimento: string;
    nomeEmpresa: string;
    dataFundacao: string;
    anosRamo: string[];
    anosRamoCustom: string;
    endereco: string;
    numeroComercial: string[];
    experienciaMarketing: string;
    plataformasMarketing: string[];
    plataformasMarketingCustom: string[];
    motivoFechouTS: string;
    quaisInformacoesComunicacao: string;
    sonhosCompanhia: string;
    referenciasSegmento: string;
    horariosReuniao: string;
    horariosAtendimento: string;

    // SOBRE A EMPRESA
    historiaEmpresa: string;
    quantidadePessoas: string[];
    quantidadePessoasCustom: string;
    selosParcerias: string;
    origemNome: string;
    dificuldadeEvolucao: string;
    abertoPromocoes: string;
    datasComemorativas: string[];
    datasComemorativasCustom: string[];

    // SOBRE OS SERVIÇOS
    produtosServicos: string;
    mediaValores: string;
    principaisServicosAnuncios: string;
    servicosNaoFaz: string;
    diferenciais: string;
    possuiFotosVideos: string;
    problemaBancoImagens: string;

    // SOBRE O PÚBLICO
    perfilCliente: string;
    problemasFrequentes: string;
    experienciaMarcante: string;
    duvidasFrequentes: string;
    nacionalidadeCliente: string;
    meioContatoPreferido: string;
    primeiroAtendimento: string;
    comoEnviaOrcamento: string;
    uniformeVistas: string;
    numerosRecomendar: string;
    amostrasPisos: string;
    portfolioVisitas: string;

    // DESIGN
    idiomas: string[];
    idiomasCustom: string[];
    sistemasInternos: string;
    identidadeVisual: string;
    vetorPdf: string;
    referenciasLogo: string;
    estiloLogo: string;
    coresTransmitir: string;
    coresNaoQuer: string;
    obrigatorioLogo: string;
    cartaoVisitas: string;
    informacoesCartao: string;
    plotagemVeiculo: string;
    tipoPlotagem: string;

    // WEBDESIGN
    conheceHospedagemDominio: string;
    possuiSite: string;
    manterDominio: string;
    hospedagemAtual: string;
    manterHospedagem: string;
    emailProfissional: string;
    transferirEmails: string;
    referenciasSites: string;
    obrigatorioSite: string;
    tipoNegocio: string;

    // SOCIAL MEDIA
    facilidadeRedes: string;
    comunicacaoClientes: string[];
    comunicacaoClientesCustom: string;
    preferenciaPosts: string;
    disponibilidadeMateriais: string;
    referenciasInstagram: string;
    layoutArtes: string;
    layoutFotos: string;
    estiloMusicalNao: string;
    termosInglesSim: string;
    termosInglesNao: string;

    // TRÁFEGO PAGO
    experienciaAnuncios: string;
    regiaoAtuacao: string;
    faturamentoAtualDesejo: string;
    fechamentosMesProjecao: string;
    ticketMedio: string;
    margemLucro: string;
    investimentoDisponivel: string;
    cplEsperado: string;
    expectativaLeads: string;
    cpaEsperado: string;

    // GMB
    conheceGMB: string;

    // LOCAL SERVICES
    licenseEmpresa: string;
    seguroLiability: string;
    ssnItin: string;
    driveLicensePassaporte: string;
    servicosAtivosGLS: string[];
    servicosAtivosGLSCustom: string[];

    // ACESSOS
    fbLogin: string;
    fbPass: string;
    igLogin: string;
    igPass: string;
    gmailLogin: string;
    gmailPass: string;
    informacoesAdicionais: string;
}

const INITIAL_STATE: BriefingData = {
    servicosContratados: [], servicosContratadosCustom: [], responsavel: "", dataNascimento: "", nomeEmpresa: "", dataFundacao: "", anosRamo: [], anosRamoCustom: "", endereco: "", numeroComercial: [], experienciaMarketing: "", plataformasMarketing: [], plataformasMarketingCustom: [], motivoFechouTS: "", quaisInformacoesComunicacao: "", sonhosCompanhia: "", referenciasSegmento: "", horariosReuniao: "", horariosAtendimento: "",
    historiaEmpresa: "", quantidadePessoas: [], quantidadePessoasCustom: "", selosParcerias: "", origemNome: "", dificuldadeEvolucao: "", abertoPromocoes: "", datasComemorativas: [], datasComemorativasCustom: [],
    produtosServicos: "", mediaValores: "", principaisServicosAnuncios: "", servicosNaoFaz: "", diferenciais: "", possuiFotosVideos: "", problemaBancoImagens: "",
    perfilCliente: "", problemasFrequentes: "", experienciaMarcante: "", duvidasFrequentes: "", nacionalidadeCliente: "", meioContatoPreferido: "", primeiroAtendimento: "", comoEnviaOrcamento: "", uniformeVistas: "", numerosRecomendar: "", amostrasPisos: "", portfolioVisitas: "",
    idiomas: [], idiomasCustom: [],
    sistemasInternos: "",
    identidadeVisual: "",
    vetorPdf: "",
    referenciasLogo: "", estiloLogo: "", coresTransmitir: "", coresNaoQuer: "", obrigatorioLogo: "", cartaoVisitas: "", informacoesCartao: "", plotagemVeiculo: "", tipoPlotagem: "",
    conheceHospedagemDominio: "", possuiSite: "", manterDominio: "", hospedagemAtual: "", manterHospedagem: "", emailProfissional: "", transferirEmails: "", referenciasSites: "", obrigatorioSite: "", tipoNegocio: "",
    facilidadeRedes: "", comunicacaoClientes: [], comunicacaoClientesCustom: "", preferencePosts: "", disponibilidadeMateriais: "", referenciasInstagram: "", layoutArtes: "", layoutFotos: "", estiloMusicalNao: "", termosInglesSim: "", termosInglesNao: "",
    experienciaAnuncios: "", regiaoAtuacao: "", faturamentoAtualDesejo: "", fechamentosMesProjecao: "", ticketMedio: "", margemLucro: "", investimentoDisponivel: "", cplEsperado: "", expectativaLeads: "", cpaEsperado: "",
    conheceGMB: "",
    licenseEmpresa: "", seguroLiability: "", ssnItin: "", driveLicensePassaporte: "", servicosAtivosGLS: [], servicosAtivosGLSCustom: [],
    fbLogin: "", fbPass: "", igLogin: "", igPass: "", gmailLogin: "", gmailPass: "",
    informacoesAdicionais: ""
}

// --- Helper Data ---

const PLATFORMS_OPTIONS = ["Yelp", "Thumbtack", "Nextdoor", "Houzz", "Angi List", "OUTRO"];

const HOLIDAYS_OPTIONS = [
    "New Year’s Day", "Martin Luther King Jr. Day", "Valentine's Day", "Presidents’ Day",
    "St. Patrick's Day", "Easter", "Beginning of Spring", "Patriots’ Day", "Memorial Day",
    "Mother's Day", "Juneteenth", "Father’s Day", "Beginning of Summer", "4th of July (Independence Day)",
    "Labor Day", "Patriot Day", "Beginning of Fall", "Halloween", "Veterans Day", "OUTRO"
];

const NICHE_GLS_SERVICES: Record<string, string[]> = {
    "construction": ["General contracting", "Kitchen remodeling", "Bathroom remodeling", "Home building", "Basement finishing", "OUTRO"],
    "roofing": ["Roof repair", "Roof installation", "Gutter repair", "Skylight installation", "OUTRO"],
    "painting": ["Interior painting", "Exterior painting", "Cabinet painting", "Drywall repair", "OUTRO"],
    "hvac": ["AC repair", "AC installation", "Heating repair", "Heating installation", "Duct cleaning", "OUTRO"],
    "plumbing": ["Leak detection", "Pipe repair", "Water heater installation", "Drain cleaning", "OUTRO"],
    "electrical": ["Wiring installation", "Panel upgrade", "Lighting installation", "Outlet repair", "OUTRO"],
    "cleaning": ["House cleaning", "Deep cleaning", "Move-in/move-out cleaning", "Office cleaning", "Carpet cleaning", "OUTRO"],
    "landscaping": ["Lawn care", "Landscape design", "Tree removal", "Hardscaping", "OUTRO"],
    "flooring": ["Baseboards", "Carpet", "Floor polishing", "Floor refinishing", "Hardwood", "Installing floors", "Marble", "Stair flooring", "Tile", "OUTRO"],
    "hardwood-flooring": ["Hardwood installation", "Hardwood refinishing", "Hardwood repair", "Stair flooring", "Baseboards", "OUTRO"],
    "luxury-vinyl-plank": ["LVP installation", "LVP repair", "Subfloor prep", "Baseboards", "OUTRO"],
    "laminate-flooring": ["Laminate installation", "Laminate repair", "Subfloor prep", "Baseboards", "OUTRO"],
    "info-business": ["Mentoria individual", "Mentoria em grupo", "Curso gravado", "E-book", "Comunidade", "OUTRO"],
    "health-beauty": ["Tratamento facial", "Tratamento corporal", "Botox", "Laser", "Massagem", "OUTRO"],
    "real-estate": ["Venda de imóveis", "Aluguel", "Gestão de propriedades", "Avaliação", "OUTRO"],
    "b2b-saas": ["SaaS", "Consultoria TI", "Implementação", "Suporte", "OUTRO"],
    "ecommerce": ["Produtos físicos", "Dropshipping", "Private label", "OUTRO"],
    "other": ["Serviço 1", "Serviço 2", "OUTRO"]
};

const NICHE_PLACEHOLDERS: Record<string, { nomeEmpresa: string, responsavel: string, servicosAnuncios: string }> = {
    "construction": { nomeEmpresa: "Ex: Elite Construction LLC", responsavel: "Ex: John Builder", servicosAnuncios: "Ex: Kitchen & Bath Remodeling" },
    "roofing": { nomeEmpresa: "Ex: Top Roofing LLC", responsavel: "Ex: Mike Roofer", servicosAnuncios: "Ex: Roof Replacement & Repair" },
    "painting": { nomeEmpresa: "Ex: Pro Painting Bros", responsavel: "Ex: Alex Painter", servicosAnuncios: "Ex: Interior & Exterior Painting" },
    "hvac": { nomeEmpresa: "Ex: Cool Air HVAC", responsavel: "Ex: David Tech", servicosAnuncios: "Ex: AC Repair & Installation" },
    "plumbing": { nomeEmpresa: "Ex: Quick Plumbing Services", responsavel: "Ex: Mario Plumber", servicosAnuncios: "Ex: Emergency Plumbing & Water Heaters" },
    "electrical": { nomeEmpresa: "Ex: Spark Electrical", responsavel: "Ex: Tom Electrician", servicosAnuncios: "Ex: Panel Upgrades & Rewiring" },
    "cleaning": { nomeEmpresa: "Ex: Sparkle Cleaning Services", responsavel: "Ex: Maria Maid", servicosAnuncios: "Ex: Deep Cleaning & Move-In/Out" },
    "landscaping": { nomeEmpresa: "Ex: Green Turf Landscaping", responsavel: "Ex: Carlos Landscaper", servicosAnuncios: "Ex: Lawn Care & Hardscaping" },
    "flooring": { nomeEmpresa: "Ex: Top Flooring LLC", responsavel: "Ex: John Doe", servicosAnuncios: "Ex: Hardwood Installation & Refinishing" },
    "hardwood-flooring": { nomeEmpresa: "Ex: Hardwood Experts", responsavel: "Ex: John Wood", servicosAnuncios: "Ex: Hardwood Refinishing & Installation" },
    "luxury-vinyl-plank": { nomeEmpresa: "Ex: LVP Masters", responsavel: "Ex: John Smith", servicosAnuncios: "Ex: LVP Installation" },
    "laminate-flooring": { nomeEmpresa: "Ex: Laminate Pros", responsavel: "Ex: John Doe", servicosAnuncios: "Ex: Laminate Installation" },
    "info-business": { nomeEmpresa: "Ex: Mentoria Alpha", responsavel: "Ex: João Mentor", servicosAnuncios: "Ex: Venda de Curso / Captação de Leads" },
    "health-beauty": { nomeEmpresa: "Ex: Estética Beauty", responsavel: "Ex: Maria Esteticista", servicosAnuncios: "Ex: Limpeza de Pele & Botox" },
    "real-estate": { nomeEmpresa: "Ex: Real Estate Homes", responsavel: "Ex: Carlos Corretor", servicosAnuncios: "Ex: Imóveis de Alto Padrão" },
    "b2b-saas": { nomeEmpresa: "Ex: Tech Solutions", responsavel: "Ex: Pedro CEO", servicosAnuncios: "Ex: ERP & Consultoria" },
    "ecommerce": { nomeEmpresa: "Ex: Store Online", responsavel: "Ex: Ana Lojista", servicosAnuncios: "Ex: Venda de Roupas & Acessórios" },
    "other": { nomeEmpresa: "Ex: Company LLC", responsavel: "Ex: John Doe", servicosAnuncios: "Ex: Serviço Principal" }
};

// --- Sub-components ---

export default function GeradorBriefing() {
    const [niche, setNiche] = useState("flooring")
    const [nicheOther, setNicheOther] = useState("")

    const currentPlaceholders = NICHE_PLACEHOLDERS[niche] || NICHE_PLACEHOLDERS.other;
    const currentGlsServices = NICHE_GLS_SERVICES[niche] || NICHE_GLS_SERVICES.other;

    const [data, setData] = useState<BriefingData>(INITIAL_STATE)
    const [outputAsana, setOutputAsana] = useState("")
    const [outputMissing, setOutputMissing] = useState("")
    const [tempServico, setTempServico] = useState("")
    const [tempIdioma, setTempIdioma] = useState("")
    const [tempPlataforma, setTempPlataforma] = useState("")
    const [tempDataComemorativa, setTempDataComemorativa] = useState("")
    const [tempNumeroComercial, setTempNumeroComercial] = useState("")
    const [tempServicoGLS, setTempServicoGLS] = useState("")
    const { copy, isCopied } = useClipboard()

    // Password visibility states
    const [showFbPass, setShowFbPass] = useState(false)
    const [showIgPass, setShowIgPass] = useState(false)
    const [showGmailPass, setShowGmailPass] = useState(false)

    // Control Local Services Inputs
    const [showLocal, setShowLocal] = useState({
        license: false,
        insurance: false,
        ssn: false,
        dl: false
    })

    const handleInputChange = (field: keyof BriefingData, value: string | string[]) => {
        let formattedValue = value;

        // Simple masks
        if (typeof value === 'string') {
            if (field === 'dataNascimento') {
                formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 10);
            }
            if (field === 'dataFundacao') {
                formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 7);
            }
        }

        setData(prev => ({ ...prev, [field]: formattedValue }))
    }

    const formatPhone = (value: string) => {
        const x = value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/);
        if (x) {
            return !x[2] ? x[1] : `+${x[1]} (${x[2]}) ${x[3]}${x[4] ? '-' + x[4] : ''}`;
        }
        return value;
    }

    const toggleArrayItem = (field: keyof BriefingData, item: string) => {
        const current = data[field] as string[]
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        setData(prev => ({ ...prev, [field]: updated }))
    }

    const addCustomTag = (field: keyof BriefingData, value: string, clearValue?: () => void) => {
        if (!value.trim()) return;
        const current = data[field] as string[];
        if (!current.includes(value)) {
            setData(prev => ({ ...prev, [field]: [...current, value] }));
        }
        if (clearValue) clearValue();
    }

    const removeCustomTag = (field: keyof BriefingData, value: string) => {
        const current = data[field] as string[];
        setData(prev => ({ ...prev, [field]: current.filter(i => i !== value) }));
    }

    const mergeValues = (selected: string[], custom?: string | string[]) => {
        const values = [...selected.filter(v => v !== "OUTRO")];
        if (selected.includes("OUTRO")) {
            if (Array.isArray(custom)) {
                values.push(...custom);
            } else if (custom && custom.trim() !== "") {
                values.push(custom);
            }
        }
        return Array.from(new Set(values));
    }

    const generateBriefing = () => {
        const companyName = data.nomeEmpresa || "CLIENTE";
        const date = new Date().toLocaleDateString('pt-BR');

        let briefing = `📋 BRIEFING DE PROJETO - ${companyName}\n`;
        briefing += `Nicho: ${niche === 'other' ? nicheOther : niche}\n`;
        briefing += `Gerado automaticamente via TS-TOOLS em ${date}\n`;
        briefing += `==================================================\n\n`;

        const addSection = (title: string, fields: { label: string, value: any }[]) => {
            const filledFields = fields.filter(f => {
                if (Array.isArray(f.value)) return f.value.length > 0;
                return f.value && f.value.toString().trim() !== "";
            });

            if (filledFields.length === 0) return "";

            let section = `[ ${title.toUpperCase()} ]\n`;
            section += `--------------------------------------------------\n`;
            filledFields.forEach(f => {
                let displayValue = "";
                if (Array.isArray(f.value)) {
                    displayValue = f.value.map(v => `• ${v}`).join("\n");
                } else {
                    displayValue = f.value;
                }
                section += `➤ ${f.label.toUpperCase()}:\n${displayValue}\n\n`;
            });
            section += `\n`;
            return section;
        };

        // Section mappings
        briefing += addSection("Perguntas Gerais", [
            { label: "Serviços/Produtos Contratados", value: mergeValues(data.servicosContratados, data.servicosContratadosCustom) },
            { label: "Responsável", value: data.responsavel },
            { label: "Data de Nascimento", value: data.dataNascimento },
            { label: "Nome da Empresa", value: data.nomeEmpresa },
            { label: "Data da Fundação", value: data.dataFundacao },
            { label: "Anos no Ramo", value: mergeValues(data.anosRamo, data.anosRamoCustom) },
            { label: "Endereço", value: data.endereco },
            { label: "Números Comerciais", value: data.numeroComercial },
            { label: "Experiência Marketing", value: data.experienciaMarketing },
            { label: "Plataformas utilizadas", value: mergeValues(data.plataformasMarketing, data.plataformasMarketingCustom) },
            { label: "Motivo fechou com TS", value: data.motivoFechouTS },
            { label: "Informações Comunicação", value: data.quaisInformacoesComunicacao },
            { label: "Sonhos Companhia", value: data.sonhosCompanhia },
            { label: "Referências Segmento", value: data.referenciasSegmento },
            { label: "Horários de Reunião", value: data.horariosReuniao },
            { label: "Horários Atendimento", value: data.horariosAtendimento },
        ]);

        briefing += addSection("Sobre a Empresa", [
            { label: "Breve História", value: data.historiaEmpresa },
            { label: "Quantidade de Pessoas", value: mergeValues(data.quantidadePessoas, data.quantidadePessoasCustom) },
            { label: "Selos e Parcerias", value: data.selosParcerias },
            { label: "Origem do Nome", value: data.origemNome },
            { label: "O que atrapalha a evolução", value: data.dificuldadeEvolucao },
            { label: "Aberto a Promoções", value: data.abertoPromocoes },
            { label: "Datas Comemorativas", value: mergeValues(data.datasComemorativas, data.datasComemorativasCustom) },
        ]);

        briefing += addSection("Sobre os Serviços", [
            { label: "Produtos ou Serviços", value: data.produtosServicos },
            { label: "Média de Valores", value: data.mediaValores },
            { label: "Principais Focos (Anúncios)", value: data.principaisServicosAnuncios },
            { label: "Serviços que NÃO faz", value: data.servicosNaoFaz },
            { label: "Diferenciais", value: data.diferenciais },
            { label: "Fotos e Vídeos", value: data.possuiFotosVideos },
            { label: "Banco de Imagens", value: data.problemaBancoImagens },
        ]);

        briefing += addSection("Sobre o Público", [
            { label: "Perfil do Cliente", value: data.perfilCliente },
            { label: "Problemas Frequentes", value: data.problemasFrequentes },
            { label: "Experiência Marcante", value: data.experienciaMarcante },
            { label: "Dúvidas Frequentes", value: data.duvidasFrequentes },
            { label: "Nacionalidade Cliente", value: data.nacionalidadeCliente },
            { label: "Meio de Contato Preferido", value: data.meioContatoPreferido },
            { label: "Primeiro Atendimento", value: data.primeiroAtendimento },
            { label: "Envio de Orçamento", value: data.comoEnviaOrcamento },
            { label: "Uniforme Vistas", value: data.uniformeVistas },
            { label: "Números Recomendar", value: data.numerosRecomendar },
            { label: "Amostras", value: data.amostrasPisos },
            { label: "Portfolio Visitas", value: data.portfolioVisitas },
        ]);

        briefing += addSection("Design", [
            { label: "Idiomas de Atendimento", value: mergeValues(data.idiomas, data.idiomasCustom) },
            { label: "Identidade Visual", value: data.identidadeVisual },
            { label: "Vetor/PDF", value: data.vetorPdf },
            { label: "Referências Logo", value: data.referenciasLogo },
            { label: "Estilo Logo", value: data.estiloLogo },
            { label: "Cores Transmitir", value: data.coresTransmitir },
            { label: "Cores NÃO quer", value: data.coresNaoQuer },
            { label: "Obrigatório na Logo", value: data.obrigatorioLogo },
            { label: "Cartão de Visitas", value: data.cartaoVisitas },
            { label: "Informações Cartão", value: data.informacoesCartao },
            { label: "Plotagem Veículo", value: data.plotagemVeiculo },
            { label: "Tipo Plotagem", value: data.tipoPlotagem },
        ]);

        briefing += addSection("Webdesign", [
            { label: "Hospedagem/Domínio", value: data.conheceHospedagemDominio },
            { label: "Possui Site", value: data.possuiSite },
            { label: "Manter Domínio", value: data.manterDominio },
            { label: "Hospedagem Atual", value: data.hospedagemAtual },
            { label: "Manter Hospedagem", value: data.manterHospedagem },
            { label: "Email Profissional", value: data.emailProfissional },
            { label: "Transferir Emails", value: data.transferirEmails },
            { label: "Referências Sites", value: data.referenciasSites },
            { label: "Obrigatório Site", value: data.obrigatorioSite },
            { label: "Tipo de Negócio", value: data.tipoNegocio },
        ]);

        briefing += addSection("Social Media", [
            { label: "Facilidade Redes", value: data.facilidadeRedes },
            { label: "Comunicação Clientes", value: mergeValues(data.comunicacaoClientes, data.comunicacaoClientesCustom) },
            { label: "Preferência Posts", value: data.preferenciaPosts },
            { label: "Acesso Materiais", value: data.disponibilidadeMateriais },
            { label: "Referências Instagram", value: data.referenciasInstagram },
            { label: "Layout Artes", value: data.layoutArtes },
            { label: "Layout Fotos", value: data.layoutFotos },
            { label: "Estilo Musical NÃO", value: data.estiloMusicalNao },
            { label: "Termos Inglês (SIM)", value: data.termosInglesSim },
            { label: "Termos Inglês (NÃO)", value: data.termosInglesNao },
        ]);

        briefing += addSection("Tráfego Pago", [
            { label: "Experiencia Anuncios", value: data.experienciaAnuncios },
            { label: "Regiao Atuacao", value: data.regiaoAtuacao },
            { label: "Faturamento Atual/Projecao", value: data.faturamentoAtualDesejo },
            { label: "Fechamentos Atual/Projecao", value: data.fechamentosMesProjecao },
            { label: "Ticket Medio", value: data.ticketMedio },
            { label: "Margem Lucro %", value: data.margemLucro },
            { label: "Investimento Semanal/Mes", value: data.investimentoDisponivel },
            { label: "CPL Esperado", value: data.cplEsperado },
            { label: "Expectativa Leads", value: data.expectativaLeads },
            { label: "CPA Esperado", value: data.cpaEsperado },
        ]);

        briefing += addSection("Google My Business", [
            { label: "Conhece GMB", value: data.conheceGMB },
        ]);

        briefing += addSection("Local Services", [
            { label: "License Empresa", value: data.licenseEmpresa },
            { label: "Seguro Liability", value: data.seguroLiability },
            { label: "SSN ou ITIN", value: data.ssnItin },
            { label: "DL ou Passaporte Americano?", value: data.driveLicensePassaporte },
            { label: "Serviços GLS", value: mergeValues(data.servicosAtivosGLS, data.servicosAtivosGLSCustom) },
        ]);

        briefing += addSection("Acessos", [
            { label: "Facebook Login", value: data.fbLogin },
            { label: "Facebook Senha", value: data.fbPass },
            { label: "Instagram Login", value: data.igLogin },
            { label: "Instagram Senha", value: data.igPass },
            { label: "Gmail Login", value: data.gmailLogin },
            { label: "Gmail Senha", value: data.gmailPass },
        ]);

        briefing += addSection("Mais", [
            { label: "Informações Adicionais", value: data.informacoesAdicionais },
        ]);

        briefing += `\nEste é um documento confidencial - TS TOOLS © ${new Date().getFullYear()}`;
        setOutputAsana(briefing);

        // Calculate Missing Fields
        const missingFields: string[] = [];
        const excludedFields = ["datasComemorativas", "plataformasMarketing", "servicosAtivosGLS", "fbPass", "igPass", "gmailPass"];

        Object.keys(INITIAL_STATE).forEach(key => {
            if (excludedFields.includes(key)) return;
            const val = data[key as keyof BriefingData];
            if (!val || (val.toString().trim() === "") || (Array.isArray(val) && val.length === 0)) {
                missingFields.push(key);
            }
        });

        if (missingFields.length > 0) {
            let missingTxt = `⚠️ PENDÊNCIAS DE BRIEFING - ${companyName}\n`;
            missingTxt += `--------------------------------------------------\n`;
            missingTxt += `Por favor, responda aos itens abaixo para prosseguirmos:\n\n`;
            missingFields.forEach(f => {
                const label = f.replace(/([A-Z])/g, ' $1').toLowerCase();
                missingTxt += `☐ ${label.charAt(0).toUpperCase() + label.slice(1)}\n`;
            });
            setOutputMissing(missingTxt);
        } else {
            setOutputMissing("");
        }

        toast.success("Briefing gerado com sucesso!")
    }

    const sections = [
        { id: "geral", label: "Geral", icon: <User size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "empresa", label: "Empresa", icon: <Building2 size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "servicos", label: "Serviços", icon: <Briefcase size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "publico", label: "Público", icon: <Users size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "design", label: "Design", icon: <Palette size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "webdesign", label: "Webdesign", icon: <Globe size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "marketing", label: "Marketing", icon: <Share2 size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "acessos", label: "Acessos", icon: <Lock size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
        { id: "mais", label: "Mais", icon: <Settings size={20} style={{ color: '#ffa300' }} />, color: "border-[#ffa300]/50 text-[#ffa300]" },
    ];

    return (
        <div className="flex-1 w-full relative font-sans">
            <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 md:py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-fade-up">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white shadow-xl">
                                <FileCheck size={28} />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground">
                                Briefing <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Generator</span>
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-lg font-medium max-w-xl">
                            Otimizado para <span className="text-foreground font-bold italic">Asana</span>. Estruture o sucesso do projeto desde o primeiro contato.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => { setData(INITIAL_STATE); setOutputAsana(""); setOutputMissing(""); }}
                            className="h-14 px-6 rounded-2xl border-border font-bold text-muted-foreground hover:bg-muted"
                        >
                            <Clock size={20} className="mr-2 opacity-50" />
                            Limpar
                        </Button>
                        <Button
                            onClick={generateBriefing}
                            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                        >
                            <Wand2 size={20} className="mr-2" />
                            Gerar Briefing
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Form Column */}
                    <Card className="lg:col-span-8 rounded-[32px] border-border shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <Tabs defaultValue="geral" className="w-full">
                            <div className="px-4 md:px-6 pt-6 w-full">
                                <div className="bg-muted/50 rounded-2xl p-1 overflow-x-auto no-scrollbar border border-border/50 flex w-full">
                                    <TabsList className="h-12 bg-transparent w-full flex justify-between gap-1 flex-nowrap border-0 shadow-none px-1">
                                        {sections.map(s => (
                                            <TabsTrigger
                                                key={s.id}
                                                value={s.id}
                                                className={cn(
                                                    "flex-1 h-full rounded-xl group flex items-center justify-center transition-all duration-300 ease-in-out whitespace-nowrap outline-none",
                                                    "data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-[#ffa300] data-[state=active]:px-4",
                                                    "px-3 text-muted-foreground/50 hover:bg-white/5 data-[state=active]:hover:bg-card"
                                                )}
                                            >
                                                <div className="shrink-0 transition-colors opacity-70 group-hover:opacity-100 group-data-[state=active]:opacity-100">
                                                    {s.icon}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-tighter shrink-0 overflow-hidden max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 group-data-[state=active]:max-w-[100px] group-data-[state=active]:opacity-100 group-data-[state=active]:ml-2 transition-all duration-300 ease-in-out">
                                                    {s.label}
                                                </span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </div>

                            <ScrollArea className="h-[700px]">
                                <CardContent className="p-8">
                                    <TabsContent value="geral" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4 md:col-span-2">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <Briefcase size={16} style={{ color: '#ffa300' }} /> Serviços/Produtos Contratados
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            "Identidade visual",
                                                            "Social Media",
                                                            "Pontual",
                                                            "Recorrência",
                                                            "Estrutura",
                                                            "Google My Business",
                                                            "Google Ads",
                                                            "Meta Ads",
                                                            "OUTRO"
                                                        ].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => toggleArrayItem('servicosContratados', opt)}
                                                                className={cn(
                                                                    "cursor-pointer px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    data.servicosContratados.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                {data.servicosContratados.includes("OUTRO") && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                        {data.servicosContratadosCustom.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-muted/10 border border-muted-foreground/10">
                                                                {data.servicosContratadosCustom.map(tag => (
                                                                    <Badge
                                                                        key={tag}
                                                                        className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold"
                                                                    >
                                                                        {tag}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removeCustomTag('servicosContratadosCustom', tag);
                                                                            }}
                                                                            className="cursor-pointer hover:text-white transition-colors"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Adicionar serviço (Ex: SEO, Copywriting)..."
                                                                value={tempServico}
                                                                onChange={e => setTempServico(e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        addCustomTag('servicosContratadosCustom', tempServico);
                                                                    }
                                                                }}
                                                                className="h-12 rounded-xl"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => addCustomTag('servicosContratadosCustom', tempServico)}
                                                                className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
                                                            >
                                                                Adicionar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <User size={16} style={{ color: '#ffa300' }} /> Nome do responsável
                                                </Label>
                                                <Input placeholder={currentPlaceholders.responsavel} value={data.responsavel} onChange={e => handleInputChange('responsavel', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Building2 size={16} style={{ color: '#ffa300' }} /> Nome da empresa
                                                </Label>
                                                <Input placeholder={currentPlaceholders.nomeEmpresa} value={data.nomeEmpresa} onChange={e => handleInputChange('nomeEmpresa', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Phone size={16} style={{ color: '#ffa300' }} /> Número comercial (WhatsApp)
                                                </Label>
                                                {data.numeroComercial.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-2 p-3 rounded-xl bg-muted/10 border border-muted-foreground/10">
                                                        {data.numeroComercial.map(num => (
                                                            <Badge key={num} className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold">
                                                                {num}
                                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeCustomTag('numeroComercial', num); }} className="cursor-pointer hover:text-white transition-colors">
                                                                    <X size={14} />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="+1 (123) 456-7890"
                                                        value={tempNumeroComercial}
                                                        onChange={e => setTempNumeroComercial(formatPhone(e.target.value))}
                                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag('numeroComercial', tempNumeroComercial, () => setTempNumeroComercial("")))}
                                                        className="h-12 rounded-xl"
                                                    />
                                                    <Button type="button" onClick={() => addCustomTag('numeroComercial', tempNumeroComercial, () => setTempNumeroComercial(""))} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs">
                                                        Adicionar
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Target size={16} style={{ color: '#ffa300' }} /> Nicho de Atuação
                                                </Label>
                                                <Select value={niche} onValueChange={(val) => {
                                                    setNiche(val);
                                                    setData(prev => ({ ...prev, servicosAtivosGLS: [] }));
                                                }}>
                                                    <SelectTrigger className="bg-card h-12 rounded-xl">
                                                        <SelectValue placeholder="Selecione o nicho..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2">
                                                                🇺🇸 Home Services (USA)
                                                            </SelectLabel>
                                                            <SelectItem value="construction">Construction / Remodeling</SelectItem>
                                                            <SelectItem value="roofing">Roofing</SelectItem>
                                                            <SelectItem value="painting">Painting</SelectItem>
                                                            <SelectItem value="hvac">HVAC</SelectItem>
                                                            <SelectItem value="plumbing">Plumbing</SelectItem>
                                                            <SelectItem value="electrical">Electrical</SelectItem>
                                                            <SelectItem value="cleaning">Cleaning / Maid Services</SelectItem>
                                                            <SelectItem value="landscaping">Landscaping</SelectItem>
                                                            <SelectItem value="flooring">Flooring (Geral)</SelectItem>
                                                            <SelectItem value="hardwood-flooring">Hardwood Flooring</SelectItem>
                                                            <SelectItem value="luxury-vinyl-plank">Luxury Vinyl Plank (LVP)</SelectItem>
                                                            <SelectItem value="laminate-flooring">Laminate Flooring</SelectItem>
                                                        </SelectGroup>
                                                        <SelectGroup>
                                                            <SelectLabel className="bg-muted uppercase text-[10px] font-black tracking-widest px-4 py-2 mt-2">
                                                                🌎 Outros Mercados
                                                            </SelectLabel>
                                                            <SelectItem value="info-business">Infoprodutos / Mentorias</SelectItem>
                                                            <SelectItem value="health-beauty">Saúde, Estética e Beleza</SelectItem>
                                                            <SelectItem value="real-estate">Imóveis / Corretores</SelectItem>
                                                            <SelectItem value="b2b-saas">B2B / Software (SaaS)</SelectItem>
                                                            <SelectItem value="ecommerce">E-commerce / Físicos</SelectItem>
                                                        </SelectGroup>
                                                        <SelectItem value="other">Outro (Personalizado)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {niche === "other" && (
                                                    <Input
                                                        placeholder="Especifique o nicho..."
                                                        value={nicheOther}
                                                        onChange={(e) => setNicheOther(e.target.value)}
                                                        className="mt-2 h-12 rounded-xl"
                                                    />
                                                )}
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <MapPin size={16} style={{ color: '#ffa300' }} /> Endereço completo (Rua, Cidade, Estado)
                                                </Label>
                                                <Input placeholder="123 Main St, Miami, FL" value={data.endereco} onChange={e => handleInputChange('endereco', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-4 md:col-span-2">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <Globe size={16} style={{ color: '#ffa300' }} /> Idiomas de Atendimento
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2 text-white/90">
                                                        {["PORTUGUÊS", "INGLÊS", "ESPANHOL", "OUTRO"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => toggleArrayItem('idiomas', opt)}
                                                                className={cn(
                                                                    "cursor-pointer px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    data.idiomas.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                {data.idiomas.includes("OUTRO") && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                        {data.idiomasCustom.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-muted/10 border border-muted-foreground/10">
                                                                {data.idiomasCustom.map(tag => (
                                                                    <Badge key={tag} className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold">
                                                                        {tag}
                                                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeCustomTag('idiomasCustom', tag); }} className="cursor-pointer hover:text-white transition-colors">
                                                                            <X size={14} />
                                                                        </button>
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Adicionar idioma..."
                                                                value={tempIdioma}
                                                                onChange={e => setTempIdioma(e.target.value)}
                                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag('idiomasCustom', tempIdioma, () => setTempIdioma("")))}
                                                                className="h-12 rounded-xl"
                                                            />
                                                            <Button type="button" onClick={() => addCustomTag('idiomasCustom', tempIdioma, () => setTempIdioma(""))} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs">
                                                                Adicionar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Settings size={16} style={{ color: '#ffa300' }} /> Sistema Interno / CRM
                                                </Label>
                                                <Input placeholder="Ex: Practice Q, Symplast, CRM GoHighLevel" value={data.sistemasInternos} onChange={e => handleInputChange('sistemasInternos', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Calendar size={16} style={{ color: '#ffa300' }} /> Data de Nascimento
                                                </Label>
                                                <Input maxLength={10} placeholder="DD/MM/AAAA" value={data.dataNascimento} onChange={e => handleInputChange('dataNascimento', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Clock size={16} style={{ color: '#ffa300' }} /> Data da Fundação
                                                </Label>
                                                <Input maxLength={7} placeholder="MM/AAAA" value={data.dataFundacao} onChange={e => handleInputChange('dataFundacao', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Clock size={16} style={{ color: '#ffa300' }} /> Anos no ramo
                                                </Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["< 1 ano", "1-3 anos", "3-5 anos", "5-10 anos", "10+ anos", "OUTRO"].map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="outline"
                                                            onClick={() => toggleArrayItem('anosRamo', opt)}
                                                            className={cn(
                                                                "cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                                                                data.anosRamo.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                {data.anosRamo.includes("OUTRO") && (
                                                    <Input placeholder="Especifique os anos..." value={data.anosRamoCustom} onChange={e => handleInputChange('anosRamoCustom', e.target.value)} className="h-10 rounded-xl mt-2 text-[11px]" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Globe size={16} style={{ color: '#ffa300' }} /> Plataformas já utilizadas
                                                </Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {PLATFORMS_OPTIONS.map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="outline"
                                                            onClick={() => toggleArrayItem('plataformasMarketing', opt)}
                                                            className={cn(
                                                                "cursor-pointer px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                                                                data.plataformasMarketing.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {data.plataformasMarketing.includes("OUTRO") && (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                    {data.plataformasMarketingCustom.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-muted/10 border border-muted-foreground/10">
                                                            {data.plataformasMarketingCustom.map(tag => (
                                                                <Badge key={tag} className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold">
                                                                    {tag}
                                                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeCustomTag('plataformasMarketingCustom', tag); }} className="cursor-pointer hover:text-white transition-colors text-white">
                                                                        <X size={14} />
                                                                    </button>
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Adicionar plataforma..."
                                                            value={tempPlataforma}
                                                            onChange={e => setTempPlataforma(e.target.value)}
                                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag('plataformasMarketingCustom', tempPlataforma, () => setTempPlataforma("")))}
                                                            className="h-12 rounded-xl"
                                                        />
                                                        <Button type="button" onClick={() => addCustomTag('plataformasMarketingCustom', tempPlataforma, () => setTempPlataforma(""))} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs">
                                                            Adicionar
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Sparkles size={16} style={{ color: '#ffa300' }} /> O que fez você fechar com o TS?
                                                </Label>
                                                <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.motivoFechouTS} onChange={e => handleInputChange('motivoFechouTS', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <FileCheck size={16} style={{ color: '#ffa300' }} /> Informações sobre você/sócio para trabalhar na comunicação (certificados, cursos)
                                                </Label>
                                                <Textarea placeholder="..." className="resize-none rounded-2xl" rows={3} value={data.quaisInformacoesComunicacao} onChange={e => handleInputChange('quaisInformacoesComunicacao', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Star size={16} style={{ color: '#ffa300' }} /> Sonhos que pretende realizar com a companhia?
                                                </Label>
                                                <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.sonhosCompanhia} onChange={e => handleInputChange('sonhosCompanhia', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Search size={16} style={{ color: '#ffa300' }} /> Referências do segmento (Personalidades, empresas)
                                                </Label>
                                                <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.referenciasSegmento} onChange={e => handleInputChange('referenciasSegmento', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <Clock size={16} style={{ color: '#ffa300' }} /> Disponibilidade Reuniões (Horário BR)
                                                    </Label>
                                                    <Input placeholder="Ex: 14h às 18h" value={data.horariosReuniao} onChange={e => handleInputChange('horariosReuniao', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <Clock size={16} style={{ color: '#ffa300' }} /> Horários/Dias Funcionamento Empresa
                                                    </Label>
                                                    <Input placeholder="Ex: Mon-Fri 8am-6pm" value={data.horariosAtendimento} onChange={e => handleInputChange('horariosAtendimento', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="empresa" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <FileCheck size={16} style={{ color: '#ffa300' }} /> Breve história da sua empresa
                                                </Label>
                                                <Textarea placeholder="Como começou, o que deseja..." className="resize-none rounded-2xl" rows={4} value={data.historiaEmpresa} onChange={e => handleInputChange('historiaEmpresa', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <Users size={16} style={{ color: '#ffa300' }} /> Quantas pessoas trabalham?
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {["1-3", "4-7", "8-15", "15+", "OUTRO"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => toggleArrayItem('quantidadePessoas', opt)}
                                                                className={cn(
                                                                    "cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                                                    data.quantidadePessoas.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {data.quantidadePessoas.includes("OUTRO") && (
                                                        <Input placeholder="Especifique a quantidade..." value={data.quantidadePessoasCustom} onChange={e => handleInputChange('quantidadePessoasCustom', e.target.value)} className="h-10 rounded-xl mt-2 text-[11px]" />
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <Badge size={16} style={{ color: '#ffa300' }} /> Companhia tem selos ou parcerias?
                                                    </Label>
                                                    <Input placeholder="Ex: NWFA, Yelp Guaranteed" value={data.selosParcerias} onChange={e => handleInputChange('selosParcerias', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <PenTool size={16} style={{ color: '#ffa300' }} /> Como surgiu o nome da empresa?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.origemNome} onChange={e => handleInputChange('origemNome', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <AlertCircle size={16} style={{ color: '#ffa300' }} /> O que sente que atrapalha a evolução?
                                                    </Label>
                                                    <Textarea placeholder="Ex: Falta de visibilidade" className="resize-none rounded-2xl" rows={2} value={data.dificuldadeEvolucao} onChange={e => handleInputChange('dificuldadeEvolucao', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Sparkles size={16} style={{ color: '#ffa300' }} /> Aberto a fazer promoções/ofertas em datas comemorativas?
                                                </Label>
                                                <Input placeholder="Ex: 10% OFF em Março" value={data.abertoPromocoes} onChange={e => handleInputChange('abertoPromocoes', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <Calendar size={16} style={{ color: '#ffa300' }} /> Datas comemorativas para focar
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {HOLIDAYS_OPTIONS.map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => toggleArrayItem('datasComemorativas', opt)}
                                                                className={cn(
                                                                    "cursor-pointer px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all",
                                                                    data.datasComemorativas.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                {data.datasComemorativas.includes("OUTRO") && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                        {data.datasComemorativasCustom.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-muted/10 border border-muted-foreground/10">
                                                                {data.datasComemorativasCustom.map(tag => (
                                                                    <Badge key={tag} className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold">
                                                                        {tag}
                                                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeCustomTag('datasComemorativasCustom', tag); }} className="cursor-pointer hover:text-white transition-colors">
                                                                            <X size={14} />
                                                                        </button>
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Adicionar data personalizada..."
                                                                value={tempDataComemorativa}
                                                                onChange={e => setTempDataComemorativa(e.target.value)}
                                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag('datasComemorativasCustom', tempDataComemorativa, () => setTempDataComemorativa("")))}
                                                                className="h-12 rounded-xl"
                                                            />
                                                            <Button type="button" onClick={() => addCustomTag('datasComemorativasCustom', tempDataComemorativa, () => setTempDataComemorativa(""))} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs">
                                                                Adicionar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="servicos" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-white/90 flex items-center gap-2">
                                                    <Briefcase size={16} style={{ color: '#ffa300' }} /> Produtos ou Serviços (Descrição detalhada de cada)
                                                </Label>
                                                <Textarea placeholder="..." className="resize-none rounded-2xl" rows={6} value={data.produtosServicos} onChange={e => handleInputChange('produtosServicos', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <ClipboardCheck size={16} style={{ color: '#ffa300' }} /> Média de valores (cada tipo de serviço)
                                                    </Label>
                                                    <Input placeholder="$2500 - $3500 avg" value={data.mediaValores} onChange={e => handleInputChange('mediaValores', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Target size={16} style={{ color: '#ffa300' }} /> 2 Principais serviços foco para anúncios
                                                    </Label>
                                                    <Input placeholder={currentPlaceholders.servicosAnuncios} value={data.principaisServicosAnuncios} onChange={e => handleInputChange('principaisServicosAnuncios', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <PenTool size={16} style={{ color: '#ffa300' }} /> Algum trabalho que NÃO faz?
                                                    </Label>
                                                    <Input placeholder="Ex: Tirar entulho, mover móveis" value={data.servicosNaoFaz} onChange={e => handleInputChange('servicosNaoFaz', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Sparkles size={16} style={{ color: '#ffa300' }} /> Maiores Diferenciais
                                                    </Label>
                                                    <Textarea placeholder="Ex: 20 anos de experiência, atendimento em 3 idiomas, tratamentos personalizados..." value={data.diferenciais} onChange={e => handleInputChange('diferenciais', e.target.value)} className="min-h-[100px] rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <FileCheck size={16} style={{ color: '#ffa300' }} /> Possui fotos e vídeos dos trabalhos?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não", "Gravar"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('possuiFotosVideos', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    data.possuiFotosVideos === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <ImageIcon size={16} style={{ color: '#ffa300' }} /> Problema com fotos de banco?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('problemaBancoImagens', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    data.problemaBancoImagens === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="publico" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-white/90 flex items-center gap-2">
                                                    <Users size={16} style={{ color: '#ffa300' }} /> Perfil do seu cliente (Gênero, Idade, Classe, Interesses)
                                                </Label>
                                                <Textarea placeholder="Traçar Clientes em Potencial..." className="resize-none rounded-2xl" rows={4} value={data.perfilCliente} onChange={e => handleInputChange('perfilCliente', e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <AlertCircle size={16} style={{ color: '#ffa300' }} /> Problemas frequentes vistos nas visitas
                                                    </Label>
                                                    <Input placeholder="Ex: Pisos riscados, desgastados" value={data.problemasFrequentes} onChange={e => handleInputChange('problemasFrequentes', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Star size={16} style={{ color: '#ffa300' }} /> Experiência mais marcante com cliente
                                                    </Label>
                                                    <Input placeholder="..." value={data.experienciaMarcante} onChange={e => handleInputChange('experienciaMarcante', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <HelpCircle size={16} style={{ color: '#ffa300' }} /> Dúvidas frequentes do cliente (principais perguntas)
                                                    </Label>
                                                    <Textarea placeholder="Tempo de obra? Resistência à água?..." className="resize-none rounded-2xl" rows={3} value={data.duvidasFrequentes} onChange={e => handleInputChange('duvidasFrequentes', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Globe size={16} style={{ color: '#ffa300' }} /> Cliente é Brasileiro ou Americano?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.nacionalidadeCliente} onChange={e => handleInputChange('nacionalidadeCliente', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Mail size={16} style={{ color: '#ffa300' }} /> Meio de contato preferido do cliente
                                                    </Label>
                                                    <Textarea placeholder="Messenger, SMS, WhatsApp..." className="resize-none rounded-2xl" rows={2} value={data.meioContatoPreferido} onChange={e => handleInputChange('meioContatoPreferido', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <User size={16} style={{ color: '#ffa300' }} /> Como é feito o 1º atendimento?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.primeiroAtendimento} onChange={e => handleInputChange('primeiroAtendimento', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <FileCheck size={16} style={{ color: '#ffa300' }} /> Como envia o orçamento?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.comoEnviaOrcamento} onChange={e => handleInputChange('comoEnviaOrcamento', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Sparkles size={16} style={{ color: '#ffa300' }} /> Tem uniforme para as visitas?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.uniformeVistas} onChange={e => handleInputChange('uniformeVistas', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Phone size={16} style={{ color: '#ffa300' }} /> Tem clientes para recomendar?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.numerosRecomendar} onChange={e => handleInputChange('numerosRecomendar', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Palette size={16} style={{ color: '#ffa300' }} /> Anda com amostras de pisos?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.amostrasPisos} onChange={e => handleInputChange('amostrasPisos', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Layout size={16} style={{ color: '#ffa300' }} /> Possui portfólio físico/digital em mãos?
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={2} value={data.portfolioVisitas} onChange={e => handleInputChange('portfolioVisitas', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>

                                    </TabsContent>

                                    <TabsContent value="design" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Palette size={16} style={{ color: '#ffa300' }} /> Já possui Identidade Visual? (Gostaria de manter?)
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {["Sim e quero manter (VETORIZAÇÃO)", "Sim e quero mudar", "Não", "Rebranding"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('identidadeVisual', opt)}
                                                                className={cn(
                                                                    "cursor-pointer w-full py-4 flex items-center justify-center text-center rounded-xl text-[9px] font-bold uppercase transition-all leading-tight px-2",
                                                                    data.identidadeVisual === opt ? "bg-primary/10 text-primary border-primary shadow-sm shadow-primary/10" : "hover:bg-muted/50 border-border/50"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <FileCheck size={16} style={{ color: '#ffa300' }} /> Tem a versão em VETOR/PDF da Logo?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('vetorPdf', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    data.vetorPdf === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Search size={16} style={{ color: '#ffa300' }} /> Referências Visuais (Cite 3 logos que gosta)
                                                    </Label>
                                                    <Input placeholder="..." value={data.referenciasLogo} onChange={e => handleInputChange('referenciasLogo', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <a 
                                                        href="https://drive.google.com/file/d/1GyTJxS-WhkaxbkTS_jDoP_HfcqNBDVTu/view" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ffa300] hover:text-[#ffa300]/80 transition-colors w-fit bg-[#ffa300]/10 px-4 py-2 rounded-lg border border-[#ffa300]/20 mb-2"
                                                    >
                                                        <Search size={14} />
                                                        Clique aqui para ver referências de Estilos e Cores
                                                    </a>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Palette size={16} style={{ color: '#ffa300' }} /> Estilo de Logo preferido
                                                    </Label>
                                                    <Input placeholder="..." value={data.estiloLogo} onChange={e => handleInputChange('estiloLogo', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Sparkles size={16} style={{ color: '#ffa300' }} /> O que quer transmitir? (Cores)
                                                    </Label>
                                                    <Input placeholder="..." value={data.coresTransmitir} onChange={e => handleInputChange('coresTransmitir', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <AlertCircle size={16} style={{ color: '#ffa300' }} /> Cores que NÃO quer na logo
                                                    </Label>
                                                    <Input placeholder="..." value={data.coresNaoQuer} onChange={e => handleInputChange('coresNaoQuer', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Lock size={16} style={{ color: '#ffa300' }} /> O que não pode faltar na logo?
                                                    </Label>
                                                    <Input placeholder="..." value={data.obrigatorioLogo} onChange={e => handleInputChange('obrigatorioLogo', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2 text-white/90 border-t border-red-500/10 pt-4 md:col-span-2">
                                                    <Label className="font-bold flex items-center gap-2">
                                                        <ClipboardCheck size={16} style={{ color: '#ffa300' }} /> Cartão de visitas (Borda arredondada ou reta?)
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Borda Reta", "Borda Arredondada"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('cartaoVisitas', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    data.cartaoVisitas === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-white/90 md:col-span-2">
                                                    <Label className="font-bold flex items-center gap-2">
                                                        <Settings size={16} style={{ color: '#ffa300' }} /> Informações desejadas no cartão (Nome, tel, qr code...)
                                                    </Label>
                                                    <Input placeholder="..." value={data.informacoesCartao} onChange={e => handleInputChange('informacoesCartao', e.target.value)} className="h-12 rounded-xl mt-2" />
                                                </div>
                                                <div className="space-y-2 text-white/90 border-t border-red-500/10 pt-4 md:col-span-2">
                                                    <Label className="font-bold italic flex items-center gap-2">
                                                        <MapPin size={16} style={{ color: '#ffa300' }} /> Plotagem de veículo? (Modelo, cor e ano)
                                                    </Label>
                                                    <Input placeholder="..." value={data.plotagemVeiculo} onChange={e => handleInputChange('plotagemVeiculo', e.target.value)} className="h-12 rounded-xl mt-2" />
                                                    <p className="text-[10px] opacity-50 uppercase font-bold mt-1">⚠️ Plotagem total requer alteração no documento του βεικύλο.</p>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Layout size={16} style={{ color: '#ffa300' }} /> Tipo de plotagem (Adesivagem, Ímã ou Completa)
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Adesivagem", "Ímã", "Completa"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('tipoPlotagem', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    data.tipoPlotagem === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="webdesign" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <HelpCircle size={16} style={{ color: '#ffa300' }} /> Entende Hospedagem/Domínio?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não", "Básico"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('conheceHospedagemDominio', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black transition-all",
                                                                    data.conheceHospedagemDominio === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Globe size={16} style={{ color: '#ffa300' }} /> Já possui site?
                                                    </Label>
                                                    <Input placeholder="Qual domínio atual?" value={data.possuiSite} onChange={e => handleInputChange('possuiSite', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Share2 size={16} style={{ color: '#ffa300' }} /> Transferir emails p/ HOSTINGER?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não", "Não sei"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('transferirEmails', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black transition-all",
                                                                    data.transferirEmails === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2 md:col-span-2 border-t border-purple-500/10 pt-4">
                                                    <Label className="font-bold text-white/90 italic flex items-center gap-2">
                                                        <Search size={16} style={{ color: '#ffa300' }} /> Referências de sites (Cite no mínimo 3)
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl mt-2" rows={3} value={data.referenciasSites} onChange={e => handleInputChange('referenciasSites', e.target.value)} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <ClipboardCheck size={16} style={{ color: '#ffa300' }} /> O que NÃO pode faltar no site? (Reviews, FAQ, Portfólio...)
                                                    </Label>
                                                    <Textarea placeholder="..." className="resize-none rounded-2xl" rows={3} value={data.obrigatorioSite} onChange={e => handleInputChange('obrigatorioSite', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Settings size={16} style={{ color: '#ffa300' }} /> Tipo de Negócio (Produto, Serviço...)
                                                    </Label>
                                                    <Input placeholder="..." value={data.tipoNegocio} onChange={e => handleInputChange('tipoNegocio', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="marketing" className="m-0 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-black uppercase tracking-widest text-white/90 flex items-center gap-2">
                                                <Share2 size={24} style={{ color: '#ffa300' }} /> Social Media
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Settings size={16} style={{ color: '#ffa300' }} /> Facilidade com Redes
                                                    </Label>
                                                    <div className="flex gap-2 flex-col">
                                                        <div className="flex gap-2">
                                                            {["Baixa", "Média", "Alta"].map(opt => (
                                                                <Badge
                                                                    key={opt}
                                                                    variant="outline"
                                                                    onClick={() => handleInputChange('facilidadeRedes', opt)}
                                                                    className={cn(
                                                                        "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black transition-all",
                                                                        data.facilidadeRedes === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                    )}
                                                                >
                                                                    {opt}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Users size={16} style={{ color: '#ffa300' }} /> Tom de Comunicação
                                                    </Label>
                                                    <div className="flex gap-2 flex-col">
                                                        <div className="flex gap-2">
                                                            {["Formal", "Direto", "Divertido", "OUTRO"].map(opt => (
                                                                <Badge
                                                                    key={opt}
                                                                    variant="outline"
                                                                    onClick={() => toggleArrayItem('comunicacaoClientes', opt)}
                                                                    className={cn(
                                                                        "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black transition-all",
                                                                        data.comunicacaoClientes.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                    )}
                                                                >
                                                                    {opt}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        {data.comunicacaoClientes.includes("OUTRO") && (
                                                            <Input placeholder="Especifique..." value={data.comunicacaoClientesCustom} onChange={e => handleInputChange('comunicacaoClientesCustom', e.target.value)} className="h-10 rounded-xl mt-2 text-[11px]" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Clock size={16} style={{ color: '#ffa300' }} /> Preferência para Posts / Disponibilidade p/ enviar Materiais
                                                    </Label>
                                                    <Input placeholder="..." value={data.preferenciaPosts} onChange={e => handleInputChange('preferenciaPosts', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Instagram size={16} style={{ color: '#ffa300' }} /> Referências de Instagram (Cite no mínimo 3)
                                                    </Label>
                                                    <Input placeholder="..." value={data.referenciasInstagram} onChange={e => handleInputChange('referenciasInstagram', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Palette size={16} style={{ color: '#ffa300' }} /> Layout das Artes (Logo na foto, Marca d'água...)
                                                    </Label>
                                                    <Input placeholder="..." value={data.layoutArtes} onChange={e => handleInputChange('layoutArtes', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Star size={16} style={{ color: '#ffa300' }} /> Músicas que NÃO gostaria de ver nos vídeos
                                                    </Label>
                                                    <Input placeholder="..." value={data.estiloMusicalNao} onChange={e => handleInputChange('estiloMusicalNao', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-12 border-t border-white/10">
                                            <h3 className="text-lg font-black uppercase tracking-widest text-white/90 flex items-center gap-2">
                                                <TrendingUp size={24} style={{ color: '#ffa300' }} /> Tráfego Pago
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Target size={16} style={{ color: '#ffa300' }} /> Já fez anúncios no FB ou Google Ads? Como foi?
                                                    </Label>
                                                    <Input placeholder="..." value={data.experienciaAnuncios} onChange={e => handleInputChange('experienciaAnuncios', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <MapPin size={16} style={{ color: '#ffa300' }} /> Região que atua (Raio, ZIP CODE, Exclusão?)
                                                    </Label>
                                                    <Input placeholder="..." value={data.regiaoAtuacao} onChange={e => handleInputChange('regiaoAtuacao', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <TrendingUp size={16} style={{ color: '#ffa300' }} /> Faturamento Atual e Desejo Futuro
                                                    </Label>
                                                    <Input placeholder="..." value={data.faturamentoAtualDesejo} onChange={e => handleInputChange('faturamentoAtualDesejo', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Sparkles size={16} style={{ color: '#ffa300' }} /> Investimento em anúncios p/ Seman/Mês
                                                    </Label>
                                                    <Input placeholder="..." value={data.investimentoDisponivel} onChange={e => handleInputChange('investimentoDisponivel', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Target size={16} style={{ color: '#ffa300' }} /> Métricas Esperadas (CPL, Leads/Mês, CPA)
                                                    </Label>
                                                    <Input placeholder="..." value={data.cplEsperado} onChange={e => handleInputChange('cplEsperado', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-12 border-t border-white/10">
                                            <h3 className="text-lg font-black uppercase tracking-widest text-white/90 flex items-center gap-2">
                                                <SearchCheck size={24} style={{ color: '#ffa300' }} /> Local Services
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                                {/* License Field */}
                                                <div className="space-y-3">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <FileCheck size={16} style={{ color: '#ffa300' }} /> Possui License?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (opt === "Não") {
                                                                        handleInputChange('licenseEmpresa', 'Não');
                                                                        setShowLocal(prev => ({ ...prev, license: false }));
                                                                    } else {
                                                                        setShowLocal(prev => ({ ...prev, license: true }));
                                                                        if (data.licenseEmpresa === "Não") handleInputChange('licenseEmpresa', '');
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    (opt === "Não" && data.licenseEmpresa === "Não") || (opt === "Sim" && (showLocal.license || (data.licenseEmpresa !== "Não" && data.licenseEmpresa !== "")))
                                                                        ? "bg-primary/10 text-primary border-primary"
                                                                        : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {(showLocal.license || (data.licenseEmpresa !== "Não" && data.licenseEmpresa !== "")) && (
                                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <Input placeholder="Descreva a license ou número..." value={data.licenseEmpresa === "Não" ? "" : data.licenseEmpresa} onChange={e => handleInputChange('licenseEmpresa', e.target.value)} className="h-12 rounded-xl" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Liability Field */}
                                                <div className="space-y-3">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Lock size={16} style={{ color: '#ffa300' }} /> Possui Liability Insurance?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (opt === "Não") {
                                                                        handleInputChange('seguroLiability', 'Não');
                                                                        setShowLocal(prev => ({ ...prev, insurance: false }));
                                                                    } else {
                                                                        setShowLocal(prev => ({ ...prev, insurance: true }));
                                                                        if (data.seguroLiability === "Não") handleInputChange('seguroLiability', '');
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    (opt === "Não" && data.seguroLiability === "Não") || (opt === "Sim" && (showLocal.insurance || (data.seguroLiability !== "Não" && data.seguroLiability !== "")))
                                                                        ? "bg-primary/10 text-primary border-primary"
                                                                        : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {(showLocal.insurance || (data.seguroLiability !== "Não" && data.seguroLiability !== "")) && (
                                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <Input placeholder="Valor da apólice, seguradora..." value={data.seguroLiability === "Não" ? "" : data.seguroLiability} onChange={e => handleInputChange('seguroLiability', e.target.value)} className="h-12 rounded-xl" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* SSN Field */}
                                                <div className="space-y-3">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Settings size={16} style={{ color: '#ffa300' }} /> SSN ou ITIN Number?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (opt === "Não") {
                                                                        handleInputChange('ssnItin', 'Não');
                                                                        setShowLocal(prev => ({ ...prev, ssn: false }));
                                                                    } else {
                                                                        setShowLocal(prev => ({ ...prev, ssn: true }));
                                                                        if (data.ssnItin === "Não") handleInputChange('ssnItin', '');
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    (opt === "Não" && data.ssnItin === "Não") || (opt === "Sim" && (showLocal.ssn || (data.ssnItin !== "Não" && data.ssnItin !== "")))
                                                                        ? "bg-primary/10 text-primary border-primary"
                                                                        : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {(showLocal.ssn || (data.ssnItin !== "Não" && data.ssnItin !== "")) && (
                                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <Input placeholder="Insira o número..." value={data.ssnItin === "Não" ? "" : data.ssnItin} onChange={e => handleInputChange('ssnItin', e.target.value)} className="h-12 rounded-xl" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* DL Field */}
                                                <div className="space-y-3">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <User size={16} style={{ color: '#ffa300' }} /> DL ou Passaporte Americano?
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Sim", "Não"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (opt === "Não") {
                                                                        handleInputChange('driveLicensePassaporte', 'Não');
                                                                        setShowLocal(prev => ({ ...prev, dl: false }));
                                                                    } else {
                                                                        setShowLocal(prev => ({ ...prev, dl: true }));
                                                                        if (data.driveLicensePassaporte === "Não") handleInputChange('driveLicensePassaporte', '');
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black uppercase transition-all",
                                                                    (opt === "Não" && data.driveLicensePassaporte === "Não") || (opt === "Sim" && (showLocal.dl || (data.driveLicensePassaporte !== "Não" && data.driveLicensePassaporte !== "")))
                                                                        ? "bg-primary/10 text-primary border-primary"
                                                                        : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {(showLocal.dl || (data.driveLicensePassaporte !== "Não" && data.driveLicensePassaporte !== "")) && (
                                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <Input placeholder="..." value={data.driveLicensePassaporte === "Não" ? "" : data.driveLicensePassaporte} onChange={e => handleInputChange('driveLicensePassaporte', e.target.value)} className="h-12 rounded-xl" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                    <Settings size={16} style={{ color: '#ffa300' }} /> Serviços Ativos no Local Services
                                                </Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {currentGlsServices.map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="outline"
                                                            onClick={() => toggleArrayItem('servicosAtivosGLS', opt)}
                                                            className={cn(
                                                                "cursor-pointer px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all",
                                                                data.servicosAtivosGLS.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {data.servicosAtivosGLS.includes("OUTRO") && (
                                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                        {data.servicosAtivosGLSCustom.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-muted/10 border border-muted-foreground/10">
                                                                {data.servicosAtivosGLSCustom.map(tag => (
                                                                    <Badge key={tag} className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold">
                                                                        {tag}
                                                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeCustomTag('servicosAtivosGLSCustom', tag); }} className="cursor-pointer hover:text-white transition-colors">
                                                                            <X size={14} />
                                                                        </button>
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder="Adicionar serviço GLS..."
                                                                value={tempServicoGLS}
                                                                onChange={e => setTempServicoGLS(e.target.value)}
                                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag('servicosAtivosGLSCustom', tempServicoGLS, () => setTempServicoGLS("")))}
                                                                className="h-12 rounded-xl"
                                                            />
                                                            <Button type="button" onClick={() => addCustomTag('servicosAtivosGLSCustom', tempServicoGLS, () => setTempServicoGLS(""))} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs">
                                                                Adicionar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="acessos" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            {/* Facebook Group */}
                                            <div className="space-y-4 bg-yellow-500/5 p-6 rounded-[24px] border border-yellow-500/10 transition-all hover:border-yellow-500/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-14 rounded-2xl bg-yellow-500 flex items-center justify-center text-black shadow-lg">
                                                        <Facebook size={32} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label className="font-black text-white/90 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <Lock size={12} style={{ color: '#ffa300' }} /> Facebook Account
                                                        </Label>
                                                        <p className="text-[10px] text-muted-foreground font-medium">Login & Senha Pessoal</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-white/50 uppercase ml-2">Username / Email</Label>
                                                        <Input placeholder="Ex: john.doe@email.com" value={data.fbLogin} onChange={e => handleInputChange('fbLogin', e.target.value)} className="h-12 rounded-xl bg-black/40 border-white/5" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-white/50 uppercase ml-2">Password</Label>
                                                        <div className="relative group">
                                                            <Input 
                                                                type={showFbPass ? "text" : "password"} 
                                                                placeholder="••••••••" 
                                                                value={data.fbPass} 
                                                                onChange={e => handleInputChange('fbPass', e.target.value)} 
                                                                className="h-12 rounded-xl bg-black/40 border-white/5 pr-12 focus:border-primary/50" 
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => setShowFbPass(!showFbPass)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                                            >
                                                                {showFbPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Instagram Group */}
                                            <div className="space-y-4 bg-primary/5 p-6 rounded-[24px] border border-primary/10 transition-all hover:border-primary/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg">
                                                        <Instagram size={32} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label className="font-black text-white/90 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <Lock size={12} style={{ color: '#ffa300' }} /> Instagram Account
                                                        </Label>
                                                        <p className="text-[10px] text-muted-foreground font-medium">Login & Senha Business</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-white/50 uppercase ml-2">Username / Phone</Label>
                                                        <Input placeholder="Ex: @topflooring" value={data.igLogin} onChange={e => handleInputChange('igLogin', e.target.value)} className="h-12 rounded-xl bg-black/40 border-white/5" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-white/50 uppercase ml-2">Password</Label>
                                                        <div className="relative group">
                                                            <Input 
                                                                type={showIgPass ? "text" : "password"} 
                                                                placeholder="••••••••" 
                                                                value={data.igPass} 
                                                                onChange={e => handleInputChange('igPass', e.target.value)} 
                                                                className="h-12 rounded-xl bg-black/40 border-white/5 pr-12 focus:border-primary/50" 
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => setShowIgPass(!showIgPass)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                                            >
                                                                {showIgPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gmail Group */}
                                            <div className="space-y-4 bg-white/5 p-6 rounded-[24px] border border-white/10 transition-all hover:border-white/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-14 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" className="size-8" alt="gmail" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label className="font-black text-white/90 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <Mail size={12} style={{ color: '#ffa300' }} /> Gmail Account
                                                        </Label>
                                                        <p className="text-[10px] text-muted-foreground font-medium">Login & Senha de Recuperação</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-white/50 uppercase ml-2">Email</Label>
                                                        <Input placeholder="Ex: business@gmail.com" value={data.gmailLogin} onChange={e => handleInputChange('gmailLogin', e.target.value)} className="h-12 rounded-xl bg-black/40 border-white/5" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-white/50 uppercase ml-2">Password</Label>
                                                        <div className="relative group">
                                                            <Input 
                                                                type={showGmailPass ? "text" : "password"} 
                                                                placeholder="••••••••" 
                                                                value={data.gmailPass} 
                                                                onChange={e => handleInputChange('gmailPass', e.target.value)} 
                                                                className="h-12 rounded-xl bg-black/40 border-white/5 pr-12 focus:border-primary/50" 
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => setShowGmailPass(!showGmailPass)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                                            >
                                                                {showGmailPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="mais" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-white/90 flex items-center gap-2">
                                                    <Settings size={16} style={{ color: '#ffa300' }} /> Informações Adicionais
                                                </Label>
                                                <Textarea 
                                                    placeholder="Qualquer outra observação importante..." 
                                                    className="min-h-[300px] resize-none rounded-[24px] bg-black/20 border-white/5 focus:border-primary/50 text-white/80 p-6" 
                                                    value={data.informacoesAdicionais} 
                                                    onChange={e => handleInputChange('informacoesAdicionais', e.target.value)} 
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </CardContent>
                            </ScrollArea>
                        </Tabs>
                    </Card>

                    {/* Output Column */}
                    <div className="lg:col-span-4 space-y-6 sticky top-24 animate-fade-up" style={{ animationDelay: '200ms' }}>
                        {/* Briefing Output */}
                        <Card className="rounded-[32px] border-border shadow-xl overflow-hidden bg-zinc-950/20 backdrop-blur-md">
                            <CardHeader className="bg-muted/30 border-b border-border py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <LayoutDashboard size={18} className="text-primary" />
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Preview Briefing</CardTitle>
                                    </div>
                                    {outputAsana && (
                                        <Button size="sm" variant="ghost" className="h-8 gap-2 font-bold" onClick={() => copy(outputAsana)}>
                                            {isCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                            {isCopied ? "Copiado" : "Copiar"}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] p-6">
                                    {outputAsana ? (
                                        <div className="bg-white rounded-xl p-6 overflow-auto text-black font-mono text-xs whitespace-pre-wrap">
                                            {outputAsana}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                                            <Briefcase size={48} className="mb-4" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Preencha os dados e gere o briefing</p>
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Missing Fields Output */}
                        <Card className="rounded-[32px] border-border shadow-xl overflow-hidden bg-zinc-950/20 backdrop-blur-md">
                            <CardHeader className="bg-destructive/5 border-b border-destructive/10 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={18} className="text-destructive" />
                                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-destructive">Dados Pendentes</CardTitle>
                                    </div>
                                    {outputMissing && (
                                        <Button size="sm" variant="ghost" className="h-8 gap-2 font-bold text-destructive hover:bg-destructive/10" onClick={() => copy(outputMissing)}>
                                            <Copy size={16} />
                                            C. Copiar
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[200px] p-6">
                                    {outputMissing ? (
                                        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-xs font-mono whitespace-pre-wrap border border-destructive/20">
                                            {outputMissing}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-8">
                                            <PenTool size={32} className="mb-2" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma pendência gerada</p>
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
