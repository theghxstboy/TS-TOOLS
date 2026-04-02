import {
    ShieldCheck,
    CheckCircle,
    Trophy,
    Award,
    Lock,
    Truck,
    Star,
    Shield,
    Hexagon,
    Badge,
    Bookmark,
    Layers,
    CircleDashed,
    LucideIcon
} from "lucide-react";

export interface PresetSelo {
    id: string;
    title: string;
    subtitle?: string;
    icon: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    shape: string;
    material: string;
    mode: "vetorial" | "3d" | "other";
    image?: string;
}

export const PRESETS_SELOS: PresetSelo[] = [
    {
        id: "certified-3d-gold",
        title: "CERTIFIED",
        subtitle: "Professional Expert",
        icon: "ShieldCheck",
        primaryColor: "#000000",
        secondaryColor: "#D4AF37", // Gold
        textColor: "#FFFFFF",
        shape: "serrated",
        material: "gold-foil",
        mode: "3d",
        image: "/images/presets-selos/certified.jpeg"
    },
    {
        id: "authorized-vector-emerald",
        title: "AUTHORIZED",
        subtitle: "Verified Partner",
        icon: "CheckCircle",
        primaryColor: "#064E3B", // Deep Emerald
        secondaryColor: "#10B981", // Emerald
        textColor: "#FFFFFF",
        shape: "shield",
        material: "flat-matte",
        mode: "vetorial",
        image: "/images/presets-selos/authorized.jpeg"
    },
    {
        id: "premium-3d-silver",
        title: "PREMIUM",
        subtitle: "Luxury Standard",
        icon: "Trophy",
        primaryColor: "#111827", // Gray 900
        secondaryColor: "#9CA3AF", // Silver
        textColor: "#FFFFFF",
        shape: "double-serrated",
        material: "chrome-metal",
        mode: "3d",
        image: "/images/presets-selos/premium.jpeg"
    },
    {
        id: "guarantee-vector-blue",
        title: "GUARANTEE",
        subtitle: "Secure Payments",
        icon: "Lock",
        primaryColor: "#002366", // Royal Navy
        secondaryColor: "#3B82F6", // Blue
        textColor: "#FFFFFF",
        shape: "ribbon",
        material: "solid-vector",
        mode: "vetorial",
        image: "/images/presets-selos/guarantee.jpeg"
    },
    {
        id: "shipping-3d-fast",
        title: "FAST SHIPPING",
        subtitle: "Priority Logistics",
        icon: "Truck",
        primaryColor: "#000000",
        secondaryColor: "#F59E0B", // Amber
        textColor: "#FFFFFF",
        shape: "badge",
        material: "glossy-plastic",
        mode: "3d",
        image: "/images/presets-selos/fast-shipping.jpeg"
    }
];

export const SEAL_SHAPES = [
    { id: "serrated", label: "Circular (Serrilha)", icon: CircleDashed, description: "Classic certification seal" },
    { id: "double-serrated", label: "Dupla Serrilha", icon: Layers, description: "High-authority double layer" },
    { id: "shield", label: "Escudo (Segurança)", icon: Shield, description: "Trust-building badge" },
    { id: "hexagon", label: "Hexágono Moderno", icon: Hexagon, description: "Modern technical mark" },
    { id: "ribbon", label: "Faixa / Ribbon", icon: Bookmark, description: "Traditional award style" },
    { id: "badge", label: "Selo Simples", icon: Badge, description: "Clean circular mark" },
    { id: "other", label: "Customizado...", icon: CircleDashed, description: "Define manually" }
];

export const SEAL_MATERIALS = [
    { id: "gold-foil", label: "Dourado Metálico", description: "Premium metallic gold" },
    { id: "chrome-metal", label: "Chrome / Prateado", description: "Shiny luxury metal" },
    { id: "glossy-plastic", label: "Plástico Brilhante", description: "Pops out with highlights" },
    { id: "flat-matte", label: "Fosco Minimalista", description: "Clean and flat design" },
    { id: "solid-vector", label: "Vetor Solid Color", description: "Basic high contrast" },
    { id: "other", label: "Customizado...", description: "Define manually" }
];

export const SEAL_ICONS = [
    { id: "ShieldCheck", label: "Escudo Check", icon: ShieldCheck },
    { id: "CheckCircle", label: "Círculo Check", icon: CheckCircle },
    { id: "Trophy", label: "Troféu (Elite)", icon: Trophy },
    { id: "Award", label: "Medalha Oficinal", icon: Award },
    { id: "Lock", label: "Cadeado (Seguro)", icon: Lock },
    { id: "Truck", label: "Caminhão (Entrega)", icon: Truck },
    { id: "Star", label: "Estrela (Rating)", icon: Star },
    { id: "other", label: "Outro Ícone...", icon: CircleDashed }
];
