"use client";

import { SessionProvider } from "next-auth/react";
import { UIProvider } from "@/hooks/useUI";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <TooltipProvider>
                <UIProvider>
                    {children}
                </UIProvider>
            </TooltipProvider>
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
