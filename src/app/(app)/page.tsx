"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Wrench,
  Wand2 as MagicWand,
  Images,
  Video,
  GraduationCap,
  Building2 as Buildings,
  BookOpen,
  ArrowRightCircle as CaretCircleRight,
  Rocket,
  X,
  Link as LinkIcon,
  UserSquare2 as UserFocus,
  Code2 as Code,
  GripVertical as DotsSixVertical,
  Workflow as WorkflowIcon,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

type Tool = {
  id: string
  href: string
  label: string
  badge: string
  badgeColor: string
  accentColor: string
  description: string
  icon: React.ReactNode
}

const ALL_TOOLS: Tool[] = [
  {
    id: "gerador",
    href: "/gerador",
    label: "Imagens",
    badge: "Hot",
    badgeColor: "bg-primary/20 text-primary",
    accentColor: "primary",
    description: "Prompts estruturados para criativos estáticos de alto impacto.",
    icon: <MagicWand size={32} />,
  },
  {
    id: "antes-depois",
    href: "/antes-depois",
    label: "Antes & Depois",
    badge: "Expert",
    badgeColor: "bg-purple-500/20 text-purple-400",
    accentColor: "purple",
    description: "Poder de conversão visual com splits perfeitos para anúncios.",
    icon: <Images size={32} />,
  },
  {
    id: "gerador-video",
    href: "/gerador-video",
    label: "Vídeo",
    badge: "Veo",
    badgeColor: "bg-blue-500/20 text-blue-400",
    accentColor: "blue",
    description: "Roteiros e direções táticas para geração de vídeo por IA.",
    icon: <Video size={32} />,
  },
  {
    id: "gerador-humano",
    href: "/gerador-humano",
    label: "Humano",
    badge: "Novo",
    badgeColor: "bg-orange-500/20 text-orange-400",
    accentColor: "orange",
    description: "Prompts de pessoas extremamente realistas para fotos e vídeos por IA.",
    icon: <UserFocus size={32} />,
  },
  {
    id: "gerador-webdesign",
    href: "/gerador-webdesign",
    label: "Web Design",
    badge: "Dev",
    badgeColor: "bg-cyan-500/20 text-cyan-400",
    accentColor: "cyan",
    description: "Estrutura páginas web de alta conversão (HTML/Tailwind) prontas para IAs criarem.",
    icon: <Code size={32} />,
  },
  {
    id: "workflow",
    href: "/workflow",
    label: "Workflow",
    badge: "Novo",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
    accentColor: "emerald",
    description: "Briefing completo com serviço, região, fotos e logo — gera o prompt perfeito.",
    icon: <WorkflowIcon size={32} />,
  },
]

type KnowledgeItem = {
  id: string
  href: string
  title: string
  description: string
  icon: React.ReactNode
  badge?: string
  badgeColor?: string
  accentColor?: "primary" | "emerald"
}

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: "nichos",
    href: "/docs/nichos",
    title: "Manual dos Nichos",
    description: "Aprenda a anatomia, workflow e vocabulário técnico de cada serviço.",
    icon: <Buildings size={24} />,
    accentColor: "primary"
  },
  {
    id: "academy",
    href: "/docs",
    title: "Prompt Academy",
    description: "Documentação técnica completa sobre a ciência dos prompts comerciais.",
    icon: <BookOpen size={24} />,
    accentColor: "primary"
  },
  {
    id: "hub",
    href: "/ferramentas",
    title: "Hub de Ferramentas",
    description: "O repositório oficial de softwares e recursos validados pela equipe TS.",
    icon: <LinkIcon size={24} />,
    badge: "Comunidade",
    badgeColor: "bg-emerald-500/20 text-emerald-500",
    accentColor: "emerald"
  }
]

const ACCENT_CLASSES: Record<string, { hover: string; icon: string; glow: string }> = {
  primary: {
    hover: "hover:border-primary hover:shadow-primary/10",
    icon: "text-primary group-hover:bg-primary/20",
    glow: "",
  },
  purple: {
    hover: "hover:border-purple-500 hover:shadow-purple-500/10",
    icon: "text-purple-400 group-hover:bg-purple-500/20",
    glow: "",
  },
  blue: {
    hover: "hover:border-blue-500 hover:shadow-blue-500/10",
    icon: "text-blue-400 group-hover:bg-blue-500/20",
    glow: "",
  },
  orange: {
    hover: "hover:border-orange-500 hover:shadow-orange-500/10",
    icon: "text-orange-400 group-hover:bg-orange-500/20",
    glow: "",
  },
  cyan: {
    hover: "hover:border-cyan-500 hover:shadow-cyan-500/10",
    icon: "text-cyan-400 group-hover:bg-cyan-500/20",
    glow: "",
  },
  emerald: {
    hover: "hover:border-emerald-500 hover:shadow-emerald-500/10",
    icon: "text-emerald-400 group-hover:bg-emerald-500/20",
    glow: "",
  },
}

const ORDER_KEY = "ts_tools_sort_order"
const KNOWLEDGE_ORDER_KEY = "ts_knowledge_sort_order"

// Sortable Tool Card Component
function SortableToolCard({ tool }: { tool: Tool }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tool.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  const accent = ACCENT_CLASSES[tool.accentColor]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group h-full transition-opacity",
        isDragging && "opacity-40"
      )}
    >
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 p-2 text-muted-foreground/30 hover:text-primary transition-colors cursor-grab active:cursor-grabbing rounded-lg hover:bg-input z-30"
      >
        <DotsSixVertical size={20} />
      </button>

      <Link
        href={tool.href}
        className={cn(
          "flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full min-h-[280px] text-center w-full relative",
          accent.hover,
          isDragging ? "scale-105 rotate-1 border-primary shadow-2xl pointer-events-none" : ""
        )}
      >
        {/* Badge */}
        <span className={cn("absolute top-4 right-4 text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full", tool.badgeColor)}>
          {tool.badge}
        </span>

        {/* Icon */}
        <div className={cn("w-16 h-16 rounded-2xl bg-input flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300", accent.icon)}>
          {tool.icon}
        </div>

        <h2 className="text-xl font-bold mb-3 text-foreground">{tool.label}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
      </Link>
    </div>
  )
}

// Sortable Knowledge Card Component
function SortableKnowledgeCard({ item }: { item: KnowledgeItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-opacity",
        isDragging && "opacity-40"
      )}
    >
      <Link href={item.href}
        className={cn(
          "group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:bg-input transition-all duration-200 relative",
          item.accentColor === "emerald" ? "hover:border-emerald-500" : "hover:border-primary",
          isDragging && "scale-[1.02] border-primary pointer-events-none"
        )}
      >
        {/* Drag Handle - Positioned before the icon for better visibility and access */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 text-muted-foreground/40 hover:text-primary transition-colors cursor-grab active:cursor-grabbing rounded-lg hover:bg-input shrink-0"
          onClick={(e) => e.preventDefault()}
        >
          <DotsSixVertical size={20} />
        </button>

        <div className={cn(
          "w-12 h-12 rounded-xl flex shrink-0 items-center justify-center transition-transform group-hover:scale-110",
          item.accentColor === "emerald" ? "bg-emerald-500/10 text-emerald-500" : "bg-input text-primary"
        )}>
          {item.icon}
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              "text-lg font-bold text-foreground transition-colors",
              item.accentColor === "emerald" ? "group-hover:text-emerald-500" : "group-hover:text-primary"
            )}>
              {item.title}
            </h4>
            {item.badge && (
              <span className={cn("px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider", item.badgeColor)}>
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>

        <CaretCircleRight size={24} className={cn(
          "hidden sm:block text-muted group-hover:translate-x-1 transition-all",
          item.accentColor === "emerald" ? "group-hover:text-emerald-500" : "group-hover:text-primary"
        )} />
      </Link>
    </div>
  )
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [tools, setTools] = useState<Tool[]>(ALL_TOOLS)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(KNOWLEDGE_ITEMS)
  const [mounted, setMounted] = useState(false)

  const MODAL_KEY = 'ts_tools_patch_v2_skip'

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Lower distance for easier triggering
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setMounted(true)
    const shouldSkip = localStorage.getItem(MODAL_KEY)
    if (!shouldSkip) {
      const timer = setTimeout(() => setShowModal(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Load Tools Order
    const storedOrder = localStorage.getItem(ORDER_KEY)
    if (storedOrder) {
      try {
        const orderIds = JSON.parse(storedOrder) as string[]
        const ordered = orderIds
          .map(id => ALL_TOOLS.find(t => t.id === id))
          .filter((t): t is Tool => !!t)
        const missing = ALL_TOOLS.filter(t => !orderIds.includes(t.id))
        setTools([...ordered, ...missing])
      } catch { /* ignore */ }
    }

    // Load Knowledge Order
    const storedKnowledgeOrder = localStorage.getItem(KNOWLEDGE_ORDER_KEY)
    if (storedKnowledgeOrder) {
      try {
        const orderIds = JSON.parse(storedKnowledgeOrder) as string[]
        const ordered = orderIds
          .map(id => KNOWLEDGE_ITEMS.find(k => k.id === id))
          .filter((k): k is KnowledgeItem => !!k)
        const missing = KNOWLEDGE_ITEMS.filter(k => !orderIds.includes(k.id))
        setKnowledgeItems([...ordered, ...missing])
      } catch { /* ignore */ }
    }
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Reorder Tools
    if (tools.some(t => t.id === active.id)) {
      setTools((items) => {
        const oldIndex = items.findIndex(t => t.id === active.id)
        const newIndex = items.findIndex(t => t.id === over.id)
        const nextOrder = arrayMove(items, oldIndex, newIndex)
        localStorage.setItem(ORDER_KEY, JSON.stringify(nextOrder.map(t => t.id)))
        return nextOrder
      })
    }
    // Reorder Knowledge
    else if (knowledgeItems.some(k => k.id === active.id)) {
      setKnowledgeItems((items) => {
        const oldIndex = items.findIndex(k => k.id === active.id)
        const newIndex = items.findIndex(k => k.id === over.id)
        const nextOrder = arrayMove(items, oldIndex, newIndex)
        localStorage.setItem(KNOWLEDGE_ORDER_KEY, JSON.stringify(nextOrder.map(k => k.id)))
        return nextOrder
      })
    }
  }

  const handleCloseModal = () => {
    if (dontShowAgain) localStorage.setItem(MODAL_KEY, 'true')
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
          <Wrench size={24} className="text-primary" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Ferramentas
          </h3>
          <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
          <span className="text-[0.65rem] font-bold text-muted-foreground flex items-center gap-1 opacity-60">
            Arraste para reordenar
          </span>
        </div>

        {mounted ? (
          <DndContext
            id="tools-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <SortableContext
              items={tools.map(t => t.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map((tool) => (
                  <SortableToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <div key={tool.id} className="h-[280px] bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        )}
      </section>

      {/* Knowledge Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap size={24} className="text-primary" />
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Conhecimento
          </h3>
          <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
          <span className="text-[0.65rem] font-bold text-muted-foreground flex items-center gap-1 opacity-60">
            Arraste para reordenar
          </span>
        </div>

        {mounted ? (
          <DndContext
            id="knowledge-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <SortableContext
              items={knowledgeItems.map(k => k.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4">
                {knowledgeItems.map((item) => (
                  <SortableKnowledgeCard key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-col gap-4">
            {knowledgeItems.map((item) => (
              <div key={item.id} className="h-24 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground font-medium">TSS &copy; {mounted ? new Date().getFullYear() : "2024"}. Feito para o Grupo TS.</p>
      </footer>

      {/* Patch Notes Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border bg-card shadow-2xl">
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <Rocket size={28} className="text-primary" />
                Patch Notes v2.0
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Confira as novidades do sistema</p>
            </DialogHeader>

            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">Hoje</span>
                <h4 className="font-semibold text-foreground">📚 Manual de Nichos 2.0</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Documentação expandida para 15+ nichos dos EUA. Glossário técnico, guia de workflow e dicas de criativos integrados.</p>
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">Hoje</span>
                <h4 className="font-semibold text-foreground">🔍 Busca Inteligente</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Encontre qualquer nicho ou documentação instantaneamente com o novo campo de pesquisa no Hub de Docs.</p>
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">Recentemente</span>
                <h4 className="font-semibold text-foreground">⚡ Geradores Otimizados</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Selects de nichos agora agrupados por categoria (Pisos, Reformas, Exterior) para facilitar sua navegação.</p>
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[0.65rem] font-extrabold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">Recentemente</span>
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
                <label htmlFor="dont-show" className="text-sm font-medium leading-none text-muted-foreground cursor-pointer">
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

