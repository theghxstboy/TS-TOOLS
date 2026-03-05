"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Buildings,
    Wrench,
    Tree,
    GridFour,
    PlusSquare,
    PaintRoller,
    HouseLine,
    SquaresFour,
    Thermometer,
    Table,
    Stack,
    TreeEvergreen,
    ShieldCheck,
    PaintBucket,
    Recycle,
    Plant,
    Broom,
    MagnifyingGlass,
    ArrowRight
} from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"

// Data structure
const niches = [
    {
        id: "construction",
        title: "Construction",
        subtitle: "Construção Residencial & Comercial",
        icon: Buildings,
        tags: ["Fundação", "Framing", "Drywall", "Inspeções"],
        group: "Construção & Reformas"
    },
    {
        id: "remodeling",
        title: "Remodeling",
        subtitle: "Reformas & Renovações Internas",
        icon: Wrench,
        tags: ["Kitchen", "Bathroom", "Basement", "Drywall"],
        group: "Construção & Reformas"
    },
    {
        id: "carpentry",
        title: "Carpentry",
        subtitle: "Marcenaria & Acabamentos em Madeira",
        icon: Tree,
        tags: ["Trim", "Cabinets", "Stairs", "Wood Rot"],
        group: "Construção & Reformas"
    },
    {
        id: "framing",
        title: "Framing",
        subtitle: "Estrutura & Enquadramento",
        icon: GridFour,
        tags: ["Paredes", "Telhado", "Steel Framing"],
        group: "Construção & Reformas"
    },
    {
        id: "additions",
        title: "Additions",
        subtitle: "Ampliações & Room Additions",
        icon: PlusSquare,
        tags: ["Room Addition", "Alvarás", "Expansão"],
        group: "Construção & Reformas"
    },
    {
        id: "painting",
        title: "Painting",
        subtitle: "Pintura Interior, Exterior & Armários",
        icon: PaintRoller,
        tags: ["Interior", "Exterior", "Cabinet", "Primer"],
        group: "Acabamentos & Superfícies"
    },
    {
        id: "roofing",
        title: "Roofing",
        subtitle: "Telhados, Telhas & Impermeabilização",
        icon: HouseLine,
        tags: ["Shingles", "Metal", "Flat Roof", "Flashing"],
        group: "Acabamentos & Superfícies"
    },
    {
        id: "siding",
        title: "Siding",
        subtitle: "Revestimento Externo de Fachadas",
        icon: SquaresFour,
        tags: ["Vinyl", "Fiber Cement", "Wood"],
        group: "Acabamentos & Superfícies"
    },
    {
        id: "insulation",
        title: "Insulation",
        subtitle: "Isolamento Térmico & Acústico",
        icon: Thermometer,
        tags: ["Attic", "Spray Foam", "Fiberglass"],
        group: "Acabamentos & Superfícies"
    },
    {
        id: "countertops",
        title: "Countertops",
        subtitle: "Bancadas em Granito, Quartzo & Mármore",
        icon: Table,
        tags: ["Granite", "Quartz", "Marble", "Instalação"],
        group: "Acabamentos & Superfícies"
    },
    {
        id: "flooring",
        title: "Flooring (Geral)",
        subtitle: "Visão geral de todos os tipos de piso",
        icon: Stack,
        tags: ["Hardwood", "LVP", "Tile", "Epoxy"],
        group: "Pisos"
    },
    {
        id: "hardwood-flooring",
        title: "Hardwood Flooring",
        subtitle: "Madeira Sólida & Engenheirada",
        icon: TreeEvergreen,
        tags: ["Solid", "Engineered", "Oak", "Refinish"],
        group: "Pisos"
    },
    {
        id: "luxury-vinyl-plank",
        title: "Luxury Vinyl Plank",
        subtitle: "LVP — O Piso que Domina o Mercado",
        icon: ShieldCheck,
        tags: ["Waterproof", "Click-Lock", "Durabilidade"],
        group: "Pisos"
    },
    {
        id: "epoxy-flooring",
        title: "Epoxy Flooring",
        subtitle: "Revestimento Epóxi para Garagens & Comercial",
        icon: PaintBucket,
        tags: ["Garage", "Metallic", "Anti-slip"],
        group: "Pisos"
    },
    {
        id: "sand-and-refinish",
        title: "Sand & Refinish",
        subtitle: "Restauração de Pisos de Madeira",
        icon: Recycle,
        tags: ["Lixamento", "Stain", "Verniz"],
        group: "Pisos"
    },
    {
        id: "landscaping",
        title: "Landscaping",
        subtitle: "Paisagismo, Jardins & Hardscaping",
        icon: Plant,
        tags: ["Patio", "Lawn Care", "Irrigation", "Pavers"],
        group: "Exterior & Jardim"
    },
    {
        id: "cleaning",
        title: "Cleaning",
        subtitle: "Residencial, Comercial & Especializado",
        icon: Broom,
        tags: ["Deep Clean", "Move-In/Out", "Janitorial"],
        group: "Serviços & Limpeza"
    }
]

export default function NichosPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredNiches = niches.filter(niche => {
        const query = searchQuery.toLowerCase()
        return (
            niche.title.toLowerCase().includes(query) ||
            niche.subtitle.toLowerCase().includes(query) ||
            niche.tags.some(tag => tag.toLowerCase().includes(query)) ||
            niche.group.toLowerCase().includes(query)
        )
    })

    // Group the filtered niches back by their original groups
    const groups = [...new Set(filteredNiches.map(n => n.group))]

    return (
        <div className="flex flex-col min-h-screen bg-input">

            {/* Hero Section */}
            <div className="pt-20 pb-12 px-6 text-center border-b border-border bg-gradient-to-b from-amber-500/10 to-transparent relative">
                <div className="absolute top-8 left-8 md:top-12 md:left-12">
                    <Link href="/docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
                        <ArrowLeft size={20} weight="bold" />
                        Voltar para Academy
                    </Link>
                </div>

                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    <Buildings size={16} weight="fill" />
                    Home Services EUA
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                    Manual dos <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400">Nichos</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                    Conheça em profundidade os serviços que você vai vender. Entender o nicho é o que separa um criativo genérico de um anúncio que converte de verdade.
                </p>
            </div>

            {/* Sticky Search Bar */}
            <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border py-4 px-6 shadow-sm">
                <div className="max-w-3xl mx-auto flex items-center relative">
                    <MagnifyingGlass size={20} className="absolute left-4 text-muted-foreground" weight="bold" />
                    <Input
                        type="text"
                        placeholder="Pesquisar nicho — ex: painting, flooring, roofing..."
                        className="w-full pl-12 pr-24 py-6 rounded-xl border-gray-300 focus-visible:ring-primary text-base shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="absolute right-4 text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {filteredNiches.length} {filteredNiches.length === 1 ? 'nicho' : 'nichos'}
                    </span>
                </div>
            </div>

            {/* Niches List */}
            <main className="flex-1 max-w-6xl mx-auto w-full py-12 px-6">

                {filteredNiches.length === 0 ? (
                    <div className="text-center py-20">
                        <MagnifyingGlass size={64} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">Nenhum nicho encontrado</h3>
                        <p className="text-muted-foreground">Tente buscar por termos como "painting", "flooring" ou "roofing".</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {groups.map(groupName => {
                            const groupNiches = filteredNiches.filter(n => n.group === groupName)

                            return (
                                <div key={groupName} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{groupName}</h2>
                                        <div className="h-px w-full bg-gray-200"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupNiches.map(niche => (
                                            <Link href={`/docs/nichos/${niche.id}`} key={niche.id} className="group flex flex-col bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                                                {/* Hover bar indicator */}
                                                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                                                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 border border-orange-100">
                                                    <niche.icon size={28} weight="duotone" />
                                                </div>

                                                <div className="mb-4">
                                                    <h3 className="text-xl font-bold text-foreground mb-1">{niche.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{niche.subtitle}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-auto mb-6">
                                                    {niche.tags.map(tag => (
                                                        <span key={tag} className="text-[0.65rem] font-bold px-2 py-1 bg-muted text-muted-foreground rounded uppercase tracking-wider">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                    Ler guia detalhado <ArrowRight size={16} weight="bold" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

            </main>

            <footer className="text-center py-8 border-t border-border text-muted-foreground text-sm mt-auto">
                <p>TS TOOLS Academy &copy; {new Date().getFullYear()}. Documentação Interna para o Grupo TS.</p>
            </footer>
        </div>
    )
}
