"use client"

import Link from "next/link"
import {
    ArrowLeft,
    Brain,
    Lightning,
    Sparkle,
    TreeStructure,
    GearSix,
    CheckCircle,
    ArrowRight,
    Code,
    ChatCircleDots,
    Flask
} from "@phosphor-icons/react"

export default function TecnicasAvancadasPage() {
    return (
        <div className="flex flex-col min-h-screen bg-input">
            {/* Header */}
            <div className="pt-20 pb-12 px-6 border-b border-border bg-card">
                <div className="max-w-4xl mx-auto">
                    <Link href="/docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm mb-8 group">
                        <ArrowLeft size={18} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                        Voltar para Academy
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Brain size={32} weight="duotone" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                            Técnicas Avançadas
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        Extraia o potencial máximo do Gemini Pro e Flow AI com as estratégias usadas pelos maiores engenheiros de prompt do mundo.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
                <div className="prose prose-invert max-w-none space-y-20">

                    {/* 1. Zero-shot vs Few-shot */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Lightning size={28} className="text-amber-400" weight="fill" />
                            1. Zero-shot vs Few-shot Prompting
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            No <strong>Zero-shot</strong>, você dá uma instrução e espera que a IA resolva com o que ela já sabe. No <strong>Few-shot</strong>, você fornece <strong>exemplos</strong> antes de pedir o resultado final.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card rounded-2xl border border-border p-6">
                                <span className="text-[0.65rem] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded mb-4 inline-block">Zero-shot (Exemplo)</span>
                                <div className="text-xs font-mono text-emerald-400 mb-2">Prompt:</div>
                                <p className="text-xs text-muted-foreground italic bg-input p-3 rounded-lg border border-border">
                                    "Classifique este feedback de cliente como Positivo ou Negativo: 'O pintor fez um trabalho excelente, mas chegou 30 min atrasado.'"
                                </p>
                            </div>
                            <div className="bg-card rounded-2xl border border-border p-6 shadow-xl shadow-primary/5">
                                <span className="text-[0.65rem] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded mb-4 inline-block">Few-shot (Poderoso)</span>
                                <div className="text-xs font-mono text-emerald-400 mb-2">Prompt:</div>
                                <p className="text-xs text-muted-foreground italic bg-input p-3 rounded-lg border border-border overflow-hidden line-clamp-4">
                                    "Ex1: 'Péssimo serviço' // Resposta: Negativo<br />
                                    Ex2: 'Adorei a reforma' // Resposta: Positivo<br />
                                    Ex3: 'O telhado ficou bom' // Resposta: ..."
                                </p>
                                <p className="mt-4 text-[0.7rem] text-muted-foreground">Fornecer exemplos reduz erros de interpretação drasticamente.</p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Chain-of-Thought (CoT) */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Sparkle size={28} className="text-blue-400" weight="fill" />
                            2. Chain-of-Thought (Cadeia de Pensamento)
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            O Gemini performa muito melhor quando é instruído a <strong>"pensar passo a passo"</strong>. Isso evita que a IA tome decisões precipitadas e ajuda a resolver problemas matemáticos ou lógicos de venda.
                        </p>
                        <div className="bg-input rounded-2xl border border-border p-6 font-mono text-sm space-y-2">
                            <div className="text-primary font-bold">// Trigger de Ouro:</div>
                            <p className="text-foreground">"Analise o nicho de Painting em New Jersey, considere os 3 principais problemas do cliente e, ao final, elabore 5 variações de gancho para anúncio. <strong>Pense passo a passo.</strong>"</p>
                        </div>
                    </section>

                    {/* 3. Generated Knowledge */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <ChatCircleDots size={28} className="text-purple-400" weight="fill" />
                            3. Conhecimento Gerado
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Às vezes a IA pode esquecer detalhes técnicos de nichos específicos. Use o Gemini para <strong>gerar o conhecimento primeiro</strong> antes de executar a tarefa.
                        </p>
                        <div className="p-6 rounded-2xl bg-card border border-border">
                            <ol className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                    <p className="text-sm text-muted-foreground">Peça para a IA descrever os processos técnicos de um nicho (ex: lixamento de pisos de madeira).</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                    <p className="text-sm text-muted-foreground">Agora, peça para ela criar o prompt de imagem baseada nessa descrição técnica precisa.</p>
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* 4. Tree of Thoughts (ToT) */}
                    <section id="tot" className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <TreeStructure size={28} className="text-amber-500" weight="duotone" />
                            4. Tree of Thoughts (ToT)
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Ideal para estratégias de marketing. Você pede para a IA simular 3 especialistas diferentes (ex: um Copywriter, um Analista de Dados e um Diretor de Arte) debatendo uma ideia original para um anúncio.
                        </p>
                        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl text-sm italic text-amber-100/70">
                            "A ToT permite que a IA explore múltiplos caminhos de solução simultaneamente, mantendo apenas os melhores pensamentos para chegar no resultado final."
                        </div>
                    </section>

                    {/* Quick Reference Table */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Flask size={24} className="text-primary" />
                            Guia de Decisão da Técnica
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-card rounded-2xl overflow-hidden border border-border text-sm">
                                <thead className="bg-input text-foreground font-bold">
                                    <tr>
                                        <th className="p-4 text-left border-b border-border">Se o seu objetivo é...</th>
                                        <th className="p-4 text-left border-b border-border">Use a Técnica...</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b border-border hover:bg-input/50 transition-colors">
                                        <td className="p-4">Fazer a IA seguir um formato de resposta rígido</td>
                                        <td className="p-4 text-primary font-bold">Few-Shot</td>
                                    </tr>
                                    <tr className="border-b border-border hover:bg-input/50 transition-colors">
                                        <td className="p-4">Resolver problemas de lógica complexa ou matemática</td>
                                        <td className="p-4 text-blue-400 font-bold">Chain of Thought</td>
                                    </tr>
                                    <tr className="border-b border-border hover:bg-input/50 transition-colors">
                                        <td className="p-4">Criar uma estratégia de criativo fora da caixa</td>
                                        <td className="p-4 text-amber-500 font-bold">Tree of Thoughts</td>
                                    </tr>
                                    <tr className="hover:bg-input/50 transition-colors">
                                        <td className="p-4">Evitar desinformação ou 'alucinações' técnicas</td>
                                        <td className="p-4 text-purple-400 font-bold">Generated Knowledge</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <div className="pt-12 text-center">
                        <p className="text-muted-foreground text-sm mb-6">Agora você tem todas as ferramentas para dominar o mercado.</p>
                        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                            Ir para o Hub das Ferramentas
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
