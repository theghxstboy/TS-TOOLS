// Layout para páginas de autenticação (login, etc.)
// Sem Header, sem CommandPalette — tela limpa para o usuário fazer login.
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <>{children}</>
}
