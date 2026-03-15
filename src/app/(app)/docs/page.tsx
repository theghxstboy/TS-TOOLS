"use client"

import Link from "next/link"
import {
    ArrowLeft,
    Building2 as Buildings,
    Rocket as RocketLaunch,
    Brain,
    Sliders,
    Video as VideoCamera,
    PaintRoller,
    Layers as Stack,
    PlusSquare,
    FileText,
    Zap as Lightning,
    Target,
    Network as TreeStructure,
    CheckCircle2 as CheckCircle
} from "lucide-react"

export default function DocsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-input">
            {/* Hero Section */}
            <div className="pt-24 pb-16 px-6 text-center border-b border-border bg-card relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[0.65rem] font-bold uppercase tracking-widest mb-6">
                        <Lightning size={14} />
                        Intelligence Database
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
                        TS TOOLS <span className="text-primary drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">Academy</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
                        Domine a ciência dos prompts e multiplique sua produtividade com IA para escalar operações de Home Services.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Destaque: Manual dos Nichos */}
                    <Link href="/docs/nichos" className="group flex flex-col bg-card rounded-3xl border border-border hover:border-primary p-1 md:p-1.5 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 md:col-span-2 lg:col-span-2">
                        <div className="bg-input rounded-[1.4rem] p-8 h-full flex flex-col">
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                                    <Buildings size={32} />
                                </div>
                                <span className="px-3 py-1 rounded-lg bg-primary text-black text-[0.65rem] font-bold uppercase">Mais Acessado</span>
                            </div>

                            <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                Manual dos Nichos EUA
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-8 flex-1 max-w-xl text-lg">
                                O guia definitivo sobre os serviços que vendemos. Vocabulário técnico, workflows e os segredos visuais de cada categoria.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-border">
                                    <PaintRoller size={20} className="text-primary" />
                                    <span className="text-xs font-bold text-foreground">Painting</span>
                                </div>
                                <div className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-border">
                                    <Buildings size={20} className="text-primary" />
                                    <span className="text-xs font-bold text-foreground">Remodeling</span>
                                </div>
                                <div className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-border">
                                    <Stack size={20} className="text-primary" />
                                    <span className="text-xs font-bold text-foreground">Flooring</span>
                                </div>
                                <div className="flex items-center justify-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                                    <span className="text-[0.65rem] font-bold text-primary">+12 Nichos</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Primeiros Passos */}
                    <Link href="/docs/inicio-rapido" className="group flex flex-col bg-card rounded-3xl border border-border hover:border-blue-500 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                            <RocketLaunch size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-500 transition-colors">Primeiros Passos</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                            Aprenda a configurar seu workspace e entenda o fluxo de trabalho Gemini + Flow AI.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-blue-500" /> Gemini vs Flow AI
                            </li>
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-blue-500" /> Workflow de Produção
                            </li>
                        </ul>
                    </Link>

                    {/* Anatomia do Prompt */}
                    <Link href="/docs/anatomia-prompt" className="group flex flex-col bg-card rounded-3xl border border-border hover:border-purple-500 p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                            <Target size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-purple-400 transition-colors">Anatomia do Prompt</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                            A estrutura técnica por trás dos prompts que geram autoridade e realismo.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-purple-500" /> Instrução & Contexto
                            </li>
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-purple-500" /> Indicadores de Saída
                            </li>
                        </ul>
                    </Link>

                    {/* Técnicas Avançadas */}
                    <Link href="/docs/tecnicas-avancadas" className="group flex flex-col bg-card rounded-3xl border border-border hover:border-emerald-500 p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                            <Brain size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors">Técnicas Avançadas</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                            Eleve seu nível com Few-shot, CoT e Raciocínio estruturado para Gemini.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-emerald-500" /> Chain of Thought
                            </li>
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-emerald-500" /> Zero/Few-Shot
                            </li>
                        </ul>
                    </Link>

                    {/* Estratégia de Pensamento */}
                    <Link href="/docs/tecnicas-avancadas#tot" className="group flex flex-col bg-card rounded-3xl border border-border hover:border-amber-500 p-8 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                            <TreeStructure size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">Estratégia & ToT</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                            Como usar Tree of Thoughts para resolver problemas e criar estratégias complexas.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-amber-500" /> Tree of Thoughts (ToT)
                            </li>
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-amber-500" /> Generated Knowledge
                            </li>
                        </ul>
                    </Link>

                    {/* Parâmetros Flow AI */}
                    <Link href="/docs/parametros-flow" className="group flex flex-col bg-card rounded-3xl border border-border hover:border-orange-600 p-8 shadow-sm hover:shadow-xl hover:shadow-orange-600/10 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-orange-600/10 text-orange-500 flex items-center justify-center mb-6">
                            <Sliders size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-orange-500 transition-colors">Parâmetros Flow AI</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                            Domine as configurações técnicas de proporção, estilo e o poder do prompt negativo.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-orange-500" /> Aspect Ratio (16:9, 9:16)
                            </li>
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-orange-500" /> Prompts Negativos
                            </li>
                        </ul>
                    </Link>

                    {/* Direção de Vídeo */}
                    <Link href="/docs/video-expert" className="group flex flex-col bg-card rounded-3xl border border-border hover:border-red-500 p-8 shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6">
                            <VideoCamera size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-red-500 transition-colors">Direção de Vídeo</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                            Comandos de câmera cinematográficos para Veo e Kling que capturam atenção absoluta.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-red-500" /> Movimentos de Câmera
                            </li>
                            <li className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle size={16} className="text-red-500" /> Ritmo & Framerates
                            </li>
                        </ul>
                    </Link>

                </div>
            </main>

            <footer className="text-center py-12 border-t border-border text-muted-foreground text-sm mt-auto bg-card">
                <p className="font-medium" suppressHydrationWarning>TS TOOLS Academy &copy; {new Date().getFullYear()}. Documentação Interna Grupo TS.</p>
            </footer>
        </div>
    )
}
