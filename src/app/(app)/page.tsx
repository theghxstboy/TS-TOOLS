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
  FileCode,
  GripVertical as DotsSixVertical,
  Workflow as WorkflowIcon,
  LayoutGrid,
  Palette,
  Share2,
  TrendingUp,
  MonitorSmartphone,
  Plus,
  Check,
  ArrowRightLeft,
  MonitorPlay,
  LayoutTemplate,
  ListChecks,
  ListTodo,
  Braces,
  PackageSearch,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
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
  departments: string[]
}

const DEPARTMENTS = [
  { id: "Todos", label: "Visão Global", icon: <LayoutGrid size={24} />, activeClass: "border-primary bg-primary/5 text-primary", inactiveClass: "border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary" },
  { id: "Design", label: "Design", icon: <Palette size={24} />, activeClass: "border-pink-500 bg-pink-500/5 text-pink-500", inactiveClass: "border-border/50 text-muted-foreground hover:border-pink-500/50 hover:bg-pink-500/5 hover:text-pink-500" },
  { id: "Audiovisual", label: "Audiovisual", icon: <Video size={24} />, activeClass: "border-blue-500 bg-blue-500/5 text-blue-500", inactiveClass: "border-border/50 text-muted-foreground hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-500" },
  { id: "Social Media", label: "Social Media", icon: <Share2 size={24} />, activeClass: "border-emerald-500 bg-emerald-500/5 text-emerald-500", inactiveClass: "border-border/50 text-muted-foreground hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-500" },
  { id: "Tráfego pago", label: "Tráfego pago", icon: <TrendingUp size={24} />, activeClass: "border-orange-500 bg-orange-500/5 text-orange-500", inactiveClass: "border-border/50 text-muted-foreground hover:border-orange-500/50 hover:bg-orange-500/5 hover:text-orange-500" },
  { id: "Webdesign", label: "Webdesign", icon: <MonitorSmartphone size={24} />, activeClass: "border-cyan-500 bg-cyan-500/5 text-cyan-500", inactiveClass: "border-border/50 text-muted-foreground hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:text-cyan-500" },
]

const DEFAULT_TOOLS: Tool[] = [
  {
    id: "gerador",
    href: "/gerador",
    label: "Gerador de Imagens",
    badge: "Social Media",
    badgeColor: "bg-primary/20 text-primary",
    accentColor: "primary",
    description: "Prompts estruturados para criativos estáticos de alto impacto.",
    icon: <MagicWand size={32} strokeWidth={1.5} />,
    departments: ["Social Media", "Design", "Audiovisual"],
  },
  {
    id: "antes-depois",
    href: "/antes-depois",
    label: "Antes & Depois",
    badge: "Trafego/Design",
    badgeColor: "bg-purple-500/20 text-purple-400",
    accentColor: "purple",
    description: "Poder de conversão visual com splits perfeitos para anúncios.",
    icon: <ArrowRightLeft size={32} strokeWidth={1.5} />,
    departments: ["Tráfego pago", "Design", "Social Media"],
  },
  {
    id: "gerador-video",
    href: "/gerador-video",
    label: "Gerador de Vídeos",
    badge: "Audiovisual",
    badgeColor: "bg-blue-500/20 text-blue-400",
    accentColor: "blue",
    description: "Roteiros e direções táticas para geração de vídeo por IA.",
    icon: <MonitorPlay size={32} strokeWidth={1.5} />,
    departments: ["Audiovisual", "Tráfego pago"],
  },
  {
    id: "gerador-humano",
    href: "/gerador-humano",
    label: "Humanizador",
    badge: "Design",
    badgeColor: "bg-rose-500/20 text-rose-500",
    accentColor: "rose",
    description: "Prompts de pessoas extremamente realistas para fotos e vídeos por IA.",
    icon: <UserFocus size={32} strokeWidth={1.5} />,
    departments: ["Design", "Audiovisual"],
  },
  {
    id: "gerador-webdesign",
    href: "/gerador-webdesign",
    label: "Gerador de LP's",
    badge: "Webdesign",
    badgeColor: "bg-cyan-500/20 text-cyan-400",
    accentColor: "cyan",
    description: "Estrutura páginas web de alta conversão (HTML/Tailwind) prontas para IAs criarem.",
    icon: <LayoutTemplate size={32} strokeWidth={1.5} />,
    departments: ["Webdesign"],
  },
  {
    id: "workflow",
    href: "/workflow",
    label: "Gerador de Criativos",
    badge: "Tráfego Pago",
    badgeColor: "bg-emerald-500/20 text-emerald-500",
    accentColor: "emerald",
    description: "Briefing completo com serviço, região, fotos e logo — gera o prompt perfeito.",
    icon: <WorkflowIcon size={32} strokeWidth={1.5} />,
    departments: ["Tráfego pago"],
  },
  {
    id: "checklist-webdesign",
    href: "/checklist-webdesign",
    label: "Checklist Migração",
    badge: "Webdesign",
    badgeColor: "bg-indigo-500/20 text-indigo-400",
    accentColor: "indigo",
    description: "Gestor de tarefas e configurações para setups de desenvolvimento web.",
    icon: <ListChecks size={32} strokeWidth={1.5} />,
    departments: ["Webdesign"],
  },
  {
    id: "codigos",
    href: "/codigos",
    label: "Biblioteca de Códigos",
    badge: "Web & TI",
    badgeColor: "bg-orange-500/20 text-orange-500",
    accentColor: "orange",
    description: "Repositório de snippets e componentes prontos para o time de Web & TI.",
    icon: <Braces size={32} strokeWidth={1.5} />,
    departments: ["Webdesign"],
  },
  {
    id: "hub",
    href: "/ferramentas",
    label: "Hub de Ferramentas",
    badge: "Comunidade",
    badgeColor: "bg-violet-500/20 text-violet-400",
    accentColor: "violet",
    description: "O repositório oficial de softwares e recursos validados pela equipe TS.",
    icon: <PackageSearch size={32} strokeWidth={1.5} />,
    departments: ["Tráfego pago", "Audiovisual", "Social Media", "Design", "Webdesign"],
  }
]

const DEFAULT_KNOWLEDGE: Tool[] = [
  {
    id: "nichos",
    href: "/docs/nichos",
    label: "Manual dos Nichos",
    badge: "Guide",
    badgeColor: "bg-amber-500/20 text-amber-500",
    accentColor: "amber",
    description: "Aprenda a anatomia, workflow e vocabulário técnico de cada serviço.",
    icon: <Buildings size={32} strokeWidth={1.5} />,
    departments: ["Tráfego pago", "Audiovisual", "Social Media", "Design", "Webdesign"],
  },
  {
    id: "academy",
    href: "/docs",
    label: "Prompt Academy",
    badge: "Doc",
    badgeColor: "bg-teal-500/20 text-teal-400",
    accentColor: "teal",
    description: "Documentação técnica completa sobre a ciência dos prompts comerciais.",
    icon: <BookOpen size={32} strokeWidth={1.5} />,
    departments: ["Tráfego pago", "Audiovisual", "Social Media", "Design", "Webdesign"],
  }
]

const ALL_ITEMS = [...DEFAULT_TOOLS, ...DEFAULT_KNOWLEDGE]

const ACCENT_CLASSES: Record<string, { hover: string; icon: string; glow: string }> = {
  primary: { hover: "hover:border-primary hover:shadow-primary/10", icon: "text-primary group-hover:bg-primary/20 bg-primary/10", glow: "" },
  purple: { hover: "hover:border-purple-500 hover:shadow-purple-500/10", icon: "text-purple-400 group-hover:bg-purple-500/20 bg-purple-500/10", glow: "" },
  blue: { hover: "hover:border-blue-500 hover:shadow-blue-500/10", icon: "text-blue-400 group-hover:bg-blue-500/20 bg-blue-500/10", glow: "" },
  orange: { hover: "hover:border-orange-500 hover:shadow-orange-500/10", icon: "text-orange-400 group-hover:bg-orange-500/20 bg-orange-500/10", glow: "" },
  cyan: { hover: "hover:border-cyan-500 hover:shadow-cyan-500/10", icon: "text-cyan-400 group-hover:bg-cyan-500/20 bg-cyan-500/10", glow: "" },
  emerald: { hover: "hover:border-emerald-500 hover:shadow-emerald-500/10", icon: "text-emerald-400 group-hover:bg-emerald-500/20 bg-emerald-500/10", glow: "" },
  rose: { hover: "hover:border-rose-500 hover:shadow-rose-500/10", icon: "text-rose-500 group-hover:bg-rose-500/20 bg-rose-500/10", glow: "" },
  indigo: { hover: "hover:border-indigo-500 hover:shadow-indigo-500/10", icon: "text-indigo-400 group-hover:bg-indigo-500/20 bg-indigo-500/10", glow: "" },
  violet: { hover: "hover:border-violet-500 hover:shadow-violet-500/10", icon: "text-violet-400 group-hover:bg-violet-500/20 bg-violet-500/10", glow: "" },
  amber: { hover: "hover:border-amber-500 hover:shadow-amber-500/10", icon: "text-amber-500 group-hover:bg-amber-500/20 bg-amber-500/10", glow: "" },
  teal: { hover: "hover:border-teal-500 hover:shadow-teal-500/10", icon: "text-teal-400 group-hover:bg-teal-500/20 bg-teal-500/10", glow: "" },
}

const ORDER_KEY = "ts_tools_sort_order"
const KNOWLEDGE_ORDER_KEY = "ts_knowledge_sort_order"
const ADDED_DEPARTMENTS_KEY = "ts_tools_added_departments"
const MODAL_KEY = "ts_tools_patch_v2_skip"

// Use the same card component for both sections
function SortableCard({ item, index }: { item: Tool; index: number }) {
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
    zIndex: isDragging ? 0 : 'auto',
    opacity: isDragging ? 0.3 : 1, // Keep slightly visible so user sees the shape pushing others, or just let the empty gap move. 0.3 is standard
  }

  const accent = ACCENT_CLASSES[item.accentColor || 'primary']

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group h-full touch-none p-0 overflow-hidden transition-all duration-300 rounded-2xl animate-fade-up",
        !isDragging && "bg-card border-border shadow-sm hover:shadow-xl hover:scale-[1.02]",
        !isDragging && accent.hover,
        isDragging && "border-2 border-dashed bg-transparent border-border/50 shadow-none scale-100"
      )}
    >
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-4 left-4 p-2 text-muted-foreground/30 hover:text-primary hover:bg-primary/10 transition-colors cursor-grab active:cursor-grabbing rounded-lg z-30"
      >
        <DotsSixVertical size={20} />
      </button>

      <Link
        href={item.href}
        style={{ animationDelay: `${index * 60}ms` }}
        className="flex flex-col p-6 h-full w-full relative min-h-[300px]"
      >
        <div className="w-full flex items-start justify-end mb-4 min-h-[28px]">
          {/* Badge */}
          {item.badge && (
            <Badge 
              variant="outline"
              className={cn("text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] shadow-sm ml-auto opacity-70 border-none", item.badgeColor)}
            >
              {item.badge}
            </Badge>
          )}
        </div>

        <div className="flex flex-col items-center flex-1 mt-auto justify-center px-1">
          {/* Icon */}
          <div className={cn("size-16 rounded-2xl flex items-center justify-center mb-6 shrink-0 transition-transform duration-300", accent.icon)}>
            {item.icon}
          </div>

          <h2 className="text-lg md:text-xl font-extrabold mb-3 text-foreground text-center line-clamp-2 leading-tight tracking-tight">
            {item.label}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed text-center line-clamp-3">
            {item.description}
          </p>
        </div>
      </Link>
    </Card>
  )
}

function DragOverlayCard({ item }: { item: Tool }) {
  const accent = ACCENT_CLASSES[item.accentColor || 'primary']
  return (
    <Card
      className={cn(
        "flex flex-col bg-card border-2 border-primary rounded-2xl shadow-2xl h-full w-full relative min-h-[300px] overflow-hidden rotate-2 scale-105 cursor-grabbing"
      )}
    >
      <div className="absolute top-4 left-4 p-2 text-primary bg-primary/10 rounded-lg shadow-sm z-30">
        <DotsSixVertical size={20} />
      </div>

      <div className="w-full flex items-start justify-end mb-4 min-h-[28px] px-6 pt-6">
        {item.badge && (
          <Badge 
            variant="outline"
            className={cn("text-[0.65rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] shadow-sm ml-auto border-none", item.badgeColor)}
          >
            {item.badge}
          </Badge>
        )}
      </div>

      <div className="flex flex-col items-center flex-1 mt-auto justify-center px-1 pb-6">
        <div className={cn("size-16 rounded-2xl flex items-center justify-center mb-6 shrink-0 transition-transform duration-300 scale-110", accent.icon)}>
          {item.icon}
        </div>
        <h2 className="text-lg md:text-xl font-extrabold mb-3 text-foreground text-center line-clamp-2 leading-tight tracking-tight">
          {item.label}
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed text-center line-clamp-3">
          {item.description}
        </p>
      </div>
    </Card>
  )
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [tools, setTools] = useState<Tool[]>(DEFAULT_TOOLS)
  const [knowledgeItems, setKnowledgeItems] = useState<Tool[]>(DEFAULT_KNOWLEDGE)
  const [activeDepartment, setActiveDepartment] = useState("Todos")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isAddCardModalOpen, setAddCardModalOpen] = useState(false);

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
    let initialTools = [...DEFAULT_TOOLS];
    let initialKnowledge = [...DEFAULT_KNOWLEDGE];

    const storedToolsIds = localStorage.getItem(ORDER_KEY);
    const storedKnowledgeIds = localStorage.getItem(KNOWLEDGE_ORDER_KEY);
    const storedAdded = localStorage.getItem(ADDED_DEPARTMENTS_KEY);

    let parsedAdded: Record<string, string[]> = {};
    if (storedAdded) {
      try { parsedAdded = JSON.parse(storedAdded); } catch {}
    }

    try {
      if (storedToolsIds) {
        const tIds = JSON.parse(storedToolsIds) as string[];
        const loadedTools = tIds.map(id => ALL_ITEMS.find(i => i.id === id)).filter(Boolean) as Tool[];
        initialTools = loadedTools;
      }
      if (storedKnowledgeIds) {
        const kIds = JSON.parse(storedKnowledgeIds) as string[];
        const loadedKnowledge = kIds.map(id => ALL_ITEMS.find(i => i.id === id)).filter(Boolean) as Tool[];
        initialKnowledge = loadedKnowledge;
      }

      // Add missing items that were not saved
      const allLoadedIds = new Set([...(initialTools.map(t => t.id)), ...(initialKnowledge.map(k => k.id))]);
      const missingTools = DEFAULT_TOOLS.filter(t => !allLoadedIds.has(t.id));
      const missingKnowledge = DEFAULT_KNOWLEDGE.filter(k => !allLoadedIds.has(k.id));

      initialTools = [...initialTools, ...missingTools];
      initialKnowledge = [...initialKnowledge, ...missingKnowledge];
    } catch {
       localStorage.removeItem(ORDER_KEY)
       localStorage.removeItem(KNOWLEDGE_ORDER_KEY)
    }

    // Apply externally added custom departments
    initialTools = initialTools.map(t => ({
      ...t,
      departments: parsedAdded[t.id] ? Array.from(new Set([...t.departments, ...parsedAdded[t.id]])) : t.departments
    }));
    initialKnowledge = initialKnowledge.map(k => ({
      ...k,
      departments: parsedAdded[k.id] ? Array.from(new Set([...k.departments, ...parsedAdded[k.id]])) : k.departments
    }));

    setTools(initialTools)
    setKnowledgeItems(initialKnowledge)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = tools.some(t => t.id === activeId) ? 'tools' : (knowledgeItems.some(k => k.id === activeId) ? 'knowledge' : null);
    const overContainer = tools.some(t => t.id === overId) ? 'tools' : (knowledgeItems.some(k => k.id === overId) ? 'knowledge' : null);

    if (!activeContainer || !overContainer) return;

    // Live sorting within the SAME array (pushes cards instantly)
    if (activeContainer === overContainer) {
      if (activeContainer === 'tools') {
        setTools(prev => {
          const oldIndex = prev.findIndex(t => t.id === activeId);
          const newIndex = prev.findIndex(t => t.id === overId);
          return arrayMove(prev, oldIndex, newIndex);
        });
      } else {
        setKnowledgeItems(prev => {
          const oldIndex = prev.findIndex(k => k.id === activeId);
          const newIndex = prev.findIndex(k => k.id === overId);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
      return;
    }

    // Moving ACROSS containers
    const activeItem = activeContainer === 'tools' ? tools.find(t => t.id === activeId)! : knowledgeItems.find(k => k.id === activeId)!;

    if (activeContainer === 'tools') {
      setTools(prev => prev.filter(t => t.id !== activeId));
      setKnowledgeItems(prev => {
        const overIndex = prev.findIndex(k => k.id === overId);
        const newIndex = overIndex >= 0 ? overIndex : prev.length;
        return [...prev.slice(0, newIndex), activeItem, ...prev.slice(newIndex)];
      });
    } else {
      setKnowledgeItems(prev => prev.filter(k => k.id !== activeId));
      setTools(prev => {
        const overIndex = prev.findIndex(t => t.id === overId);
        const newIndex = overIndex >= 0 ? overIndex : prev.length;
        return [...prev.slice(0, newIndex), activeItem, ...prev.slice(newIndex)];
      });
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    
    // Arrays were instantly reorganized in onDragOver natively by our updates!
    // So we just secure persistence from the freshest state.
    setTools(t => {
      localStorage.setItem(ORDER_KEY, JSON.stringify(t.map(i => i.id)))
      return t;
    })
    setKnowledgeItems(k => {
      localStorage.setItem(KNOWLEDGE_ORDER_KEY, JSON.stringify(k.map(i => i.id)))
      return k;
    })
  }

  const handleCloseModal = () => {
    if (dontShowAgain) localStorage.setItem(MODAL_KEY, 'true')
    setShowModal(false)
  }

  const handleToggleDepartmentItem = (itemId: string) => {
    const isTool = tools.some(t => t.id === itemId);
    const setList = isTool ? setTools : setKnowledgeItems;
    
    const currentItem = [...tools, ...knowledgeItems].find(t => t.id === itemId)!;
    const isAdding = !currentItem.departments.includes(activeDepartment);

    setList(prev => prev.map(t => {
      if (t.id === itemId) {
        if (isAdding) return { ...t, departments: [...t.departments, activeDepartment] };
        return { ...t, departments: t.departments.filter(d => d !== activeDepartment) };
      }
      return t;
    }));

    const stored = localStorage.getItem(ADDED_DEPARTMENTS_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    const existingArr = parsed[itemId] || [];
    
    if (isAdding) parsed[itemId] = Array.from(new Set([...existingArr, activeDepartment]));
    else parsed[itemId] = existingArr.filter((d: string) => d !== activeDepartment);

    localStorage.setItem(ADDED_DEPARTMENTS_KEY, JSON.stringify(parsed));
  }

  const customizableItems = mounted ? [...tools, ...knowledgeItems].filter(item => {
    const nativeItem = ALL_ITEMS.find(n => n.id === item.id);
    return nativeItem && !nativeItem.departments.includes(activeDepartment);
  }) : [];

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 mt-8 animate-fade-up">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f3f0ed] to-[#a99d94]">
            Crie. Converta.{" "}
          </span>
          <span className="text-primary drop-shadow-lg">Escale.</span>
        </h1>
        <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto font-medium">
          Sua central de inteligência e automação para escalar operações de <strong className="text-foreground">Home Services nos EUA</strong>.
        </p>
      </div>

      <div className="flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '50ms' }}>
          <Link href="/meu-checklist" className="inline-flex items-center gap-2 text-[0.65rem] md:text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-primary/10">
            <ListTodo size={14} className="opacity-80" /> Meu Checklist
          </Link>
      </div>

      {/* Departments Layer Section */}
      <section className="mb-14 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {DEPARTMENTS.map(dep => {
            const isActive = activeDepartment === dep.id;
            return (
              <button
                key={dep.id}
                onClick={() => setActiveDepartment(dep.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                  isActive ? `shadow-lg scale-[1.02] ${dep.activeClass}` : `bg-card opacity-80 ${dep.inactiveClass}`
                )}
              >
                <div className={cn("mb-2 transition-transform duration-300", isActive && "scale-110")}>
                  {dep.icon}
                </div>
                <span className={cn("text-[0.65rem] md:text-sm font-bold tracking-tight uppercase md:normal-case", isActive ? "opacity-100" : "")}>
                  {dep.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Main Drag Context Wrapping both sections if mounted */}
      {mounted ? (
        <DndContext
          id="global-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          {/* Tools Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Wrench size={24} className="text-primary" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Ferramentas
              </h3>
              <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
              <span className="text-[0.65rem] font-bold text-muted-foreground flex items-center gap-1 opacity-60">
                Arraste entre sessões
              </span>
            </div>
            <SortableContext
              items={tools.map(t => t.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(tools.filter(t => activeDepartment === "Todos" || t.departments.includes(activeDepartment))).map((tool, i) => (
                  <SortableCard key={tool.id} item={tool} index={i} />
                ))}
                {activeDepartment !== "Todos" && (
                   <button
                     onClick={() => setAddCardModalOpen(true)}
                     className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-2xl min-h-[300px] bg-primary/5 text-primary/70 hover:text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
                   >
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Plus size={24} />
                     </div>
                     <span className="font-bold text-sm uppercase tracking-widest text-center max-w-[120px]">Gerenciar Cards</span>
                   </button>
                )}
              </div>
            </SortableContext>
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
                Arraste entre sessões
              </span>
            </div>
            <SortableContext
              items={knowledgeItems.map(k => k.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(knowledgeItems.filter(k => activeDepartment === "Todos" || k.departments.includes(activeDepartment))).map((item, i) => (
                  <SortableCard key={item.id} item={item} index={i} />
                ))}
                {activeDepartment !== "Todos" && (
                   <button
                     onClick={() => setAddCardModalOpen(true)}
                     className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-2xl min-h-[300px] bg-primary/5 text-primary/70 hover:text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
                   >
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Plus size={24} />
                     </div>
                     <span className="font-bold text-sm uppercase tracking-widest text-center max-w-[120px]">Gerenciar Cards</span>
                   </button>
                )}
              </div>
            </SortableContext>
          </section>

          {/* Persistent Custom Overlay for Dragging */}
          <DragOverlay zIndex={1000} dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
            {activeId ? (
              <DragOverlayCard item={[...tools, ...knowledgeItems].find(t => t.id === activeId)!} />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <>
          {/* Fallback Tools Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Wrench size={24} className="text-primary" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">Ferramentas</h3>
              <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeDepartment === "Todos" ? DEFAULT_TOOLS : DEFAULT_TOOLS.filter(t => t.departments.includes(activeDepartment))).map((tool) => (
                <Skeleton key={tool.id} className="h-[280px] rounded-2xl" />
              ))}
            </div>
          </section>

          {/* Fallback Knowledge Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap size={24} className="text-primary" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">Conhecimento</h3>
              <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeDepartment === "Todos" ? DEFAULT_KNOWLEDGE : DEFAULT_KNOWLEDGE.filter(k => k.departments.includes(activeDepartment))).map((item) => (
                <Skeleton key={item.id} className="h-[300px] rounded-2xl" />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border mt-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="flex flex-col items-center gap-4">
          <img src="/logo/TS-TOOLS-ALLWHITE.svg" alt="TS TOOLS" className="h-[25px] opacity-20 hover:opacity-50 transition-opacity grayscale" />
          <p className="text-[11px] text-muted-foreground/60 font-semibold uppercase tracking-widest leading-none">
            TS TOOLS &copy; {mounted ? new Date().getFullYear() : "2026"} &bull; CENTRAL DE FERRAMENTAS
          </p>
          <p className="text-[10px] text-muted-foreground/40 font-medium">
            A solução definitiva para escalar operações de Home Services.
          </p>
        </div>
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

            <ScrollArea className="h-[380px] pr-4">
              <div className="space-y-6">
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
            </ScrollArea>

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

      {/* Add Card to Department Modal */}
      <Dialog open={isAddCardModalOpen} onOpenChange={setAddCardModalOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-border bg-card shadow-2xl">
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-2xl font-bold text-foreground">
                Personalizar <span className="text-primary">{activeDepartment}</span>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Gerencie ferramentas de outros departamentos que você deseja incluir ou remover desta visão.</p>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {customizableItems.length === 0 ? (
                 <div className="py-12 flex flex-col items-center justify-center opacity-60">
                   <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                     <MagicWand size={32} className="text-muted-foreground" />
                   </div>
                   <p className="text-muted-foreground text-center font-medium">Não há outras ferramentas<br/>disponíveis para personalização.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {customizableItems.sort((a, b) => {
                    const aAdded = a.departments.includes(activeDepartment);
                    const bAdded = b.departments.includes(activeDepartment);
                    return (aAdded === bAdded) ? a.label.localeCompare(b.label) : (aAdded ? -1 : 1);
                 }).map(item => {
                   const isAdded = item.departments.includes(activeDepartment);
                   return (
                     <button 
                       key={item.id}
                       onClick={() => handleToggleDepartmentItem(item.id)}
                       className={cn(
                         "flex items-center cursor-pointer gap-4 p-4 border rounded-xl transition-all text-left group active:scale-[0.98]",
                         isAdded ? "border-primary/50 bg-primary/5 hover:border-destructive hover:bg-destructive/5" : "border-border hover:border-primary hover:bg-primary/5"
                       )}
                     >
                       <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors", 
                          isAdded ? "bg-primary/20 text-primary" : `bg-input ${ACCENT_CLASSES[item.accentColor || 'primary'].icon}`
                       )}>
                          {item.icon}
                       </div>
                       <div className="flex flex-col min-w-0">
                         <h4 className="font-bold text-sm text-foreground truncate">{item.label}</h4>
                         <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                       </div>
                       <div className={cn("ml-auto flex items-center justify-center w-8 h-8 rounded-lg shadow-sm transition-all", 
                          isAdded ? "bg-primary text-primary-foreground group-hover:bg-destructive group-hover:text-destructive-foreground opacity-100 shadow-md" : "opacity-0 group-hover:opacity-100 bg-primary/10 text-primary"
                       )}>
                         {isAdded ? (
                            <>
                              <Check size={18} className="block group-hover:hidden stroke-[3]" />
                              <X size={18} className="hidden group-hover:block stroke-[2.5]" />
                            </>
                         ) : <Plus size={18} className="stroke-[2.5]" />}
                       </div>
                     </button>
                   );
                 })}
                 </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setAddCardModalOpen(false)}
                className="bg-muted hover:bg-muted/80 text-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                Concluir
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

