"use client"

import Link from "next/link"
import {
    ArrowLeft,
    RocketLaunch,
    BookOpen,
    Lightbulb,
    CheckCircle,
    Info,
    ArrowRight
} from "@phosphor-icons/react"

export default function InicioRapidoPage() {
    return (
        <div className="flex flex-col min-h-screen bg-input">
            {/* Header / Breadcrumbs */}
            <div className="pt-20 pb-12 px-6 border-b border-border bg-card">
                <div className="max-w-4xl mx-auto">
                    <Link href="/docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm mb-8 group">
                        <ArrowLeft size={18} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                        Voltar para Academy
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <RocketLaunch size={32} weight="duotone" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                            Início Rápido
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        Tudo o que você precisa saber para começar a produzir criativos de alta performance com a TS TOOLS.
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
                <div className="prose prose-invert max-w-none space-y-12">

                    {/* Section 1 */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-sm">
                            <BookOpen size={20} weight="fill" />
                            O que é a TS TOOLS?
                        </div>
                        <div className="bg-card rounded-2xl border border-border p-8 leading-relaxed text-muted-foreground text-lg italic">
                            "A TS TOOLS não é apenas um gerador de textos. É a nossa central de inteligência e automação desenhada para dominar o mercado de Home Services nos EUA."
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            O sistema utiliza modelos de ponta (Gemini Pro) para estruturar o pensamento estratégico. Enquanto usuários comuns "conversam" com a IA, nós utilizamos <strong>Engenharia de Prompt</strong> para extrair resultados profissionais, específicos e prontos para venda.
                        </p>
                    </section>

                    {/* Section 2: O Ecossistema */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">O Ecossistema Gemini + Flow AI</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-card border border-border hover:border-blue-500/50 transition-colors">
                                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">G</div>
                                    Gemini Pro (Flow Text)
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Nosso cérebro estratégico. Use para roteiros, legendas, análise de nichos e refinamento de ganchos de venda.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-card border border-border hover:border-orange-500/50 transition-colors">
                                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">F</div>
                                    Flow AI (Image/Video)
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Nosso motor visual. Transforma os prompts técnicos gerados aqui em imagens hiper-realistas e vídeos de impacto.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Fluxo de Trabalho */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-foreground">O Fluxo de Trabalho TSS</h2>
                        <p className="text-muted-foreground">Para garantir eficiência total, siga este processo em 4 etapas:</p>

                        <div className="space-y-4">
                            {[
                                { step: "01", title: "Defina o Nicho & Contexto", desc: "Escolha o serviço correto (Painting, Flooring, etc). A IA precisa saber exatamente o cenário americano." },
                                { step: "02", title: "Gere o Prompt Estruturado", desc: "Use nossos geradores (Imagens, Vídeos ou Antes/Depois) para criar o comando técnico em inglês." },
                                { step: "03", title: "Execute na Engine", desc: "Copie o prompt e cole no Flow AI ou Gemini. Verifique as configurações de proporção (Aspect Ratio)." },
                                { step: "04", title: "Refine & Escale", desc: "Analise o resultado. Use as Técnicas Avançadas se precisar de mais detalhes ou variações específicas." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-6 rounded-2xl bg-card border border-border group hover:bg-input transition-colors">
                                    <div className="text-2xl font-black text-primary/20 group-hover:text-primary transition-colors">{item.step}</div>
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Tip Box */}
                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                            <Lightbulb size={24} weight="fill" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-400 mb-1">Dica de Especialista</h4>
                            <p className="text-sm text-blue-100/70 leading-relaxed">
                                Nunca use português nos geradores de imagem do Flow AI. Os modelos foram treinados prioritariamente em inglês técnico. Nossos geradores já fazem essa tradução e otimização automaticamente para você.
                            </p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-border mt-12">
                        <div className="text-center sm:text-left">
                            <h3 className="font-bold text-foreground mb-1 text-lg">Pronto para o próximo nível?</h3>
                            <p className="text-sm text-muted-foreground font-medium">Entenda como estruturar comandos matematicamente perfeitos.</p>
                        </div>
                        <Link href="/docs/anatomia-prompt" className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                            Ver Anatomia do Prompt
                            <ArrowRight size={20} weight="bold" />
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="text-center py-10 border-t border-border text-muted-foreground text-sm bg-card">
                <p>TS TOOLS Academy — Documentação Interna</p>
            </footer>
        </div>
    )
}
