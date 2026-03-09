import {
    Building2 as Buildings,
    Wrench,
    TreeDeciduous as Tree,
    Grid as GridFour,
    PlusSquare,
    PaintRoller,
    Home as HouseLine,
    LayoutGrid as SquaresFour,
    Thermometer,
    Table,
    Layers as Stack,
    TreePine as TreeEvergreen,
    ShieldCheck,
    PaintBucket,
    RotateCcw as Recycle,
    Sprout as Plant,
    Brush as Broom,
    Sparkles,
    LucideIcon
} from "lucide-react"

export type NicheId = string

export interface SubNiche {
    id: string
    title: string
    description: string
    icon: string // We will use a string identifier or a generic icon for sub-niches to simplify
}

export interface WorkflowStep {
    title: string
    description: string
}

export interface NicheData {
    id: NicheId
    title: string
    subtitle: string
    icon: LucideIcon
    tags: string[]
    group: string

    // Detailed Content
    description: string
    readingTimeMin: number
    demandLevel: "Alta Demanda" | "Média Demanda" | "Estável"

    subNichesTitle: string
    subNiches: SubNiche[]

    workflowTitle?: string
    workflowDescription?: string
    workflowSteps: WorkflowStep[]

    goldenRule: string
    whatWorksList: string[]

    keywords: string[]
    proTip: string

    // Professional Assets from TS Explore
    bannerImage?: string
    processImages?: string[]
}

export const nichesData: NicheData[] = [
    {
        id: "painting",
        title: "Painting",
        subtitle: "Pintura Interior, Exterior & Armários",
        icon: PaintRoller,
        tags: ["Interior", "Exterior", "Cabinet", "Primer"],
        group: "Acabamentos & Superfícies",
        description: "O nicho de pintura residencial é um dos mais competitivos e lucrativos dos EUA. Um anúncio de painting que converte mostra **antes e depois impecável**, profissionais com uniforme e uma execução que passa confiança.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Os 3 Sub-Nichos de Painting",
        subNiches: [
            { id: "interior", title: "Interior Painting", description: "Quarto, sala, cozinha. Foco em precisão no corte (cutting-in) e rolagem uniforme. Cliente quer ver ambiente transformado.", icon: "HouseLine" },
            { id: "exterior", title: "Exterior Painting", description: "Fachada, deck, cercas. Resistência a intempéries é o argumento de venda. Mostrar preparação de superfície converte mais.", icon: "Sun" },
            { id: "cabinet", title: "Cabinet Painting", description: "Reformar armários sem trocar é a alternativa mais barata ao remodeling. Acabamento de alta qualidade é o diferencial.", icon: "Armchair" }
        ],
        workflowTitle: "Fluxo de Trabalho no Canteiro",
        workflowDescription: "Entender o processo técnico ajuda a criar criativos que **geram autoridade e confiança**. No mercado americano, o cliente quer ver profissionalismo em cada etapa.",
        workflowSteps: [
            { title: "Preparação da Superfície", description: "Remoção de tinta antiga, lixamento, reparos em furos e trincas com massa corrida (spackle). Esta etapa é onde os amadores se diferenciam dos profissionais." },
            { title: "Proteção (Masking & Drop Cloths)", description: "Fita crepe (painter's tape), lonas plásticas cobrindo móveis e pisos. Mostra organização e cuidado — isso é fotogênico e converte em anúncios." },
            { title: "Primer", description: "Camada de base que garante aderência e cobertura uniforme. Etapa obrigatória em superfícies novas ou reformadas." },
            { title: "Pintura (2 demãos)", description: "Primeira demão de cobertura, segunda de acabamento. Rolo para áreas planas, pincel para cortes e molduras." },
            { title: "Touch-ups & Limpeza", description: "Retirada cuidadosa das lonas e fitas, inspeção final, pequenos retoques. O profissional sai e o ambiente está impecável." }
        ],
        goldenRule: "O antes e depois de pintura é um dos criativos de mais alta conversão em Home Services. O cliente sente que está tomando uma decisão de compra de baixo risco com alto impacto visual.",
        whatWorksList: [
            "**Mostrar o contraste:** Parede velha/descascada/desbotada ao lado da parede recém-pintada é o combo perfeito.",
            "**Uniforme e ferramentas:** Profissional com uniforme branco, cinto de ferramentas, rolo de qualidade — passa autoridade imediata.",
            "**Ambiente detalhe:** Close-up no corte perfeito na moldura, borda impecável — mostra precisão técnica.",
            "**Exterior com contexto americano:** Casa com jardim, calçada, mailbox — o cliente americano quer se ver naquele ambiente."
        ],
        keywords: [
            "cutting-in", "roller application", "painter's tape", "drop cloth", "primer coat", "spackle repair",
            "exterior latex paint", "trim work", "cabinet refinishing", "sheen level", "eggshell finish", "two-coat system"
        ],
        proTip: "Ao usar o Gerador de Imagens para painting, combine Exterior Painting + Suburban Neighborhood + Golden Hour + Cinematic para o criativo de mais alta performance. A luz do entardecer numa fachada recém-pintada é extremamente aspiracional.",
        bannerImage: "/images/niches/painting/banner-painting.webp",
        processImages: [
            "/images/niches/painting/img-painting-prep-interior.webp"
        ]
    },
    {
        id: "remodeling",
        title: "Remodeling",
        subtitle: "Kitchen, Bathroom & Basement",
        icon: Wrench,
        tags: ["Kitchen", "Bathroom", "Basement", "Design"],
        group: "Construção & Reformas",
        description: "Reformas são o nicho com maior potencial de transformação visual. Um **kitchen ou bathroom remodel bem fotografado** é o criativo mais aspiracional de Home Services.",
        readingTimeMin: 6,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Os 3 Grandes Focos de Remodeling",
        subNiches: [
            { id: "kitchen", title: "Kitchen Remodel", description: "O projeto mais desejado. Novos armários, bancada de quartzo, backsplash.", icon: "ChefHat" },
            { id: "bathroom", title: "Bathroom Remodel", description: "Ducha de vidro, louças modernas, vanity com espelho LED.", icon: "Bathtub" },
            { id: "basement", title: "Basement Remodel", description: "Transformar porão em home theater ou suíte extra.", icon: "House" }
        ],
        workflowTitle: "Fluxo de Trabalho",
        workflowSteps: [
            { title: "Design & Planejamento", description: "3D renders, seleção de materiais. O cliente precisa ver o sonho antes de aprovar." },
            { title: "Demolição Cirúrgica", description: "Retirada do antigo com cuidado para não danificar estruturas." },
            { title: "Rough-in — Estrutura Técnica", description: "Elétrica, hidráulica e HVAC atualizados antes de fechar as paredes." },
            { title: "Drywall & Pintura", description: "Fechamento das paredes, textura e pintura de base." },
            { title: "Instalação dos Acabamentos", description: "Armários, bancadas, pisos, fixtures — aqui a mágica acontece." }
        ],
        goldenRule: "O antes e depois de cozinha é o formato com maior taxa de salvamento em redes sociais. Use esse comportamento para criar campanhas de longo prazo.",
        whatWorksList: [
            "**Kitchen remodel:** Mostre armários novos e bancadas de quartzo.",
            "**Bathroom:** Destaque a ducha de vidro e louças modernas.",
            "**Close-ups:** Detalhes de materiais premium aumentam a percepção de valor."
        ],
        keywords: ["kitchen remodel", "bathroom renovation", "quartz countertop", "subway tile backsplash", "custom cabinets", "walk-in shower"],
        proTip: "Para remodeling, use Studio Lighting + Luxury Home + Commercial Photography para valorizar os materiais premium.",
        bannerImage: "/images/niches/remodeling/banner-remodeling.webp",
        processImages: [
            "/images/niches/remodeling/img-remodeling-design.webp",
            "/images/niches/remodeling/img-remodeling-demolition.webp"
        ]
    },
    {
        id: "roofing",
        title: "Roofing",
        subtitle: "Substituição & Reparo de Telhados",
        icon: HouseLine,
        tags: ["Urgent", "High-Ticket", "Shingles", "Metal"],
        group: "Acabamentos & Superfícies",
        description: "Roofing é um nicho de urgência. Quando o telhado vaza, o cliente não pesquisa muito. Transmitir profissionalismo e segurança visualmente é o que fecha contratos.",
        readingTimeMin: 6,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Tipos de Serviço",
        subNiches: [
            { id: "replacement", title: "Full Replacement", description: "Troca completa das shingles e deck se necessário.", icon: "Hammer" },
            { id: "repair", title: "Roof Repair", description: "Conserto de vazamentos e telhas soltas após tempestades.", icon: "CloudRain" }
        ],
        workflowTitle: "Fluxo de Trabalho em Roofing",
        workflowSteps: [
            { title: "Inspeção & Diagnóstico", description: "Profissional sobe no telhado e fotografa danos. Gera confiança imediata." },
            { title: "Tear-off", description: "Remoção do telhado antigo. Ótimo conteúdo de processo." },
            { title: "Reparo do Deck", description: "Substituição de madeira (OSB/Plywood) danificada." },
            { title: "Underlayment & Flashing", description: "Manta protetora e rufos. Detalhe técnico de autoridade." },
            { title: "Instalação das Telhas", description: "Assentamento das shingles em padrão perfeito." }
        ],
        goldenRule: "O contraste 'telhado danificado vs. telhado novo' ativa gatilhos de segurança e proteção da família.",
        whatWorksList: [
            "**Drone View:** Fotos aéreas mostram a escala do trabalho e o resultado final.",
            "**Safety Gear:** Equipes vísiveis com cintos de segurança passam profissionalismo.",
            "**Manta Protetora:** Mostrar a camada invisível de proteção gera autoridade técnica."
        ],
        keywords: ["asphalt shingles", "metal roofing", "roof inspection", "safety harness", "flashing", "underlayment"],
        proTip: "Use Drone View + Bright Sunny Day + Suburban Neighborhood para criar criativos aspiracionais de segurança.",
        bannerImage: "/images/niches/roofing/banner-roofing.webp",
        processImages: [
            "/images/niches/roofing/img-roofing-preparacao.webp",
            "/images/niches/roofing/img-roofing-reparo-deck.webp"
        ]
    },
    {
        id: "cleaning",
        title: "Cleaning",
        subtitle: "Residencial, Comercial & Move-in/Out",
        icon: Broom,
        tags: ["Recurrent", "Residential", "Commercial", "Deep Clean"],
        group: "Exterior & Serviços",
        description: "Limpeza é o nicho de maior frequência de contratação dos EUA. O cliente ideal é recorrente — e criativos que mostram a transformação são extremamente efetivos.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Segmentação de Mercado",
        subNiches: [
            { id: "residential", title: "Residential", description: "Regular (semanal) ou Deep Clean (detalhado).", icon: "House" },
            { id: "commercial", title: "Commercial", description: "Escritórios, lojas e janitorial (contratos longos).", icon: "Buildings" },
            { id: "move", title: "Move-In/Out", description: "Limpeza completa para quem está mudando. Alto valor.", icon: "Truck" }
        ],
        workflowTitle: "O que Vende em Cleaning",
        workflowSteps: [
            { title: "Cozinha Impecável", description: "Balcões, fogão e geladeira brilhando." },
            { title: "Banheiro Pristine", description: "Foco em metais e azulejos sem manchas." },
            { title: "Reflexo no Piso", description: "Chão polido ao ponto de refletir a imagem." },
            { title: "Organização Final", description: "A toque final que mostra o cuidado profissional." }
        ],
        goldenRule: "A transformação é visualmente óbvia e instantânea. Mostre o brilho e a organização.",
        whatWorksList: [
            "**Uniformes:** Equipes padronizadas passam imagem de empresa estabelecida.",
            "**Equipamentos:** Aspiradores modernos e mops profissionais geram percepção de qualidade.",
            "**Banheiro:** Um antes e depois de banheiro é um dos criativos de maior alcance."
        ],
        keywords: ["deep cleaning", "sparkling clean", "microfiber cloth", "steam cleaning", "pristine bathroom", "shining surfaces"],
        proTip: "Use Studio Lighting + Commercial Photography para criar aquele brilho intenso que faz o ambiente parecer impecável.",
        bannerImage: "/images/niches/cleaning/banner-cleaning.webp",
        processImages: [
            "/images/niches/cleaning/img-cleaning-deep-cleaning.webp"
        ]
    },
    {
        id: "construction",
        title: "Construction",
        subtitle: "Construção Residencial & Comercial",
        icon: Buildings,
        tags: ["Foundation", "Framing", "Drywall", "Inspections"],
        group: "Construção & Reformas",
        description: "Mercado sólido focado em estrututras novas e grandes expansões.",
        readingTimeMin: 7,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Áreas da Construção",
        subNiches: [
            { id: "residential", title: "Residential Construction", description: "Novas casas e grandes adições (additions).", icon: "House" },
            { id: "commercial", title: "Commercial Construction", description: "Lojas, armazéns e escritórios.", icon: "Buildings" }
        ],
        workflowSteps: [
            { title: "Foundation", description: "Escavação e concreto. A base de tudo." },
            { title: "Framing", description: "Esqueleto de madeira ou metal da estrutura." },
            { title: "Sheathing & Siding", description: "Fechamento externo e proteção." },
            { title: "Rough-ins", description: "Instalações internas antes do acabamento." }
        ],
        goldenRule: "Mostre a escala e a solidez da obra. Use ângulos 'hero' (de baixo para cima).",
        whatWorksList: [
            "**Maquinário:** Máquinas pesadas em ação passam imagem de grande capacidade.",
            "**Estrutura Exposta:** O framing de madeira limpo e organizado é visualmente satisfatório.",
            "**Segurança:** Foco em capacetes e coletes mostra conformidade (compliance)."
        ],
        keywords: ["foundation", "framing", "concrete", "structural design", "blueprints", "building permit"],
        proTip: "Use ângulos baixos (hero angle) para mostrar a estrutura sendo erguida contra o céu azul.",
        bannerImage: "/images/niches/construction/banner-construction.webp",
        processImages: [
            "/images/niches/construction/img-construction-grading.webp",
            "/images/niches/construction/img-construction-excavation.webp",
            "/images/niches/construction/img-construction-framing.webp"
        ]
    },
    {
        id: "landscaping",
        title: "Landscaping",
        subtitle: "Design, Hardscaping & Softscaping",
        icon: Tree,
        tags: ["Outdoor", "Design", "Garden", "Seasonal"],
        group: "Exterior & Serviços",
        description: "Paisagismo é o nicho que mais se beneficia de criativos visuais com drone. O cliente quer ver o sonho do jardim perfeito.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Hardscaping vs Softscaping",
        subNiches: [
            { id: "hardscape", title: "Hardscaping", description: "Patios, decks de pedra, muros de contenção e fire pits.", icon: "Castle" },
            { id: "softscape", title: "Softscaping", description: "Lawn care, plantio de árvores, mulching e irrigação.", icon: "Plant" }
        ],
        workflowSteps: [],
        goldenRule: "O cliente americano é movido pelo 'curb appeal' — a beleza da casa vista da rua.",
        whatWorksList: [
            "**Drone View:** Vista aérea de um jardim perfeitamente manicurado.",
            "**Lifestyle:** Família aproveitando um espaço de lazer externo com churrasqueira.",
            "**Antes e Depois:** Gramado descuidado vs. perfeito — simples e efetivo."
        ],
        keywords: ["manicured lawn", "curb appeal", "paver patio", "retaining wall", "mulch bed", "outdoor kitchen"],
        proTip: "Combine Golden Hour + Drone View para criar a imagem que vende o sonho do homeowner americano.",
        bannerImage: "/images/niches/landscaping/banner-new-landscape.webp",
        processImages: [
            "/images/niches/landscaping/img-landscaping-handscaping.webp",
            "/images/niches/landscaping/img-landscaping-softscaping.webp",
            "/images/niches/landscaping/img-landscaping-cuidado-gramado.webp",
            "/images/niches/landscaping/img-landscaping-irrigacao.webp",
            "/images/niches/landscaping/img-landscaping-iluminacao.webp",
            "/images/niches/landscaping/img-landscaping-parede-contencao.webp"
        ]
    },
    {
        id: "carpentry",
        title: "Carpentry",
        subtitle: "Artesanato, Trim & Gabinetes",
        icon: TreeEvergreen,
        tags: ["Craftsmanship", "Interior", "Custom", "Premium"],
        group: "Construção & Reformas",
        description: "Carpentry é um nicho de artesanato e precisão. Os criativos mostram o detalhe impecável do trabalho sob medida.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Rough vs Finish Carpentry",
        subNiches: [
            { id: "rough", title: "Rough Carpentry", description: "Framing de paredes, decks e estruturade escadas.", icon: "Hammer" },
            { id: "finish", title: "Finish Carpentry", description: "Trim, molduras internas, portas e painéis decorativos.", icon: "PencilRuler" }
        ],
        workflowSteps: [],
        goldenRule: "No mercado americano, 'craftsmanship' é um valor cultural forte. Mostre a junta perfeita.",
        whatWorksList: [
            "**Custom Millwork:** Marcenaria arquitetônica de alto ticket.",
            "**Wood Rot Repair:** Serviço de urgência com alta margem em decks e janelas.",
            "**Built-ins:** Estantes embutidas que transformam o cômodo."
        ],
        keywords: ["finish carpentry", "custom cabinets", "wood trim", "craftsman style", "wainscoting", "millwork"],
        proTip: "Use close-ups com Studio Lighting para revelar a textura natural da madeira de forma magistral.",
        bannerImage: "/images/niches/carpentry/banner-carpentry-.webp",
        processImages: [
            "/images/niches/carpentry/img-carpentry-trim-molding.webp"
        ]
    },
    {
        id: "framing",
        title: "Framing",
        subtitle: "Estruturas de Madeira & Metal",
        icon: GridFour,
        tags: ["Structure", "Skeleton", "Residential", "Commercial"],
        group: "Construção & Reformas",
        description: "Framing é a espinha dorsal de qualquer construction americana. É o momento em que a estrutura surge do chão.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Sistemas de Framing",
        subNiches: [
            { id: "wood", title: "Wood Framing", description: "Padrão em 90%+ das casas residenciais nos EUA.", icon: "Tree" },
            { id: "steel", title: "Steel Framing", description: "Perfis metálicos para construção comercial e premium.", icon: "Nut" }
        ],
        workflowTitle: "Sequência de Framing",
        workflowSteps: [
            { title: "Floor Framing", description: "Vigas de piso (joists) sobre a fundação." },
            { title: "Wall Framing", description: "Studs verticais formando os painéis de parede." },
            { title: "Roof Framing", description: "Rafters ou trusses formando a estrutura do telhado." },
            { title: "Sheathing", description: "Painéis OSB fechando paredes e telhado." }
        ],
        goldenRule: "O momento em que as paredes são erguidas é universal e aspiracional.",
        whatWorksList: [
            "**Wall raising:** A equipe erguendo um painel de parede inteiro — ação pura.",
            "**Geometria:** Vista interna do telhado mostrando o padrão das vigas.",
            "**Escala:** Wide shots mostrando a casa inteira em esqueleto."
        ],
        keywords: ["wood framing", "wall studs", "roof trusses", "OSB sheathing", "floor joists", "wall raising"],
        proTip: "Use Wide Angle + Golden Hour para criar sombras dramáticas que fazem a estrutura parecer monumental.",
        bannerImage: "/images/niches/framing/banner-framing.webp",
        processImages: [
            "/images/niches/framing/img-framing-foundation-walls.webp",
            "/images/niches/framing/img-framing-lumber.webp",
            "/images/niches/framing/img-framing-framing-piso.webp",
            "/images/niches/framing/img-framing-steel-frame.webp",
            "/images/niches/framing/img-framing-framing-paredes.webp",
            "/images/niches/framing/img-framing-framing-telhado.webp",
            "/images/niches/framing/img-framing-wraping.webp",
            "/images/niches/framing/img-framing-inspecao.webp"
        ]
    },
    {
        id: "additions",
        title: "Home Additions",
        subtitle: "Expansão de Espaço Residencial",
        icon: PlusSquare,
        tags: ["Expansion", "High-Ticket", "Residential", "Value"],
        group: "Construção & Reformas",
        description: "Additions é o nicho de expandir o lar sem mudar de endereço. É um dos projetos mais emocionais de Home Services.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Tipos de Extensões",
        subNiches: [
            { id: "room", title: "Room Addition", description: "Quarto extra, escritório ou suíte para hóspedes.", icon: "Bed" },
            { id: "story", title: "Second Story", description: "Adicionar um andar completo à casa térrea.", icon: "House" },
            { id: "sunroom", title: "Sunroom", description: "Varanda fechada com vidro para lazer com luz natural.", icon: "Sun" }
        ],
        workflowSteps: [],
        goldenRule: "Additions retornam em média 60-80% do investimento no valor de revenda do imóvel.",
        whatWorksList: [
            "**Integração:** Mostrar como o novo combina perfeitamente com o antigo.",
            "**Matching:** Detalhes de paredes e pisos que seguem o padrão original.",
            "**Impacto:** O antes e depois com ângulo idêntico mostrando a nova área."
        ],
        keywords: ["home addition", "room addition", "second story", "sunroom", "open concept", "structural extension"],
        proTip: "Faça antes-e-depois com ângulo idêntico para que o cliente sinta a escala da transformação.",
        bannerImage: "/images/niches/additions/banner-new-addition.webp",
        processImages: [
            "/images/niches/additions/img-additions-fundacao.webp",
            "/images/niches/additions/img-additions-framing.webp",
            "/images/niches/additions/img-additions-plumbing.webp",
            "/images/niches/additions/img-additions-acabamento-exteriior.webp",
            "/images/niches/additions/img-additions-acabamento-interior.webp",
            "/images/niches/additions/img-additions-toques-finais.webp"
        ]
    },
    {
        id: "siding",
        title: "Siding",
        subtitle: "Revestimento Externo & Fachada",
        icon: SquaresFour,
        tags: ["Exterior", "Facade", "Protection", "Vinyl"],
        group: "Acabamentos & Superfícies",
        description: "Siding protege e define a identidade visual da casa. Trocar o siding tem um dos maiores impactos em 'curb appeal'.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Materiais Principais",
        subNiches: [
            { id: "vinyl", title: "Vinyl Siding", description: "Econômico, durável e de baixa manutenção.", icon: "Record" },
            { id: "hardie", title: "James Hardie", description: "Fiber cement premium, o padrão ouro do mercado.", icon: "ShieldCheck" },
            { id: "stone", title: "Stone Veneer", description: "Detalhes em pedra para acabamento de luxo.", icon: "Stone" }
        ],
        workflowSteps: [],
        goldenRule: "James Hardie é o nome que o cliente conhece e pede. Use isso para elevar seu ticket.",
        whatWorksList: [
            "**Fachada Total:** Antes e depois da frente da casa — transformação dramática.",
            "**Curb Appeal:** A casa nova brilhando com jardim e calçada impecáveis.",
            "**Detalhe:** Close-up do alinhamento perfeito dos painéis instalados."
        ],
        keywords: ["vinyl siding", "fiber cement", "James Hardie", "exterior cladding", "siding installation", "curb appeal"],
        proTip: "Use Wide Shot + Suburban Neighborhood para mostrar como a casa se destaca no bairro.",
        bannerImage: "/images/niches/siding/banner-siding-desk.webp",
        processImages: [
            "/images/niches/siding/img-remocao-siding.webp",
            "/images/niches/siding/img-flashing-tape.webp"
        ]
    },
    {
        id: "insulation",
        title: "Insulation",
        subtitle: "Eficiência Térmica & Acústica",
        icon: Thermometer,
        tags: ["Energy", "Comfort", "Savings", "Attic"],
        group: "Acabamentos & Superfícies",
        description: "Isolamento é o investimento invisível que vende conforto e economia de energia nas contas de luz e gás.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Tipos de Isolamento",
        subNiches: [
            { id: "spray", title: "Spray Foam", description: "Veda completamente e elimina infiltração de ar.", icon: "Wind" },
            { id: "blown", title: "Blown-In", description: "Ideal para sótãos (attics) sem abrir paredes.", icon: "Cloud" },
            { id: "fiber", title: "Fiberglass Batts", description: "O tradicional rolo de lã de vidro econômico.", icon: "LineSegments" }
        ],
        workflowSteps: [],
        goldenRule: "O cliente perde até 40% de energia por falta de isolamento. Venda a economia.",
        whatWorksList: [
            "**Expansão:** O spray foam expandindo e preenchendo lacunas.",
            "**Attic:** Sótão vazio vs. sótão com camada densa de proteção.",
            "**Conforto:** Família aquecida dentro de casa com gelo no exterior."
        ],
        keywords: ["spray foam insulation", "attic insulation", "blown-in insulation", "fiberglass batts", "energy efficient"],
        proTip: "Close-up do spray foam expandindo com Studio Lighting cria uma textura visual poderosa.",
        bannerImage: "/images/niches/insulation/banner-new-insulation.webp",
        processImages: [
            "/images/niches/insulation/img-insulation-florida-2.webp",
            "/images/niches/insulation/img-insulation-cleaning.webp",
            "/images/niches/insulation/img-insulation-material.webp",
            "/images/niches/insulation/img-insulation-mantas.webp",
            "/images/niches/insulation/img-insulation-ventilacao.webp",
            "/images/niches/insulation/img-insulation-fiberglass.webp",
            "/images/niches/insulation/img-insulation-cellulose.webp",
            "/images/niches/insulation/img-insulation-mineral-wool.webp",
            "/images/niches/insulation/img-insulation-spray-foam.webp",
            "/images/niches/insulation/img-insulation-rigid-foam.webp"
        ]
    },
    {
        id: "countertops",
        title: "Countertops",
        subtitle: "Bancadas de Quartzo, Granito & Mármore",
        icon: Table,
        tags: ["Kitchen", "Luxury", "Stone", "Quartz"],
        group: "Acabamentos & Superfícies",
        description: "Bancadas são o coração visual de qualquer cozinha ou banheiro. Textura, cor e brilho convencem pelo desejo.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Pedras e Materiais",
        subNiches: [
            { id: "quartz", title: "Quartz", description: "Não-poroso, durável e material #1 hoje nos EUA.", icon: "Gem" },
            { id: "granite", title: "Granite", description: "Pedra natural clássica e extremamente resistente.", icon: "Stone" },
            { id: "marble", title: "Marble", description: "O ápice do luxo visual, requer alta manutenção.", icon: "PaintBrush" }
        ],
        workflowSteps: [],
        goldenRule: "Quartz domina o mercado por unir beleza de pedra natural com zero manutenção.",
        whatWorksList: [
            "**Veining:** Close-up nos veios naturais do mármore ou quartzite.",
            "**Waterfall:** Bancada que desce até o chão — detalhe de luxo extremo.",
            "**Slab placement:** A placa enorme sendo instalada — transmite escala."
        ],
        keywords: ["quartz countertop", "granite slab", "marble veining", "kitchen island", "waterfall edge", "stone texture"],
        proTip: "Use Studio Lighting para criar reflexos na superfície polida que fazem o material 'saltar' da tela.",
        bannerImage: "/images/niches/countertops/banner-countertop.webp",
        processImages: [
            "/images/niches/countertops/img-card-medidas.webp",
            "/images/niches/countertops/img-countertop-remocao.webp",
            "/images/niches/countertops/img-countertop-preparacao.webp",
            "/images/niches/countertops/img-countertop-fabricacao.webp"
        ]
    },
    {
        id: "flooring",
        title: "Flooring (Geral)",
        subtitle: "Visão geral de todos os tipos de piso",
        icon: Stack,
        tags: ["Hardwood", "LVP", "Tile", "Epoxy"],
        group: "Pisos",
        description: "O mercado de pisos é muito visual e focado no acabamento perfeito.",
        readingTimeMin: 4,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Principais Tipos de Piso",
        subNiches: [],
        workflowSteps: [],
        goldenRule: "A transição perfeita é o que vende pisos.",
        whatWorksList: ["Fotos de piso brilhando.", "Detalhes de encaixe perfeito."],
        keywords: ["click-lock", "seamless", "underlayment"],
        proTip: "Para Hardwood mostre o antes e depois do lixamento.",
        bannerImage: "/images/niches/flooring/banner-flooring-ts-explore.webp",
        processImages: [
            "/images/niches/flooring/img-flooring-geral-1.webp"
        ]
    },
    {
        id: "estetica",
        title: "Estética",
        subtitle: "Clínicas, Skincare & Beleza nos EUA",
        icon: Sparkles,
        tags: ["Beauty", "Skincare", "Wellness", "Precision"],
        group: "Saúde & Beleza",
        description: "O nicho de estética nos EUA é marcado por alta fidelidade e ticket médio elevado. Criativos focados em higiene, precisão e o 'glow' pós-procedimento são fundamentais.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Segmentos de Estética",
        subNiches: [
            { id: "skincare", title: "Medical Skincare", description: "Peelings, lasers e tratamentos faciais avançados.", icon: "Sparkles" },
            { id: "hair", title: "Hair Styling", description: "Cortes, coloração e extensões de alto padrão.", icon: "User" },
            { id: "nail", title: "Nail Care", description: "Manicure, pedicure e extensões de gel modernas.", icon: "Hand" }
        ],
        workflowSteps: [
            { title: "Consulta & Diagnóstico", description: "Avaliação da pele e definição de protocolos personalizados." },
            { title: "Preparação", description: "Higienização profunda e assepsia do ambiente." },
            { title: "Procedimento", description: "Execução técnica com foco total no conforto do cliente." },
            { title: "Pós-Tratamento", description: "Orientações de home care e manutenção dos resultados." }
        ],
        goldenRule: "Limpeza extrema e resultados visíveis são os fatores que decidem a contratação.",
        whatWorksList: [
            "**The Glow:** Close-ups de pele saudável e iluminada pós-procedimento.",
            "**Biosafety:** Profissionais com luvas, máscaras e ambiente esterilizado.",
            "**Macro-shots:** Detalhes de produtos sendo aplicados na pele."
        ],
        keywords: ["medical aesthetic", "skincare clinic", "facial treatment", "beauty wellness", "aesthetic specialist"],
        proTip: "Use iluminação de estúdio difusa (Softbox) para evitar sombras duras e realçar a textura da pele.",
        bannerImage: "/images/niches/estetica/banner-estetica.webp",
        processImages: [
            "/images/niches/estetica/img-estetica-skincare.webp",
            "/images/niches/estetica/img-estetica-hair.webp",
            "/images/niches/estetica/img-estetica-nail.webp"
        ]
    },
    {
        id: "hardwood-flooring",
        title: "Hardwood",
        subtitle: "Solid & Engineered wood floors",
        icon: TreeEvergreen,
        tags: ["Premium", "Durable", "Oak", "Maple"],
        group: "Pisos",
        description: "Hardwood é o padrão ouro de pisos residenciais nos EUA. O veio natural da madeira e a longevidade fazem dele o piso mais aspiracional.",
        readingTimeMin: 6,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Sistemas de Hardwood",
        subNiches: [
            { id: "solid", title: "Solid Hardwood", description: "Peça maciça de madeira que pode ser refinada múltiplas vezes.", icon: "Tree" },
            { id: "engineered", title: "Engineered", description: "Camada real sobre base estável, resiste a umidade.", icon: "Nut" }
        ],
        workflowSteps: [],
        goldenRule: "Casas com hardwood floors vendem em média 2.5% a mais.",
        whatWorksList: [
            "**Wide Plank:** Tábuas mais largas para um look contemporâneo.",
            "**Wire-Brushed:** Textura rústica que realça o grão.",
            "**Natural:** O brilho da luz lateral revelando a profundidade da madeira."
        ],
        keywords: ["hardwood floor", "oak flooring", "wood grain", "wide plank", "natural finish", "wire-brushed"],
        proTip: "Use Natural Daylight + Side Light para realçar o veio da madeira criando profundidade."
    },
    {
        id: "luxury-vinyl-plank",
        title: "LVP",
        subtitle: "Luxury Vinyl Plank - 100% Waterproof",
        icon: ShieldCheck,
        tags: ["Waterproof", "Durable", "Versatile", "Flipper-friendly"],
        group: "Pisos",
        description: "LVP dominou o mercado na última década por ser 100% à prova d'água e imitar hardwood por uma fração do custo.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Categorias de LVP",
        subNiches: [
            { id: "spc", title: "SPC (Stone Core)", description: "Mais rígido, ideal para tráfego intenso e climas extremos.", icon: "Stone" },
            { id: "wpc", title: "WPC (Wood Core)", description: "Mais macio e confortável ao caminhar.", icon: "Cloud" }
        ],
        workflowSteps: [],
        goldenRule: "LVP é o favorito de flippers e proprietários pragmáticos por unir beleza e zero manutenção.",
        whatWorksList: [
            "**防水:** Mostrar o piso sob água se mantendo intacto.",
            "**Continuity:** O mesmo piso em toda a casa sem transições feias.",
            "**Kids & Pets:** Resistência a arranhões sendo demonstrada."
        ],
        keywords: ["luxury vinyl plank", "LVP flooring", "click-lock", "waterproof floor", "SPC core"],
        proTip: "Mostre a uniformidade estética em um Open Floor Plan para valorizar a continuidade do material."
    },
    {
        id: "epoxy-flooring",
        title: "Epoxy",
        subtitle: "Revestimentos para Garagens & Industrial",
        icon: PaintBucket,
        tags: ["Durable", "Glossy", "Garage", "Industrial"],
        group: "Pisos",
        description: "Epóxi transforma concreto cinza em superfícies brilhantes e resistentes. É o nicho com o 'antes e depois' mais dramático.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Sistemas Epóxi",
        subNiches: [
            { id: "flake", title: "Garage Flake", description: "Chips coloridos, o mais popular para garagens residenciais.", icon: "SquaresFour" },
            { id: "metallic", title: "Metallic Epoxy", description: "Efeito 3D espelhado com luxo extremo.", icon: "Sparkles" }
        ],
        workflowTitle: "Processo Técnico",
        workflowSteps: [
            { title: "Diamond Grinding", description: "Preparação profunda da superfície de concreto." },
            { title: "Crack Repair", description: "Reparo de todas as fissuras e falhas." },
            { title: "Decorative Layer", description: "Aplicação dos flakes ou pigmentos metálicos." },
            { title: "Top Coat", description: "Selante de alto brilho e resistência UV." }
        ],
        goldenRule: "O brilho espelhado do epóxi é o que faz o cliente parar o scroll e desejar a transformação.",
        whatWorksList: [
            "**Reflexão:** Fotos mostrando o brilho total do piso sob luzes fortes.",
            "**Transformação:** Garagem suja vs. garagem de showroom.",
            "**Resistência:** Demonstrar imunidade a manchas de óleo."
        ],
        keywords: ["epoxy garage floor", "metallic epoxy", "flake epoxy", "glossy floor", "diamond grinding"],
        proTip: "Use Studio Lighting + Wide Shot para capturar a reflexão total que é o ponto forte do nicho."
    },
    {
        id: "sand-and-refinish",
        title: "Sand & Refinish",
        subtitle: "Restauração de Pisos de Madeira",
        icon: Recycle,
        tags: ["Restoration", "Eco-friendly", "Value", "Dustless"],
        group: "Pisos",
        description: "Restaurar hardwood existente é a 'virada de mesa' mais dramática. Transforma madeira velha em algo novo.",
        readingTimeMin: 5,
        demandLevel: "Alta Demanda",
        subNichesTitle: "Processo de Restauração",
        subNiches: [
            { id: "dustless", title: "Dustless Sanding", description: "Lixamento sem sujeira com sucção integrada.", icon: "Wind" },
            { id: "stain", title: "Custom Staining", description: "Mudança total da cor original do piso.", icon: "PaintBrush" }
        ],
        workflowTitle: "Etapas da Obra",
        workflowSteps: [
            { title: "Coarse Sanding", description: "Remoção de verniz antigo e nivelamento grosso." },
            { title: "Fine Sanding", description: "Superfície lixada ao ponto de ficar perfeitamente lisa." },
            { title: "Staining", description: "Tingimento opcional da cor da madeira." },
            { title: "Finishing", description: "Aplicação de múltiplas camadas de verniz protetor." }
        ],
        goldenRule: "Venda o 'Dustless Sanding' — o cliente paga mais para não ter poeira na casa inteira.",
        whatWorksList: [
            "**Lixamento:** O contraste da lixadeira passando e revelando a madeira clara.",
            "**Cor:** Mudança drástica de tom (ex: do amarelo para o cinza/ebony).",
            "**Renovação:** Pisos riscados por pets que voltam a parecer novos."
        ],
        keywords: ["hardwood refinishing", "floor sanding", "dustless sanding", "wood stain", "polyurethane"],
        proTip: "O antes-e-depois de Sand & Refinish é o criativo com maior taxa de salvamento do nicho."
    }
]

export function getNicheById(id: string): NicheData | undefined {
    return nichesData.find(n => n.id === id)
}

export function getAllNiches(): NicheData[] {
    return nichesData
}
