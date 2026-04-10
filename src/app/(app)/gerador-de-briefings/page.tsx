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
    Image as ImageIcon
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
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useClipboard } from "@/hooks/useClipboard"

// --- Types & Initial State ---

interface BriefingData {
    // PERGUNTAS GERAIS
    tipoPrograma: string;
    responsavel: string;
    dataNascimento: string;
    nomeEmpresa: string;
    dataFundacao: string;
    anosRamo: string;
    endereco: string;
    numeroComercial: string;
    experienciaMarketing: string;
    plataformasMarketing: string[];
    motivoFechouTS: string;
    quaisInformacoesComunicacao: string;
    sonhosCompanhia: string;
    referenciasSegmento: string;
    horariosReuniao: string;
    horariosAtendimento: string;

    // SOBRE A EMPRESA
    historiaEmpresa: string;
    quantidadePessoas: string;
    selosParcerias: string;
    origemNome: string;
    dificuldadeEvolucao: string;
    abertoPromocoes: string;
    datasComemorativas: string[];

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
    comunicacaoClientes: string;
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

    // ACESSOS
    acessoFacebook: string;
    acessoInstagram: string;
    acessoGmail: string;
}

const INITIAL_STATE: BriefingData = {
    tipoPrograma: "", responsavel: "", dataNascimento: "", nomeEmpresa: "", dataFundacao: "", anosRamo: "", endereco: "", numeroComercial: "", experienciaMarketing: "", plataformasMarketing: [], motivoFechouTS: "", quaisInformacoesComunicacao: "", sonhosCompanhia: "", referenciasSegmento: "", horariosReuniao: "", horariosAtendimento: "",
    historiaEmpresa: "", quantidadePessoas: "", selosParcerias: "", origemNome: "", dificuldadeEvolucao: "", abertoPromocoes: "", datasComemorativas: [],
    produtosServicos: "", mediaValores: "", principaisServicosAnuncios: "", servicosNaoFaz: "", diferenciais: "", possuiFotosVideos: "", problemaBancoImagens: "",
    perfilCliente: "", problemasFrequentes: "", experienciaMarcante: "", duvidasFrequentes: "", nacionalidadeCliente: "", meioContatoPreferido: "", primeiroAtendimento: "", comoEnviaOrcamento: "", uniformeVistas: "", numerosRecomendar: "", amostrasPisos: "", portfolioVisitas: "",
    idiomas: [],
    sistemasInternos: "",
    identidadeVisual: "",
    vetorPdf: "",
    referenciasLogo: "", estiloLogo: "", coresTransmitir: "", coresNaoQuer: "", obrigatorioLogo: "", cartaoVisitas: "", informacoesCartao: "", plotagemVeiculo: "", tipoPlotagem: "",
    conheceHospedagemDominio: "", possuiSite: "", manterDominio: "", hospedagemAtual: "", manterHospedagem: "", emailProfissional: "", transferirEmails: "", referenciasSites: "", obrigatorioSite: "", tipoNegocio: "",
    facilidadeRedes: "", comunicacaoClientes: "", preferenciaPosts: "", disponibilidadeMateriais: "", referenciasInstagram: "", layoutArtes: "", layoutFotos: "", estiloMusicalNao: "", termosInglesSim: "", termosInglesNao: "",
    experienciaAnuncios: "", regiaoAtuacao: "", faturamentoAtualDesejo: "", fechamentosMesProjecao: "", ticketMedio: "", margemLucro: "", investimentoDisponivel: "", cplEsperado: "", expectativaLeads: "", cpaEsperado: "",
    conheceGMB: "",
    licenseEmpresa: "", seguroLiability: "", ssnItin: "", driveLicensePassaporte: "", servicosAtivosGLS: [],
    acessoFacebook: "", acessoInstagram: "", acessoGmail: ""
}

// --- Helper Data ---

const PLATFORMS_OPTIONS = ["Yelp", "Thumbtack", "Nextdoor", "Houzz", "Angi List"];

const HOLIDAYS_OPTIONS = [
    "New Year’s Day", "Martin Luther King Jr. Day", "Valentine's Day", "Presidents’ Day",
    "St. Patrick's Day", "Easter", "Beginning of Spring", "Patriots’ Day", "Memorial Day",
    "Mother's Day", "Juneteenth", "Father’s Day", "Beginning of Summer", "4th of July (Independence Day)",
    "Labor Day", "Patriot Day", "Beginning of Fall", "Halloween", "Veterans Day"
];

const GLS_SERVICES = [
    "Baseboards", "Carpet", "Floor polishing", "Floor refinishing", "Floor repair & maintenance",
    "Hardwood", "Installing floors", "Marble", "Stair flooring", "Tile", "Wood floor sanding"
];

// --- Sub-components ---

export default function GeradorBriefing() {
    const [data, setData] = useState<BriefingData>(INITIAL_STATE)
    const [outputAsana, setOutputAsana] = useState("")
    const [outputMissing, setOutputMissing] = useState("")
    const { copy, isCopied } = useClipboard()

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
            if (field === 'numeroComercial') {
                const x = value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/);
                if (x) {
                    formattedValue = !x[2] ? x[1] : `+${x[1]} (${x[2]}) ${x[3]}${x[4] ? '-' + x[4] : ''}`;
                }
            }
        }
        
        setData(prev => ({ ...prev, [field]: formattedValue }))
    }

    const toggleArrayItem = (field: keyof BriefingData, item: string) => {
        const current = data[field] as string[]
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        setData(prev => ({ ...prev, [field]: updated }))
    }

    const generateBriefing = () => {
        const companyName = data.nomeEmpresa || "CLIENTE";
        const date = new Date().toLocaleDateString('pt-BR');
        
        let briefing = `📋 BRIEFING DE PROJETO - ${companyName}\n`;
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
            { label: "Tipo de programa", value: data.tipoPrograma },
            { label: "Responsável", value: data.responsavel },
            { label: "Data de Nascimento", value: data.dataNascimento },
            { label: "Nome da Empresa", value: data.nomeEmpresa },
            { label: "Data da Fundação", value: data.dataFundacao },
            { label: "Anos no Ramo", value: data.anosRamo },
            { label: "Endereço", value: data.endereco },
            { label: "Número Comercial", value: data.numeroComercial },
            { label: "Experiência Marketing", value: data.experienciaMarketing },
            { label: "Plataformas utilizadas", value: data.plataformasMarketing },
            { label: "Motivo fechou com TS", value: data.motivoFechouTS },
            { label: "Informações Comunicação", value: data.quaisInformacoesComunicacao },
            { label: "Sonhos Companhia", value: data.sonhosCompanhia },
            { label: "Referências Segmento", value: data.referenciasSegmento },
            { label: "Horários de Reunião", value: data.horariosReuniao },
            { label: "Horários Atendimento", value: data.horariosAtendimento },
        ]);

        briefing += addSection("Sobre a Empresa", [
            { label: "Breve História", value: data.historiaEmpresa },
            { label: "Quantidade de Pessoas", value: data.quantidadePessoas },
            { label: "Selos e Parcerias", value: data.selosParcerias },
            { label: "Origem do Nome", value: data.origemNome },
            { label: "O que atrapalha a evolução", value: data.dificuldadeEvolucao },
            { label: "Aberto a Promoções", value: data.abertoPromocoes },
            { label: "Datas Comemorativas", value: data.datasComemorativas },
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
            { label: "Portfólio Visitas", value: data.portfolioVisitas },
        ]);

        briefing += addSection("Design", [
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
            { label: "Comunicação Clientes", value: data.comunicacaoClientes },
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
            { label: "Experiência Anúncios", value: data.experienciaAnuncios },
            { label: "Região Atuação", value: data.regiaoAtuacao },
            { label: "Faturamento Atual/Projeção", value: data.faturamentoAtualDesejo },
            { label: "Fechamentos Atual/Projeção", value: data.fechamentosMesProjecao },
            { label: "Ticket Médio", value: data.ticketMedio },
            { label: "Margem Lucro %", value: data.margemLucro },
            { label: "Investimento Semanal/Mês", value: data.investimentoDisponivel },
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
            { label: "DL ou Passaporte", value: data.driveLicensePassaporte },
            { label: "Serviços GLS", value: data.servicosAtivosGLS },
        ]);

        briefing += addSection("Acessos", [
            { label: "Facebook Access", value: data.acessoFacebook },
            { label: "Instagram Access", value: data.acessoInstagram },
            { label: "Gmail Access", value: data.acessoGmail },
        ]);

        briefing += `\nEste é um documento confidencial - TS TOOLS © ${new Date().getFullYear()}`;
        setOutputAsana(briefing);

        // Calculate Missing Fields
        const missingFields: string[] = [];
        const excludedFields = ["datasComemorativas", "plataformasMarketing", "servicosAtivosGLS"];

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
                                <div className="bg-muted/50 rounded-2xl p-1 overflow-x-auto no-scrollbar border border-border/50 flex justify-center">
                                    <TabsList className="h-12 bg-transparent w-full lg:w-max justify-center gap-1 flex-nowrap border-0 shadow-none">
                                        {sections.map(s => (
                                            <TabsTrigger
                                                key={s.id}
                                                value={s.id}
                                                className={cn(
                                                    "h-full rounded-xl px-3 lg:px-4 text-[9px] font-black uppercase tracking-tighter gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-[#ffa300] transition-all whitespace-nowrap",
                                                )}
                                            >
                                                {s.icon}
                                                <span className="shrink-0">{s.label}</span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </div>

                            <ScrollArea className="h-[700px]">
                                <CardContent className="p-8">
                                    <TabsContent value="geral" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Target size={16} style={{ color: '#ffa300' }} /> Tipo de Programa
                                                </Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Acelerador", "Setup", "Recorrência"].map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="outline"
                                                            onClick={() => handleInputChange('tipoPrograma', opt)}
                                                            className={cn(
                                                                "cursor-pointer px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                                                                data.tipoPrograma === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Settings size={16} style={{ color: '#ffa300' }} /> Tipo de programa
                                                </Label>
                                                <Input placeholder="Ex: Programa Acelerador" value={data.tipoPrograma} onChange={e => handleInputChange('tipoPrograma', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <User size={16} style={{ color: '#ffa300' }} /> Nome do responsável
                                                </Label>
                                                <Input placeholder="Ex: John Doe" value={data.responsavel} onChange={e => handleInputChange('responsavel', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Building2 size={16} style={{ color: '#ffa300' }} /> Nome da empresa
                                                </Label>
                                                <Input placeholder="Ex: Top Flooring LLC" value={data.nomeEmpresa} onChange={e => handleInputChange('nomeEmpresa', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Phone size={16} style={{ color: '#ffa300' }} /> Número comercial (WhatsApp)
                                                </Label>
                                                <Input placeholder="+1 (123) 456-7890" value={data.numeroComercial} onChange={e => handleInputChange('numeroComercial', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <MapPin size={16} style={{ color: '#ffa300' }} /> Endereço completo (Rua, Cidade, Estado)
                                                </Label>
                                                <Input placeholder="123 Main St, Miami, FL" value={data.endereco} onChange={e => handleInputChange('endereco', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Globe size={16} style={{ color: '#ffa300' }} /> Idiomas de Atendimento
                                                </Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Português", "Inglês", "Espanhol"].map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="outline"
                                                            onClick={() => toggleArrayItem('idiomas', opt)}
                                                            className={cn(
                                                                "cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                                                                data.idiomas.includes(opt) ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
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
                                                    {["< 1 ano", "1-3 anos", "3-5 anos", "5-10 anos", "10+ anos"].map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="outline"
                                                            onClick={() => handleInputChange('anosRamo', opt)}
                                                            className={cn(
                                                                "cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                                                                data.anosRamo === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <Input placeholder="Outro..." value={data.anosRamo} onChange={e => handleInputChange('anosRamo', e.target.value)} className="h-10 rounded-xl mt-2 text-[11px]" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
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
                                                            "cursor-pointer px-4 py-2 rounded-full font-bold uppercase tracking-wider text-[10px] transition-all",
                                                            data.plataformasMarketing.includes(opt) ? "bg-orange-500/10 text-yellow-500 border-orange-500" : "hover:bg-muted"
                                                        )}
                                                    >
                                                        {opt}
                                                    </Badge>
                                                ))}
                                            </div>
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
                                                <Input placeholder="..." value={data.sonhosCompanhia} onChange={e => handleInputChange('sonhosCompanhia', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Search size={16} style={{ color: '#ffa300' }} /> Referências do segmento (Personalidades, empresas)
                                                </Label>
                                                <Input placeholder="..." value={data.referenciasSegmento} onChange={e => handleInputChange('referenciasSegmento', e.target.value)} className="h-12 rounded-xl" />
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
                                                        {["1-3", "4-7", "8-15", "15+"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('quantidadePessoas', opt)}
                                                                className={cn(
                                                                    "cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                                                    data.quantidadePessoas === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Input placeholder="Outro..." value={data.quantidadePessoas} onChange={e => handleInputChange('quantidadePessoas', e.target.value)} className="h-10 rounded-xl mt-2 text-[11px]" />
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
                                                    <Input placeholder="..." value={data.origemNome} onChange={e => handleInputChange('origemNome', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-foreground flex items-center gap-2">
                                                        <AlertCircle size={16} style={{ color: '#ffa300' }} /> O que sente que atrapalha a evolução?
                                                    </Label>
                                                    <Input placeholder="Ex: Falta de visibilidade" value={data.dificuldadeEvolucao} onChange={e => handleInputChange('dificuldadeEvolucao', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-foreground flex items-center gap-2">
                                                    <Sparkles size={16} style={{ color: '#ffa300' }} /> Aberto a fazer promoções/ofertas em datas comemorativas?
                                                </Label>
                                                <Input placeholder="Ex: 10% OFF em Março" value={data.abertoPromocoes} onChange={e => handleInputChange('abertoPromocoes', e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                            <div className="space-y-3">
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
                                                                "cursor-pointer px-4 py-2 rounded-full font-bold uppercase tracking-wider text-[10px] transition-all",
                                                                data.datasComemorativas.includes(opt) ? "text-yellow-500/10 text-yellow-500 border-yellow-500/30" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
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
                                                     <Input placeholder="Ex: Hardwood Installation & Refinishing" value={data.principaisServicosAnuncios} onChange={e => handleInputChange('principaisServicosAnuncios', e.target.value)} className="h-12 rounded-xl" />
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
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black transition-all",
                                                                    data.possuiFotosVideos === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
                                                     </div>
                                                     <Input placeholder="Outro..." value={data.possuiFotosVideos} onChange={e => handleInputChange('possuiFotosVideos', e.target.value)} className="h-10 rounded-xl mt-2 text-[11px]" />
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
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black transition-all",
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
                                                    <Input placeholder="..." value={data.nacionalidadeCliente} onChange={e => handleInputChange('nacionalidadeCliente', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Mail size={16} style={{ color: '#ffa300' }} /> Meio de contato preferido do cliente
                                                    </Label>
                                                    <Input placeholder="Messenger, SMS, WhatsApp..." value={data.meioContatoPreferido} onChange={e => handleInputChange('meioContatoPreferido', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <User size={16} style={{ color: '#ffa300' }} /> Como é feito o 1º atendimento?
                                                    </Label>
                                                    <Input placeholder="..." value={data.primeiroAtendimento} onChange={e => handleInputChange('primeiroAtendimento', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <FileCheck size={16} style={{ color: '#ffa300' }} /> Como envia o orçamento?
                                                    </Label>
                                                    <Input placeholder="..." value={data.comoEnviaOrcamento} onChange={e => handleInputChange('comoEnviaOrcamento', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Sparkles size={16} style={{ color: '#ffa300' }} /> Tem uniforme para as visitas?
                                                    </Label>
                                                    <Input placeholder="..." value={data.uniformeVistas} onChange={e => handleInputChange('uniformeVistas', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Phone size={16} style={{ color: '#ffa300' }} /> Tem clientes para recomendar?
                                                    </Label>
                                                    <Input placeholder="..." value={data.numerosRecomendar} onChange={e => handleInputChange('numerosRecomendar', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Palette size={16} style={{ color: '#ffa300' }} /> Anda com amostras de pisos?
                                                    </Label>
                                                    <Input placeholder="..." value={data.amostrasPisos} onChange={e => handleInputChange('amostrasPisos', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Layout size={16} style={{ color: '#ffa300' }} /> Possui portfólio físico/digital em mãos?
                                                    </Label>
                                                    <Input placeholder="..." value={data.portfolioVisitas} onChange={e => handleInputChange('portfolioVisitas', e.target.value)} className="h-12 rounded-xl" />
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
                                                    <Input placeholder="..." value={data.identidadeVisual} onChange={e => handleInputChange('identidadeVisual', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <FileCheck size={16} style={{ color: '#ffa300' }} /> Tem a versão em VETOR/PDF da Logo?
                                                    </Label>
                                                    <Input placeholder="..." value={data.vetorPdf} onChange={e => handleInputChange('vetorPdf', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Search size={16} style={{ color: '#ffa300' }} /> Referências Visuais (Cite 3 logos que gosta)
                                                    </Label>
                                                    <Input placeholder="..." value={data.referenciasLogo} onChange={e => handleInputChange('referenciasLogo', e.target.value)} className="h-12 rounded-xl" />
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
                                                    <Input placeholder="..." value={data.cartaoVisitas} onChange={e => handleInputChange('cartaoVisitas', e.target.value)} className="h-12 rounded-xl mt-2" />
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
                                                    <p className="text-[10px] opacity-50 uppercase font-bold mt-1">⚠️ Plotagem total requer alteração no documento do veículo.</p>
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Layout size={16} style={{ color: '#ffa300' }} /> Tipo de plotagem (Adesivagem, Ímã ou Completa)
                                                    </Label>
                                                    <Input placeholder="..." value={data.tipoPlotagem} onChange={e => handleInputChange('tipoPlotagem', e.target.value)} className="h-12 rounded-xl" />
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
                                                     <Input placeholder="Outro..." value={data.conheceHospedagemDominio} onChange={e => handleInputChange('conheceHospedagemDominio', e.target.value)} className="h-10 rounded-xl mt-2 text-[11px]" />
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
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Users size={16} style={{ color: '#ffa300' }} /> Tom de Comunicação
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        {["Formal", "Direto", "Divertido"].map(opt => (
                                                            <Badge
                                                                key={opt}
                                                                variant="outline"
                                                                onClick={() => handleInputChange('comunicacaoClientes', opt)}
                                                                className={cn(
                                                                    "cursor-pointer flex-1 py-3 justify-center rounded-xl text-[10px] font-black transition-all",
                                                                    data.comunicacaoClientes === opt ? "bg-primary/10 text-primary border-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                {opt}
                                                            </Badge>
                                                        ))}
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

                                        <div className="space-y-6 pt-12 border-t border-white/90/10">
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

                                        <div className="space-y-6 pt-12 border-t border-white/90/10">
                                            <h3 className="text-lg font-black uppercase tracking-widest text-white/90 flex items-center gap-2">
                                                <SearchCheck size={24} style={{ color: '#ffa300' }} /> Local Services
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <FileCheck size={16} style={{ color: '#ffa300' }} /> Possui License?
                                                    </Label>
                                                    <Input placeholder="..." value={data.licenseEmpresa} onChange={e => handleInputChange('licenseEmpresa', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Lock size={16} style={{ color: '#ffa300' }} /> Possui Liability Insurance?
                                                    </Label>
                                                    <Input placeholder="..." value={data.seguroLiability} onChange={e => handleInputChange('seguroLiability', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <Settings size={16} style={{ color: '#ffa300' }} /> SSN ou ITIN Number?
                                                    </Label>
                                                    <Input placeholder="..." value={data.ssnItin} onChange={e => handleInputChange('ssnItin', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-white/90 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <User size={16} style={{ color: '#ffa300' }} /> DL ou Passaporte Americano?
                                                    </Label>
                                                    <Input placeholder="..." value={data.driveLicensePassaporte} onChange={e => handleInputChange('driveLicensePassaporte', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="font-bold text-white/90 text-xs uppercase tracking-wider">⚪ Serviços Ativos no Local Services</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {GLS_SERVICES.map(opt => (
                                                        <Badge
                                                            key={opt}
                                                            variant="outline"
                                                            onClick={() => toggleArrayItem('servicosAtivosGLS', opt)}
                                                            className={cn(
                                                                "cursor-pointer px-4 py-2 rounded-full font-bold uppercase tracking-wider text-[10px] transition-all",
                                                                data.servicosAtivosGLS.includes(opt) ? "text-[#ffa300]/10 text-white/90 border-yellow-500/20" : "hover:bg-muted"
                                                            )}
                                                        >
                                                            {opt}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="acessos" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-6">
                                            <div className="space-y-2 flex items-center gap-4 bg-yellow-500/5 p-6 rounded-3xl border border-yellow-500/10">
                                                <div className="size-14 rounded-2xl bg-yellow-500 flex items-center justify-center text-black shadow-lg">
                                                    <Facebook size={32} />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Lock size={16} style={{ color: '#ffa300' }} /> Facebook (Login/Senha Pessoal)
                                                    </Label>
                                                    <Input placeholder="User @ Pass" value={data.acessoFacebook} onChange={e => handleInputChange('acessoFacebook', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 flex items-center gap-4 bg-yellow-500/5 p-6 rounded-3xl border border-yellow-500/10">
                                                <div className="size-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg">
                                                    <Instagram size={32} />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Lock size={16} style={{ color: '#ffa300' }} /> Instagram (Login/Senha Business)
                                                    </Label>
                                                    <Input placeholder="User @ Pass" value={data.acessoInstagram} onChange={e => handleInputChange('acessoInstagram', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 flex items-center gap-4 bg-yellow-500/5 p-6 rounded-3xl border border-yellow-500/10">
                                                <div className="size-14 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" className="size-8" alt="gmail" />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <Label className="font-bold text-white/90 flex items-center gap-2">
                                                        <Mail size={16} style={{ color: '#ffa300' }} /> Gmail (Login/Senha de Recuperação)
                                                    </Label>
                                                    <Input placeholder="User @ Pass" value={data.acessoGmail} onChange={e => handleInputChange('acessoGmail', e.target.value)} className="h-12 rounded-xl" />
                                                </div>
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
