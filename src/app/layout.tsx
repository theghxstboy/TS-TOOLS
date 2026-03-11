import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
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
          {children}
        </Providers>
      </body>
    </html>
  )
}
