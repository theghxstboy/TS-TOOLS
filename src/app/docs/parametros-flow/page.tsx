"use client"

import Link from "next/link"
import {
    ArrowLeft,
    Sliders,
    Monitor,
    SelectionBackground,
    MinusCircle,
    CheckCircle,
    ArrowRight,
    Images,
    SelectionAll,
    Crop
} from "@phosphor-icons/react"

export default function ParametrosFlowPage() {
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
                        <div className="w-12 h-12 rounded-xl bg-orange-600/10 text-orange-500 flex items-center justify-center">
                            <Sliders size={32} weight="duotone" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                            Parâmetros Flow AI
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        Ajustes finos que separam uma geração comum de um criativo de alta fidelidade pronto para o tráfego pago.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
                <div className="prose prose-invert max-w-none space-y-16">

                    <section className="space-y-6">
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            O <strong>Flow AI</strong>, baseado na engine de imagem do Google, processa informações técnicas através de parâmetros específicos. Entender como configurar o formato e o que omitir é crucial para manter a qualidade visual do Grupo TS.
                        </p>
                    </section>

                    {/* Aspect Ratio */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Crop size={28} className="text-orange-500" weight="fill" />
                            Aspect Ratio (Formatos)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "9:16 (Vertical)", use: "Reels & TikTok", icon: Monitor },
                                { title: "1:1 (Square)", use: "Feed Instagram/FB", icon: SelectionAll },
                                { title: "16:9 (Landscape)", use: "Canal/Banner Site", icon: Monitor }
                            ].map((item, i) => (
                                <div key={i} className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center group hover:border-orange-500/50 transition-colors">
                                    <item.icon size={32} className="text-orange-500 mb-4" />
                                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground">{item.use}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground italic bg-orange-500/5 p-4 rounded-xl border border-orange-500/20">
                            <strong>Dica Técnica:</strong> Sempre selecione o aspecto ratio antes de gerar. O modo "Vertical" no Flow AI já otimiza a composição para que os elementos principais não fiquem escondidos atrás das legendas do Reels.
                        </p>
                    </section>

                    {/* Negative Prompting */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <MinusCircle size={28} className="text-red-500" weight="fill" />
                            Prompt Negativo (Limpeza)
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            O Flow AI é sensível a detalhes técnicos. Use o campo de <strong>Prompt Negativo</strong> para garantir que a imagem não venha com marcas d'água ou distorções comuns.
                        </p>
                        <div className="p-8 rounded-3xl bg-input border border-border relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-red-500/20 group-hover:text-red-500/40 transition-colors">
                                <SelectionBackground size={80} weight="fill" />
                            </div>
                            <h4 className="font-bold text-foreground mb-4">Copia & Cola Sugerido:</h4>
                            <div className="font-mono text-sm text-orange-400 select-all p-2 rounded bg-card/50">
                                text, watermark, blurry, low quality, distorted hands, letters, signatures, unrealistic skin, oversaturated colors, messy background.
                            </div>
                        </div>
                    </section>

                    {/* MJ vs Flow AI */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Images size={28} className="text-blue-400" weight="fill" />
                            Comparativo Técnico
                        </h2>
                        <p className="text-muted-foreground">Se você já usou IA como Midjourney, aqui está a "tradução" para o ecossistema Flow:</p>
                        <div className="space-y-4">
                            {[
                                { mj: "--ar 9:16", flow: "Configuração de 'Vertical' no menu lateral" },
                                { mj: "--stylize 250", flow: "Ajuste de 'Creativity' para 40% - 60%" },
                                { mj: "--v 6.0", flow: "Ativar 'High Fidelity Mode' no seletor de Versão" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                                    <div className="text-xs font-mono text-muted-foreground">{item.mj}</div>
                                    <ArrowRight size={16} className="text-primary" />
                                    <div className="text-xs font-bold text-foreground">{item.flow}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Next Steps */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-border mt-12">
                        <div className="text-center sm:text-left">
                            <h3 className="font-bold text-foreground mb-1 text-lg">Próximo: Direção de Vídeo</h3>
                            <p className="text-sm text-muted-foreground font-medium">Aprenda a dar vida aos seus criativos.</p>
                        </div>
                        <Link href="/docs/video-expert" className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                            Ver Direção de Vídeo
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
