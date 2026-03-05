import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import { Providers } from "@/components/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TS TOOLS - Central de Ferramentas",
  description: "Crie. Converta. Escale. Sua central para escalar operações de Home Services nos EUA.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} min-h-screen bg-background flex flex-col font-sans transition-colors`}>
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
