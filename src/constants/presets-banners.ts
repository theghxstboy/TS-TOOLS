export interface BannerPreset {
    id: string;
    title: string;
    description: string;
    image?: string;
    keywords: string[];
}

export const BANNER_NICHES = [
    { id: "roofing", label: "Roofing (Telhados)", group: "Exterior" },
    { id: "siding", label: "Siding (Revestimento)", group: "Exterior" },
    { id: "painting", label: "Painting (Pintura)", group: "Exterior" },
    { id: "landscaping", label: "Landscaping (Paisagismo)", group: "Exterior" },
    { id: "decks", label: "Decks & Patios", group: "Exterior" },
    { id: "pressure-washing", label: "Pressure Washing", group: "Exterior" },
    { id: "hvac", label: "HVAC (Ar Condicionado)", group: "Interior" },
    { id: "plumbing", label: "Plumbing (Encanamento)", group: "Interior" },
    { id: "electrical", label: "Electrical (Elétrica)", group: "Interior" },
    { id: "kitchen-remodel", label: "Kitchen Remodeling", group: "Interior" },
    { id: "bathroom-remodel", label: "Bathroom Remodeling", group: "Interior" },
    { id: "flooring", label: "Flooring (Pisos)", group: "Interior" },
    { id: "cleaning", label: "Cleaning (Limpeza)", group: "Interior" },
    { id: "other", label: "Outro (Personalizado)", group: "Geral" },
];

export const BANNER_STYLES = [
    { id: "photorealistic", label: "Fotorealista (High-End)", description: "Fotos reais de alta qualidade, iluminação natural." },
    { id: "modern-minimalist", label: "Moderno Minimalista", description: "Design limpo, foco em texturas e espaços vazios." },
    { id: "industrial", label: "Industrial / Work", description: "Foco em ferramentas, mãos trabalhando, tom profissional." },
    { id: "abstract-tech", label: "Abstrato Tech", description: "Formas geométricas, luzes, focado em tecnologia/software." },
    { id: "luxury", label: "Luxo / Elegante", description: "Materiais nobres, acabamento refinado, tons sóbrios." },
];

export const BANNER_RATIOS = [
    { id: "desktop-hd", label: "Desktop HD (16:9)", value: "1920x1080", ratio: "16/9" },
    { id: "desktop-standard", label: "Desktop Standard (1200x628)", value: "1200x628", ratio: "1.91/1" },
    { id: "mobile-tall", label: "Mobile Instagram/Story (9:16)", value: "1080x1920", ratio: "9/16" },
    { id: "mobile-feed", label: "Mobile Feed (4:5)", value: "1080x1350", ratio: "4/5" },
    { id: "square", label: "Quadrado (1:1)", value: "1080x1080", ratio: "1/1" },
];

export const BANNER_COMPOSITIONS = [
    { id: "left", label: "Texto na Esquerda", description: "Imagem principal na direita, espaço vazio na esquerda." },
    { id: "right", label: "Texto na Direita", description: "Imagem principal na esquerda, espaço vazio na direita." },
    { id: "center", label: "Texto no Centro", description: "Imagem balanceada nas bordas, foco central limpo." },
    { id: "bottom", label: "Texto na Base (H-Banner)", description: "Imagem no topo, Degradê/Espaço na parte inferior." },
    { id: "top", label: "Texto no Topo", description: "Imagem na base, céu ou teto limpo no topo." },
];
