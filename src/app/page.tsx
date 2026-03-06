"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Wrench,
  MagicWand,
  Images,
  VideoCamera,
  GraduationCap,
  Buildings,
  BookOpenText,
  CaretCircleRight,
  RocketLaunch,
  X,
  Link as LinkIcon,
  UserFocus,
  Code
} from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const MODAL_KEY = 'ts_tools_patch_v2_skip'

  useEffect(() => {
    const shouldSkip = localStorage.getItem(MODAL_KEY)
    if (!shouldSkip) {
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseModal = () => {
    if (dontShowAgain) {
      localStorage.setItem(MODAL_KEY, 'true')
    }
    setShowModal(false)
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f3f0ed] to-[#a99d94]">
            Crie. Converta.{" "}
          </span>
          <span className="text-primary drop-shadow-lg">Escale.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Sua central de inteligência e automação para escalar operações de <strong className="text-foreground">Home Services nos EUA</strong>.
        </p>
      </div>

      {/* Tools Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Wrench size={24} weight="bold" className="text-primary" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Ferramentas
          </h3>
          <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tool 1 */}
          <Link href="/gerador"
            className="group relative flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary transition-all duration-300 h-full min-h-[280px] text-center">
            <span className="absolute top-4 right-4 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/20 text-primary">
              Hot
            </span>
            <div className="w-16 h-16 rounded-2xl bg-input text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              <MagicWand size={32} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-foreground">Imagens</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Prompts estruturados para criativos estáticos de alto impacto.</p>
          </Link>

          {/* Tool 2 */}
          <Link href="/antes-depois"
            className="group relative flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500 transition-all duration-300 h-full min-h-[280px] text-center">
            <span className="absolute top-4 right-4 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400">
              Expert
            </span>
            <div className="w-16 h-16 rounded-2xl bg-input text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
              <Images size={32} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-foreground">Antes & Depois</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Poder de conversão visual com splits perfeitos para anúncios.</p>
          </Link>

          {/* Tool 3 */}
          <Link href="/gerador-video"
            className="group relative flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500 transition-all duration-300 h-full min-h-[280px] text-center">
            <span className="absolute top-4 right-4 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400">
              Veo
            </span>
            <div className="w-16 h-16 rounded-2xl bg-input text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
              <VideoCamera size={32} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-foreground">Vídeo</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Roteiros e direções táticas para geração de vídeo por IA.</p>
          </Link>

          {/* Tool 4 */}
          <Link href="/gerador-humano"
            className="group relative flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500 transition-all duration-300 h-full min-h-[280px] text-center">
            <span className="absolute top-4 right-4 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400">
              Novo
            </span>
            <div className="w-16 h-16 rounded-2xl bg-input text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
              <UserFocus size={32} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-foreground">Humano</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Prompts de pessoas extremamente realistas para fotos e vídeos por IA.</p>
          </Link>

          {/* Tool 5 */}
          <Link href="/gerador-webdesign"
            className="group relative flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500 transition-all duration-300 h-full min-h-[280px] text-center">
            <span className="absolute top-4 right-4 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
              Dev
            </span>
            <div className="w-16 h-16 rounded-2xl bg-input text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
              <Code size={32} weight="bold" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-foreground">Web Design</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Estrutura páginas web de alta conversão (HTML/Tailwind) prontas para IAs criarem.</p>
          </Link>
        </div>
      </section>

      {/* Knowledge Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap size={24} weight="bold" className="text-primary" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Conhecimento
          </h3>
          <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/docs/nichos"
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary hover:bg-input transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-input text-primary flex shrink-0 items-center justify-center">
              <Buildings size={24} weight="fill" />
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Manual dos Nichos</h4>
              <p className="text-sm text-muted-foreground">Aprenda a anatomia, workflow e vocabulário técnico de cada serviço.</p>
            </div>
            <CaretCircleRight size={24} className="hidden sm:block text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/docs"
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary hover:bg-input transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-input text-primary flex shrink-0 items-center justify-center">
              <BookOpenText size={24} weight="fill" />
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Prompt Academy</h4>
              <p className="text-sm text-muted-foreground">Documentação técnica completa sobre a ciência dos prompts comerciais.</p>
            </div>
            <CaretCircleRight size={24} className="hidden sm:block text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/ferramentas"
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 hover:bg-input transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex shrink-0 items-center justify-center group-hover:scale-110 transition-transform">
              <LinkIcon size={24} weight="fill" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">Hub de Ferramentas</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[0.65rem] font-bold uppercase tracking-wider">Comunidade</span>
              </div>
              <p className="text-sm text-muted-foreground">O repositório oficial de softwares e recursos validados pela equipe TS.</p>
            </div>
            <CaretCircleRight size={24} className="hidden sm:block text-muted group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground font-medium">TSS &copy; {new Date().getFullYear()}. Feito para o Grupo TS.</p>
      </footer>

      {/* Patch Notes Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border bg-card shadow-2xl">
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <RocketLaunch size={28} className="text-primary" weight="fill" />
                Patch Notes v2.0
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Confira as novidades do sistema</p>
            </DialogHeader>

            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                  Hoje
                </span>
                <h4 className="font-semibold text-foreground">📚 Manual de Nichos 2.0</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Documentação expandida para 15+ nichos dos EUA. Glossário técnico, guia de workflow e dicas de criativos integrados.</p>
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                  Hoje
                </span>
                <h4 className="font-semibold text-foreground">🔍 Busca Inteligente</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Encontre qualquer nicho ou documentação instantaneamente com o novo campo de pesquisa no Hub de Docs.</p>
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                  Recentemente
                </span>
                <h4 className="font-semibold text-foreground">⚡ Geradores Otimizados</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Selects de nichos agora agrupados por categoria (Pisos, Reformas, Exterior) para facilitar sua navegação.</p>
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                  Recentemente
                </span>
                <h4 className="font-semibold text-foreground">🎨 Refinamento Visual</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Interface do Hub e Academy refinada para uma experiência mais limpa e focada na produtividade.</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dont-show"
                  checked={dontShowAgain}
                  onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                />
                <label
                  htmlFor="dont-show"
                  className="text-sm font-medium leading-none text-muted-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Não mostrar novamente
                </label>
              </div>
              <button
                onClick={handleCloseModal}
                className="bg-primary hover:bg-primary/90 text-black px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
              >
                Entendido!
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
