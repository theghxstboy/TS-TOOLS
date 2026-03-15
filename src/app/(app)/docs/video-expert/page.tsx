"use client"

import Link from "next/link"
import {
    ArrowLeft,
    Video as VideoCamera,
    ZoomIn as MagnifyingGlassPlus,
    MoveHorizontal as ArrowsLeftRight,
    Maximize as ArrowsOut,
    CheckCircle2 as CheckCircle,
    ArrowRight,
    PlayCircle,
    Timer,
    UserSquare2 as UserFocus
} from "lucide-react"

export default function VideoExpertPage() {
    return (
        <div className="flex flex-col min-h-screen bg-input">
            {/* Header */}
            <div className="pt-20 pb-12 px-6 border-b border-border bg-card animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                            <VideoCamera size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                            Direção de Vídeo
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        Aprenda a criar cenas cinematográficas de alta retenção que param o scroll e geram leads.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="prose prose-invert max-w-none space-y-20">

                    <section className="space-y-6">
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            O segredo de um vídeo profissional de 5 a 10 segundos não está na complexidade da cena, mas na <strong>movimentação de câmera</strong>. No ecossistema TS TOOLS, focamos em comandos que as engines de última geração (Google Veo e Kling) processam com perfeição.
                        </p>
                    </section>

                    {/* Camera Movements */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <PlayCircle size={28} className="text-red-500" />
                            Movimentação Tática (Câmera)
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Slow Zoom In", icon: MagnifyingGlassPlus, desc: "Aproximação lenta no detalhe. Transmite precisão e qualidade técnica." },
                                { title: "Pan / Tracking", icon: ArrowsLeftRight, desc: "Acompanha o técnico caminhando. Transmite agilidade e prontidão." },
                                { title: "Drone / Pull Out", icon: ArrowsOut, desc: "Revela a escala do trabalho feito. Transmite valor e autoridade." }
                            ].map((item, i) => (
                                <div key={i} className="bg-card border border-border p-6 rounded-2xl flex flex-col group hover:border-red-500/50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <item.icon size={24} />
                                    </div>
                                    <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Timing & Ritmo */}
                    <section className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <Timer size={28} className="text-blue-400" />
                                    Ritmo & Duração
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Nossos testes indicam que anúncios com <strong>6 a 8 segundos</strong> tem o melhor CPA. Evite vídeos longos; foque em uma única ação impactante.
                                </p>
                                <ul className="space-y-2 text-xs text-muted-foreground">
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> <strong>Consistent Pace:</strong> Velocidade uniforme.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> <strong>24fps Cinematic:</strong> Aspecto de cinema.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> <strong>No Jumping Frames:</strong> Imagem fluida sem glitches.</li>
                                </ul>
                            </div>

                            <div className="flex-1 bg-red-500/5 border border-red-500/20 p-8 rounded-3xl space-y-4">
                                <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                                    <UserFocus size={24} />
                                    Atenção ao Rosto
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed italic">
                                    "Se o vídeo focar no profissional, use sempre o prompt negativo para evitar distorções faciais ou expressões bizarras."
                                </p>
                                <div className="text-[0.7rem] font-mono text-red-100/50">
                                    Negative: distorted face, jumping expressions, glitch, blurry.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <div className="pt-12 text-center border-t border-border mt-12">
                        <p className="text-muted-foreground text-sm mb-6">Agora você dominou todas as ferramentas da TS Academy.</p>
                        <Link href="/" className="bg-primary hover:bg-primary/90 text-black px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                            Começar a Produzir Agora
                            <ArrowRight size={20} />
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
