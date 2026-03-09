import { auth, signIn, signOut } from "@/auth"
import Link from "next/link"
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

export default async function Header() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md">
            <div className="container mx-auto grid grid-cols-3 h-20 max-w-6xl items-center px-4">
                {/* Left Side: Logo + Back Button */}
                <div className="flex items-center gap-4">
                    <BackButton />
                    <Link href="/" className="transition-opacity hover:opacity-80 shrink-0">
                        <img src="/logo.png" alt="TS TOOLS" className="h-[45px] md:h-[55px] w-auto" />
                    </Link>
                </div>

                {/* Center: Search Trigger */}
                <div className="flex justify-center">
                    <SearchTrigger />
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
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href="/ferramentas" className="w-full">Hub de Ferramentas</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href="/gerador-webdesign" className="w-full flex items-center justify-between">
                                        Web Design Gen
                                        <span className="text-[9px] font-bold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded uppercase">Dev</span>
                                    </Link>
                                </DropdownMenuItem>
                                {session.user.role === "admin" && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-red-500 font-bold">
                                            <Link href="/ferramentas/admin" className="w-full">Painel Admin</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <form
                                        action={async () => {
                                            "use server"
                                            await signOut()
                                        }}
                                        className="w-full"
                                    >
                                        <button type="submit" className="w-full text-left cursor-pointer text-destructive font-semibold hover:text-destructive/80 transition-colors">
                                            Sair da conta
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <form
                            action={async () => {
                                "use server"
                                await signIn()
                            }}
                        >
                            {/* Sign in button if needed */}
                        </form>
                    )}
                </div>
            </div>
        </header>
    )
}
