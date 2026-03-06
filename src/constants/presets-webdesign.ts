export interface PresetWebDesign {
    id: string;
    title: string;
    image: string;
    data: {
        pageType: string;
        niche: string;
        nicheOther?: string;
        primaryColor: string;
        secondaryColor: string;
        bgColor: string;
        textColor: string;
        fontFamily: string;
        borderRadius: string;
        copyTone: string;
        keyFeature: string;
        productName: string;
        promise: string;
    };
}

export const PRESETS_WEBDESIGN: PresetWebDesign[] = [
    {
        id: "vsl-black",
        title: "VSL Dark High-Tech",
        image: "/presets/vsl-dark.jpeg", // Note: Need dummy/placeholder images or use existing
        data: {
            pageType: "vsl",
            niche: "info-business",
            primaryColor: "#00FF66",
            secondaryColor: "#111111",
            bgColor: "#050505",
            textColor: "#EEEEEE",
            fontFamily: "Inter",
            borderRadius: "rounded-md",
            copyTone: "dor",
            keyFeature: "video-delay",
            productName: "Método Tech Mastery",
            promise: "Domine as ferramentas de código em 30 dias mesmo começando do zero."
        }
    },
    {
        id: "home-services",
        title: "Landing Page Serviços Locais",
        image: "/presets/services-clean.jpeg",
        data: {
            pageType: "landing-page",
            niche: "construction",
            primaryColor: "#FF6B00",
            secondaryColor: "#2F3542",
            bgColor: "#FAFAFA",
            textColor: "#333333",
            fontFamily: "Poppins",
            borderRadius: "rounded-xl",
            copyTone: "autoridade",
            keyFeature: "faq",
            productName: "Serviços de Remodelação Premium",
            promise: "Transformamos sua casa no lar dos seus sonhos com qualidade e garantia de 10 anos."
        }
    },
    {
        id: "squeeze-minimalist",
        title: "Squeeze Page Clean",
        image: "/presets/squeeze-clean.jpeg",
        data: {
            pageType: "squeeze-page",
            niche: "health-beauty",
            primaryColor: "#845EC2",
            secondaryColor: "#F3C5FF",
            bgColor: "#FFFFFF",
            textColor: "#2C2C2C",
            fontFamily: "Outfit",
            borderRadius: "rounded-full",
            copyTone: "transformacao",
            keyFeature: "social-proof",
            productName: "Guia Skincare Natural 2026",
            promise: "Descubra os 3 segredos para uma pele perfeitamente limpa sem usar produtos químicos pesados."
        }
    }
];
