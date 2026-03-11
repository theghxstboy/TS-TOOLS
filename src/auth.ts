import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

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
                // Logica simplificada para login estático usando variáveis de ambiente
                // Idealmente, você faria uma busca (Ex: no banco de dados) para checar a senha.
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                if (credentials.email === adminEmail && credentials.password === adminPassword) {
                    // Retorna um objeto de usuário que será salvo na sessão (Admin)
                    return { id: "1", name: "Administrador", email: adminEmail, role: "admin" }
                }


                // Return null if user data could not be retrieved
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
    }
})
