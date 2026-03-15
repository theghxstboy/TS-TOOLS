"use client";

import { SessionProvider } from "next-auth/react";
import { UIProvider } from "@/hooks/useUI";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <UIProvider>
                {children}
            </UIProvider>
            <Toaster
                position="bottom-right"
                theme="dark"
                richColors
                closeButton
                toastOptions={{
                    classNames: {
                        toast: "font-sans border border-border bg-card text-foreground shadow-2xl",
                    }
                }}
            />
        </SessionProvider>
    );
}
