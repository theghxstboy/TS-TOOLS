import { auth } from "@/auth"

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // Se não está logado e não está na página de login → redirecionar para login
    if (!isLoggedIn && pathname !== "/login") {
        const loginUrl = new URL("/login", req.nextUrl.origin)
        // Preservar a URL de destino para redirecionar após login
        loginUrl.searchParams.set("callbackUrl", pathname)
        return Response.redirect(loginUrl)
    }

    // Se já está logado e tenta acessar /login → redirecionar para home
    if (isLoggedIn && pathname === "/login") {
        const homeUrl = new URL("/", req.nextUrl.origin)
        return Response.redirect(homeUrl)
    }
})

export const config = {
    matcher: [
        /*
         * Protege todas as rotas EXCETO:
         * - /api/auth/** (endpoints do NextAuth)
         * - /_next/static (arquivos estáticos do Next.js)
         * - /_next/image (otimização de imagem)
         * - /favicon.ico, /logo.png e outros assets públicos
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico|logo\\.png|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp).*)",
    ],
}
