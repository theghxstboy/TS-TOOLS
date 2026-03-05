"use client";

import { useState } from "react";
import { PRESETS, CHECKBOX_COMMANDS, OutputMode, GeneratorMode, TabKey } from "@/constants/gerador-humano";
import { useGenerationHistory, HistoryItem } from "@/hooks/useGenerationHistory";

export function usePromptGenerator() {
    const [mode, setMode] = useState<OutputMode>("imagem");
    const [genMode, setGenMode] = useState<GeneratorMode>("simple");
    const [selectedPreset, setSelectedPreset] = useState<string>("vlog");
    const [activeTab, setActiveTab] = useState<TabKey>("rosto");

    const [selectedCheckboxes, setSelectedCheckboxes] = useState<Set<string>>(new Set(["cabelo_natural", "pele_imperfeita", "roupa_amassada", "rua_movimentada", "iluminacao_natural"]));
    const [sliderPos, setSliderPos] = useState(25);
    const [isCopied, setIsCopied] = useState(false);

    const { history, saveHistory } = useGenerationHistory("gerador-humano");

    const [customAction, setCustomAction] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");

    const [userDetails, setUserDetails] = useState({
        genero: "",
        etnia: "",
        cabelo: "",
        idade: ""
    });

    const toggleCommand = (cmdId: string) => {
        const next = new Set(selectedCheckboxes);
        if (next.has(cmdId)) {
            next.delete(cmdId);
        } else {
            next.add(cmdId);
        }
        setSelectedCheckboxes(next);
    };

    const handlePresetClick = (presetId: string) => {
        if (selectedPreset === presetId) {
            setSelectedPreset("");
            setSelectedCheckboxes(new Set());
            return;
        }
        setSelectedPreset(presetId);
        if (presetId === "escuro") {
            setSelectedCheckboxes(new Set(["pele_oleosa", "dim_lighting", "ruido"]));
        } else if (presetId === "elevador") {
            setSelectedCheckboxes(new Set(["costuras_visiveis", "fluorescente", "baixa_res"]));
        } else {
            setSelectedCheckboxes(new Set(["cabelo_natural", "pele_imperfeita", "roupa_amassada", "rua_movimentada", "iluminacao_natural"]));
        }
    };

    const handleClear = () => {
        setSelectedCheckboxes(new Set());
        setUserDetails({ genero: "", etnia: "", cabelo: "", idade: "" });
        setCustomAction("");
        setNegativePrompt("");
    };

    const generatePrompt = () => {
        const preset = PRESETS.find(p => p.id === selectedPreset);
        let base = preset ? preset.basePrompt : "A photorealistic portrait of a human";

        if (genMode === "advanced" && customAction.trim() !== "") {
            base = customAction;
        }

        if (mode === "video") {
            base = base.replace(/photo/g, "cinematic video scene").replace(/Selfie/g, "Video selfie recording");
        }

        const modifiers: string[] = [];

        const detailsArray = [];
        if (userDetails.idade && userDetails.idade !== "none") detailsArray.push(userDetails.idade);
        if (userDetails.etnia && userDetails.etnia !== "none") detailsArray.push(userDetails.etnia);
        if (userDetails.genero && userDetails.genero !== "none") detailsArray.push(userDetails.genero);
        if (userDetails.cabelo && userDetails.cabelo !== "none") detailsArray.push(`with ${userDetails.cabelo} hair`);

        if (detailsArray.length > 0) {
            base = `${detailsArray.join(" ")}, ` + base;
        }

        Object.values(CHECKBOX_COMMANDS).forEach(group => {
            group.forEach(cmd => {
                if (selectedCheckboxes.has(cmd.id)) {
                    modifiers.push(cmd.promptText);
                }
            });
        });

        if (modifiers.length > 0) {
            base += `, ${modifiers.join(", ")}.`;
        }

        const standardNegative = `[Negative]: plastic skin, 3d render, illustration, smooth skin, symmetrical perfect face, artificial lighting.`;
        const finalNegative = (genMode === "advanced" && negativePrompt.trim() !== "")
            ? `[Negative]: ${negativePrompt} `
            : standardNegative;

        return `${base} \n\n${finalNegative} `;
    };

    const finalPrompt = generatePrompt();

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(finalPrompt);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = finalPrompt;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setIsCopied(true);

            saveHistory({
                mode, genMode, selectedPreset,
                selectedCheckboxes: Array.from(selectedCheckboxes),
                customAction, negativePrompt, userDetails
            }, finalPrompt);

            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    };

    const handleRestore = (item: HistoryItem) => {
        const p = item.payload;
        if (!p) return;

        setMode(p.mode || "imagem");
        setGenMode(p.genMode || "simple");
        setSelectedPreset(p.selectedPreset || "");

        if (p.selectedCheckboxes) {
            setSelectedCheckboxes(new Set(p.selectedCheckboxes));
        }

        setCustomAction(p.customAction || "");
        setNegativePrompt(p.negativePrompt || "");

        if (p.userDetails) {
            setUserDetails(p.userDetails);
        }
    };

    return {
        // State
        mode, setMode,
        genMode, setGenMode,
        selectedPreset, handlePresetClick,
        activeTab, setActiveTab,
        selectedCheckboxes, toggleCommand,
        sliderPos, setSliderPos,
        isCopied, handleCopy,
        customAction, setCustomAction,
        negativePrompt, setNegativePrompt,
        userDetails, setUserDetails,
        finalPrompt,
        handleClear,
        history, handleRestore
    };
}
