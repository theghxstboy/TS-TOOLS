"use client"

import { useSession, signOut, signIn } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BackButton } from "./BackButton"
import { SearchTrigger } from "./SearchTrigger"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ListTodo, PackageSearch } from "lucide-react"

export default function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const isHome = pathname === "/"

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md">
            <div className={cn(
                "container mx-auto grid grid-cols-3 h-20 items-center px-6 transition-all duration-500 ease-in-out",
                isHome ? "max-w-5xl" : "max-w-[1400px]"
            )}>
                {/* Left Side: Logo + Back Button */}
                <div className="flex items-center gap-4 py-2">
                    <div className={cn(
                        "flex items-center transition-all duration-500 ease-in-out",
                        isHome ? "w-0 opacity-0 -translate-x-4 pointer-events-none" : "w-auto opacity-100 translate-x-0"
                    )}>
                        <BackButton />
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/" className={cn(
                                "transition-all duration-500 ease-in-out hover:opacity-80 shrink-0",
                                !isHome && "ml-2"
                            )}>
                                {/* Desktop Logo */}
                                <img src="/logo/TS-TOOLS.svg" alt="TS TOOLS" className="h-[40px] md:h-[50px] w-auto hidden md:block transition-all duration-500" />
                                {/* Mobile Logo */}
                                <img src="/logo/ICONE.svg" alt="TS TOOLS" className="h-[35px] block md:hidden w-auto transition-all duration-500" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Voltar ao Início</TooltipContent>
                    </Tooltip>
                </div>

                {/* Center: Search Trigger */}
                <div className="flex justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <SearchTrigger />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="flex items-center gap-2">
                            <span>Busca Rápida</span>
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 italic">
                              ctrl+k
                            </kbd>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Right Side: User Area */}
                <div className="flex justify-end items-center gap-4">
                    {session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none flex items-center gap-2 group">
                                <span className="hidden lg:inline-block text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors max-w-[120px] truncate">
                                    {session.user.name}
                                </span>
                                <Avatar className="h-9 w-9 cursor-pointer border border-border transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background group-hover:opacity-90">
                                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                        {session.user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 font-inter">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-foreground">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link href="/ferramentas" className="flex items-center w-full">
                                        <PackageSearch size={14} className="mr-2 opacity-70" />
                                        Hub de Ferramentas
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link href="/meu-checklist" className="flex items-center w-full">
                                        <ListTodo size={14} className="mr-2 opacity-70" />
                                        Meu Checklist
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {session.user.role === "admin" && (
                                    <>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Link href="/admin/ferramentas" className="w-full">Painel Admin</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem 
                                    className="cursor-pointer text-destructive font-semibold"
                                    onClick={() => signOut()}
                                >
                                    Sair da conta
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Entrar
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}
