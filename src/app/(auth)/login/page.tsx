"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError("")
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (res?.error) {
                setError("Credenciais inválidas. Tente novamente.")
            } else {
                router.push("/")
            }
        } catch (err) {
            console.error("Erro ao fazer login:", err)
            setError("Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-10 shadow-2xl border border-border animate-fade-up">
                <div className="text-center">
                    <img src="/logo.png" alt="TS TOOLS" className="h-[60px] w-auto mx-auto mb-6" />
                    <h2 className="text-2xl font-extrabold text-foreground drop-shadow-sm">
                        Bem-vindo ao TS TOOLS
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Acesse o Hub de Ferramentas
                    </p>
                </div>

                {/* Login com Credenciais */}
                <form
                    className="mt-8 space-y-4"
                    action={handleSubmit}
                >
                    {error && (
                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Email ou Usuário
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="username"
                                required
                                className="mt-1 block w-full rounded-md border border-border bg-input text-foreground px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm placeholder-muted-foreground"
                                placeholder="seu@email.com ou usuário"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full rounded-md border border-border bg-input text-foreground px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm placeholder-muted-foreground"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 px-4 py-3 text-sm font-bold text-black transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar com Senha'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
                        </div>
                    </div>

                    {/* Login com Google */}
                    <div className="mt-6">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            type="button"
                            className="group relative flex w-full justify-center rounded-xl bg-input border border-border hover:bg-accent px-4 py-3 text-sm font-semibold text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-border"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </span>
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
