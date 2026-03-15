"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const routeMap: Record<string, string> = {
    "docs": "Academy",
    "nichos": "Manual dos Nichos",
    "inicio-rapido": "Início Rápido",
    "anatomia-prompt": "Anatomia do Prompt",
    "tecnicas-avancadas": "Técnicas Avançadas",
    "parametros-flow": "Parâmetros Flow AI",
    "video-expert": "Direção de Vídeo",
    "gerador": "Gerador de Imagem",
    "gerador-video": "Gerador de Vídeo",
    "gerador-webdesign": "Web Design",
    "antes-depois": "Antes & Depois",
    "gerador-humano": "Humano Realista",
    "workflow": "Workflow",
    "historico": "Meus Prompts",
    "ferramentas": "Hub de Ferramentas"
}

export function Breadcrumbs() {
    const pathname = usePathname()
    if (pathname === "/") return null

    const segments = pathname.split("/").filter(Boolean)

    return (
        <nav className="w-full bg-card border-b border-border py-2 px-6">
            <div className={cn(
                "container mx-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all duration-500",
                pathname === "/" ? "max-w-5xl" : "max-w-[1400px]"
            )}>
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home size={12} />
                    HUB
                </Link>

                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1
                    const title = routeMap[segment] || segment.replace(/-/g, " ")

                    return (
                        <div key={href} className="flex items-center gap-2">
                            <ChevronRight size={12} className="opacity-50" />
                            {isLast ? (
                                <span className="text-foreground truncate max-w-[150px]">{title}</span>
                            ) : (
                                <Link 
                                    href={href} 
                                    className="hover:text-primary transition-colors truncate max-w-[150px]"
                                >
                                    {title}
                                </Link>
                            )}
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}
