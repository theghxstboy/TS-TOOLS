"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
    ArrowLeft,
    Clock,
    TrendUp,
    ListChecks,
    ArrowsDownUp,
    MagicWand,
    Translate,
    CheckCircle
} from "@phosphor-icons/react"
import { getNicheById, nichesData } from "@/data/niches"

export default function NicheDocPage({
    params,
}: {
    params: Promise<{ nicheId: string }>
}) {
    const { nicheId } = use(params)
    const niche = getNicheById(nicheId)

    if (!niche) {
        notFound()
    }

    // Sidebar grouping logic
    const groups = [...new Set(nichesData.map(n => n.group))]

    return (
        <div className="flex min-h-screen bg-card">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 border-r border-border bg-input h-screen sticky top-0 overflow-y-auto custom-scrollbar p-6">
                <Link href="/docs/nichos" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-semibold mb-8">
                    <ArrowLeft size={18} weight="bold" />
                    Manual dos Nichos
                </Link>

                <div className="space-y-8">
                    {groups.map(group => (
                        <div key={group} className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                {group}
                            </h3>
                            <div className="space-y-1 pl-2 border-l border-border">
                                {nichesData.filter(n => n.group === group).map(n => (
                                    <Link
                                        key={n.id}
                                        href={`/docs/nichos/${n.id}`}
                                        className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${n.id === niche.id
                                                ? 'bg-primary/10 text-primary font-bold border border-orange-100'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {n.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl px-6 py-8 md:py-16 md:px-12 mx-auto">
                <div className="lg:hidden mb-8">
                    <Link href="/docs/nichos" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">
                        <ArrowLeft size={18} weight="bold" />
                        Voltar ao Manual
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-12 pb-8 border-b border-border">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-orange-100 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <niche.icon size={16} weight="fill" />
                        {niche.title}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                        {niche.title}
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                        {niche.description.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-foreground font-bold">{part}</strong> : part)}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-2">
                            <Clock size={18} weight="duotone" className="text-muted-foreground" />
                            {niche.readingTimeMin} min de leitura
                        </span>
                        <span className="flex items-center gap-2">
                            <niche.icon size={18} weight="duotone" className="text-muted-foreground" />
                            {niche.group}
                        </span>
                        <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                            <TrendUp size={18} weight="bold" />
                            {niche.demandLevel}
                        </span>
                    </div>
                </header>

                <section className="prose prose-lg prose-orange max-w-none text-muted-foreground leading-relax">

                    {/* SubNiches */}
                    {niche.subNiches && niche.subNiches.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-primary mb-6">
                                <ListChecks size={28} weight="duotone" />
                                {niche.subNichesTitle}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
                                {niche.subNiches.map(sub => (
                                    <div key={sub.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                        <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                                            {sub.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed m-0">{sub.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Workflow */}
                    {niche.workflowSteps && niche.workflowSteps.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-primary mb-4">
                                <ArrowsDownUp size={28} weight="duotone" />
                                {niche.workflowTitle}
                            </h2>
                            {niche.workflowDescription && <p className="mb-8">{niche.workflowDescription.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-foreground font-bold">{part}</strong> : part)}</p>}

                            <div className="space-y-0 not-prose">
                                {niche.workflowSteps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 py-4 border-b border-border last:border-0 relative">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-extrabold flex items-center justify-center shrink-0 mt-1">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <strong className="block text-foreground text-base mb-1">{step.title}</strong>
                                            <span className="text-sm text-muted-foreground leading-relaxed">{step.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* What works */}
                    {niche.goldenRule && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-primary mb-6">
                                <MagicWand size={28} weight="duotone" />
                                O que Funciona em Criativos de {niche.title}
                            </h2>

                            <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl mb-8 not-prose">
                                <strong className="text-amber-700 block mb-1">💡 Regra de Ouro:</strong>
                                <p className="text-gray-700 text-sm leading-relaxed">{niche.goldenRule}</p>
                            </div>

                            <ul className="space-y-3 pl-5 list-disc marker:text-primary">
                                {niche.whatWorksList.map((item, idx) => (
                                    <li key={idx} className="pl-2">
                                        {item.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-foreground font-bold">{part}</strong> : part)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Keywords */}
                    {niche.keywords && niche.keywords.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-primary mb-4">
                                <Translate size={28} weight="duotone" />
                                Vocabulário Técnico para Prompts
                            </h2>
                            <p className="mb-6">Use esses termos em inglês para criar prompts mais precisos e autorais (compatível direto com nosso gerador):</p>

                            <div className="bg-input border border-border p-6 rounded-xl flex flex-wrap gap-2 not-prose">
                                {niche.keywords.map(kw => (
                                    <span key={kw} className="bg-card border border-border px-3 py-1.5 rounded-full text-sm text-primary font-mono font-bold shadow-sm">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pro Tip */}
                    {niche.proTip && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-xl my-8 not-prose">
                            <strong className="text-emerald-700 flex items-center gap-2 mb-2 text-base">
                                <CheckCircle size={20} weight="fill" />
                                Pro Tip para Gerador:
                            </strong>
                            <p className="text-emerald-900 text-sm leading-relaxed">{niche.proTip.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part)}</p>
                        </div>
                    )}

                </section>
            </main>
        </div>
    )
}
