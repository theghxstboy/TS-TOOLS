export type OutputMode = "imagem" | "video";
export type GeneratorMode = "simple" | "advanced";
export type TabKey = "rosto" | "acessorios" | "corpo" | "dispositivo" | "ambiente" | "enquadramento" | "iluminacao" | "outros";

export interface CommandOption {
    id: string;
    title: string;
    description: string;
    promptText: string;
}

export const CHECKBOX_COMMANDS: Record<TabKey, CommandOption[]> = {
    rosto: [
        { id: "cabelo_natural", title: "Cabelo mais natural", description: "Deixar o cabelo menos perfeito, com algum frizz.", promptText: "natural hair with slight frizz, imperfect hairstyling" },
        { id: "pele_imperfeita", title: "Pele com imperfeições", description: "Textura de pele mais realista", promptText: "raw skin texture, visible pores, slight skin imperfections, highly detailed skin photography" },
        { id: "pele_oleosa", title: "Pele oleosa", description: "Brilho natural em áreas específicas", promptText: "slight oily shine on forehead and nose, natural specular highlights on skin" },
        { id: "cabelo_molhado", title: "Cabelo molhado", description: "Fios úmidos, desalinhados e naturais.", promptText: "damp messy hair, wet hair strands" },
    ],
    acessorios: [
        { id: "roupa_amassada", title: "Roupa levemente amassada", description: "Dobras naturais e irregulares.", promptText: "slightly wrinkled clothing fabric, natural uneven fabric folds" },
        { id: "costuras_visiveis", title: "Costuras e detalhes visíveis", description: "Acabamento não perfeito, mas detalhista.", promptText: "visible clothing seams, macro fabric details, imperfect stitching" },
        { id: "desgaste", title: "Tecido com desgaste sutil", description: "Sinais leves de uso das roupas.", promptText: "subtle clothing wear and tear, slightly faded fabric" },
    ],
    corpo: [
        { id: "postura_relaxada", title: "Postura relaxada/assimétrica", description: "Menos 'modelo', mais vida real.", promptText: "casual relaxed posture, asymmetrical natural pose, candid body language" },
        { id: "maos_movimento", title: "Mãos em movimento natural", description: "Evita mãos estáticas perfeitas.", promptText: "hands engaged in natural movement, dynamic hand gesture" },
    ],
    dispositivo: [
        { id: "iphone", title: "Estilo foto de iPhone", description: "Selfie nativa, sem edição profissional.", promptText: "shot on iPhone 15 Pro Max, front camera selfie style, unaltered smartphone photo look" },
        { id: "polaroid", title: "Estilo Polaroid", description: "Cores estouradas, flash forte.", promptText: "Polaroid instant film look, direct harsh flash, washed out colors" },
        { id: "gopro", title: "Lente grande angular (GoPro)", description: "Distorção natural nas bordas.", promptText: "shot on GoPro Hero 12, ultra-wide angle lens distortion" },
    ],
    ambiente: [
        { id: "rua_movimentada", title: "Rua Movimentada", description: "Fundo de cidade com movimento.", promptText: "busy city street background" },
        { id: "fundo_desfocado", title: "Fundo Desfocado (Bokeh)", description: "Atenção focada na pessoa.", promptText: "beautiful background bokeh, shallow depth of field, blurred background" },
        { id: "distracoes", title: "Elementos distrativos", description: "Pessoas irreconhecíveis ao fundo.", promptText: "busy background elements, subtle background distractions, out of focus people in background" },
        { id: "escritorio", title: "Escritório corporativo", description: "Luzes de escritório, ambiente de trabalho.", promptText: "modern corporate office background" },
    ],
    enquadramento: [
        { id: "selfie_perto", title: "Selfie de perto", description: "Corta os ombros, foca no rosto.", promptText: "tight face selfie, extreme close-up portrait framing" },
        { id: "plano_medio", title: "Plano médio", description: "Mostra do peito/cintura para cima.", promptText: "medium shot, framing from waist up" },
        { id: "camera_baixa", title: "Câmera de plano baixo", description: "Pessoa olhando levemente para baixo.", promptText: "low angle shot, looking slightly up at the subject" },
        { id: "corpo_inteiro", title: "Corpo Inteiro", description: "Mostra a pessoa dos pés a cabeça.", promptText: "full body shot framing" },
    ],
    iluminacao: [
        { id: "iluminacao_natural", title: "Luz natural imperfeita", description: "Luz de janela, sem estúdio.", promptText: "imperfect natural lighting, practical window light, unpolished lighting setup" },
        { id: "golden_hour", title: "Golden hour (Por do sol)", description: "Luz quente no fim de tarde.", promptText: "golden hour backlighting, warm setting sun light" },
        { id: "fluorescente", title: "Luz fluorescente (Clínica/Loja)", description: "Tonalidade esverdeada de hospital.", promptText: "overhead fluorescent office lighting, slightly green clinical tint" },
        { id: "neon", title: "Neon noturno", description: "Luzes noturnas, reflexos nas ruas.", promptText: "vibrant neon city lights at night, pink and blue ambient glow" },
        { id: "dim_lighting", title: "Luz Baixa (Escuro)", description: "Apenas iluminação ambiente ou telas.", promptText: "dim lighting, dark room slightly illuminated" },
    ],
    outros: [
        { id: "ruido", title: "Leve ruído/granulação de filme", description: "Dá textura de foto real (ISO alto).", promptText: "high ISO film grain, subtle image noise, vintage film texture" },
        { id: "baixa_res", title: "Baixa resolução (Compressão Social)", description: "Perda de qualidade proposital do Instagram.", promptText: "social media compression artifacts, slightly compressed image quality" },
    ]
};

export const PRESETS = [
    {
        id: "vlog", title: "[Foto] Vlog na rua", color: "bg-blue-500/10",
        image: "/vlog.jpeg",
        basePrompt: "Candid vlog style photo of a person walking on a busy city street, holding the camera looking like a vlogger, casual everyday clothing."
    },
    {
        id: "carro", title: "[Foto] Selfie no carro", color: "bg-green-500/10",
        image: "/carro.jpg",
        basePrompt: "Selfie taken inside a parked car during daylight, natural window light illuminating the face, casual look."
    },
    {
        id: "escuro", title: "[Foto] Stories no escuro", color: "bg-purple-500/10",
        image: "/escuro.jpg",
        basePrompt: "Nighttime dim lighting selfie for an Instagram story, faces illuminated only by the glow of a smartphone screen in a dark room."
    },
    {
        id: "elevador", title: "[Foto] Selfie no elevador", color: "bg-orange-500/10",
        image: "/elevador.jpg",
        basePrompt: "Full body mirror selfie taken inside a modern corporate elevator, fluorescent lighting."
    },
    {
        id: "caseiro", title: "[Foto] Vlog caseiro", color: "bg-pink-500/10",
        image: "/caseiro.jpg",
        basePrompt: "Casual home vlog style photo of a person sitting in their living room, cozy messy house background, talking to the camera."
    }
];

export const TABS: { id: TabKey, label: string }[] = [
    { id: "rosto", label: "Rosto e pele" },
    { id: "acessorios", label: "Acessórios" },
    { id: "ambiente", label: "Ambiente" },
    { id: "corpo", label: "Corpo" },
    { id: "dispositivo", label: "Dispositivo" },
    { id: "enquadramento", label: "Enquadramento" },
    { id: "iluminacao", label: "Iluminação" },
    { id: "outros", label: "Outros" }
];
