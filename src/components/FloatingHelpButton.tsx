"use client";

import { useState } from "react";
import { Question } from "@phosphor-icons/react";
import { TutorialDialog } from "./TutorialDialog";

interface FloatingHelpButtonProps {
    pageTitle: string;
}

export function FloatingHelpButton({ pageTitle }: FloatingHelpButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary shadow-lg transition-all hover:scale-110 active:scale-95 group"
                title="Como usar esta ferramenta?"
            >
                <Question size={24} weight="bold" />
                <span className="absolute right-full mr-3 px-3 py-1 bg-card border border-border rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
                    Ajuda / Tutorial
                </span>
            </button>

            <TutorialDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                pageTitle={pageTitle}
            />
        </>
    );
}
