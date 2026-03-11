"use client"

import Link from "next/link"
import {
    ArrowLeft,
    Target,
    FileCode2 as Blueprint,
    PencilLine,
    Lightbulb,
    CheckCircle2 as CheckCircle,
    ArrowRight,
    Pipette as Eyedropper,
    Sun,
    Box as BoundingBox
} from "lucide-react"

export default function AnatomiaPromptPage() {
    return (
        <div className="flex flex-col min-h-screen bg-input">
            {/* Header */}
            <div className="pt-20 pb-12 px-6 border-b border-border bg-card">
                <div className="max-w-4xl mx-auto">
                    <Link href="/docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm mb-8 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar para Academy
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <Target size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                            Anatomia do Prompt
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        A estrutura técnica que garante previsibilidade, fotorrealismo e autoridade de marca.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
                <div className="prose prose-invert max-w-none space-y-16">

                    {/* Intro */}
                    <section className="space-y-6">
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Diferente de usuários comuns que fazem "pedidos" à IA, na TS TOOLS nós entregamos <strong>instruções estruturadas</strong>. Um prompt profissional não é sorte, é engenharia. Ele segue uma hierarquia clara de informações que os modelos Gemini e Flow AI processam de cima para baixo.
                        </p>
                    </section>

                    {/* The Formula */}
                    <section className="bg-card rounded-3xl border border-border p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full"></div>

                        <h2 className="text-2xl font-extrabold text-foreground mb-10 flex items-center gap-3">
                            <Blueprint size={32} className="text-primary" />
                            A Fórmula TSS
                        </h2>

                        <div className="space-y-6 relative z-10">
                            {[
                                { part: "O SUJEITO", color: "bg-primary", desc: "Quem ou o que está na cena? (Pintor profissional, casa suburbana, cozinha moderna)." },
                                { part: "A AÇÃO", color: "bg-blue-500", desc: "O que está acontecendo? (Pintando parede, instalando piso, sol brilhando no telhado)." },
                                { part: "O CONTEXTO", color: "bg-emerald-500", desc: "Onde? Clima? Estilo? (Subúrbio americano, dia ensolarado, estilo Colonial)." },
                                { part: "A TÉCNICA", color: "bg-purple-500", desc: "Qualidade da imagem? (8k, fotorrealista, 35mm lens, cinematic lighting)." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className={`${item.color} text-black font-black text-[0.65rem] px-3 py-1.5 rounded-md min-w-[100px] text-center uppercase tracking-widest`}>
                                        {item.part}
                                    </div>
                                    <p className="text-muted-foreground font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Detailed Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Eyedropper size={24} className="text-primary" />
                                1. O Sujeito (O Herói)
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Seja específico sobre quem está na cena. No mercado americano, detalhes como o uniforme e as ferramentas transmitem <strong>Trust (Confiança)</strong>.
                            </p>
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-100/70 italic">
                                ❌ Errado: "Um pintor trabalhando."
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-100/70 italic">
                                ✅ Certo: "A professional male painter, wearing a clean white branded uniform and a utility belt, precisely using a high-quality roller."
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Sun size={24} className="text-amber-400" />
                                2. Iluminação & Lente
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                A iluminação comercial diferencia um criativo amador de um profissional. Use adjetivos de cinematografia:
                            </p>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> <strong>Golden Hour:</strong> Luz natural suave e acolhedora.</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> <strong>Studio Lighting:</strong> Foco total no serviço, sem sombras.</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> <strong>Cinematic:</strong> Para um ar heróico e épico.</li>
                            </ul>
                        </section>
                    </div>

                    {/* Tip: Negative Prompt */}
                    <div className="p-8 rounded-3xl bg-purple-500/5 border border-purple-500/20">
                        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                            <BoundingBox size={24} />
                            O Poder do Prompt Negativo
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Às vezes, dizer o que <strong>não queremos</strong> é tão importante quanto o que queremos. O Prompt Negativo ajuda a remover distorções e elementos que distraem do serviço principal.
                        </p>
                        <div className="bg-input rounded-xl p-4 font-mono text-xs text-muted-foreground">
                            Negative: distorted face, extra fingers, cartoon, blurry, messy background, low quality, watermarks, text.
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-border mt-12">
                        <div className="text-center sm:text-left">
                            <h3 className="font-bold text-foreground mb-1 text-lg">Pronto para elevar o nível?</h3>
                            <p className="text-sm text-muted-foreground font-medium">Aprenda a raciocinar com a IA de forma avançada.</p>
                        </div>
                        <Link href="/docs/tecnicas-avancadas" className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                            Ver Técnicas Avançadas
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
