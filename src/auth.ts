import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { timingSafeEqual } from "crypto"

/**
 * Compara duas strings em tempo constante para prevenir timing attacks.
 * Retorna false imediatamente se os comprimentos forem diferentes,
 * evitando que o tamanho da senha vaze via tempo de resposta.
 */
function safeCompare(a: string, b: string): boolean {
    if (!a || !b) return false
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;
                const operacaoUser = process.env.OPERACAO_USER;
                const operacaoPassword = process.env.OPERACAO_PASSWORD;

                const email = credentials?.email as string | undefined
                const password = credentials?.password as string | undefined

                if (!email || !password) {
                    return null;
                }

                // Verifica Admin usando comparação em tempo constante
                if (adminEmail && adminPassword &&
                    safeCompare(email, adminEmail) &&
                    safeCompare(password, adminPassword)) {
                    return { id: "1", name: "Administrador", email: adminEmail, role: "admin" }
                }

                // Verifica Operação usando comparação em tempo constante
                if (operacaoUser && operacaoPassword &&
                    safeCompare(email, operacaoUser) &&
                    safeCompare(password, operacaoPassword)) {
                    return { id: "2", name: "Operador", email: "operacao@tstools.com", role: "user" }
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role || (user.email === process.env.ADMIN_EMAIL ? "admin" : "user");
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    trustHost: true,
    secret: process.env.AUTH_SECRET,
})
