import Header from "@/components/Header"
import { CommandPalette } from "@/components/CommandPalette"
import { Breadcrumbs } from "@/components/Breadcrumbs"

// Layout para páginas autenticadas — inclui Header e CommandPalette
export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Header />
            <Breadcrumbs />
            <CommandPalette />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </>
    )
}
