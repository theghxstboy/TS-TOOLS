"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";

export function BackButton() {
    const pathname = usePathname();

    // Show button only if we are not on the home page
    if (pathname === "/") {
        return <div className="flex-1" />; // Placeholder to keep spacing
    }

    return (
        <div className="flex-1">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-semibold p-2 rounded-lg hover:bg-primary/10 w-fit"
            >
                <ArrowLeft size={20} weight="bold" />
                <span className="hidden sm:inline">Voltar ao Início</span>
            </Link>
        </div>
    );
}
