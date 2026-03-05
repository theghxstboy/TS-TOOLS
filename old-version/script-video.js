// script-video.js - Lógica exclusiva para o Gerador de Prompts de Vídeos AI

document.addEventListener('DOMContentLoaded', () => {
    // ── Niche Docs Map (Internal) ───────────────────────────────────────────
    const BASE_DOCS = 'docs/nichos.html'; // Default for video is the main hub for now

    const docsBtn = document.getElementById('docs-btn');
    const nicheSelectEl = document.getElementById('niche');

    function updateDocsLink() {
        if (!docsBtn) return;
        // Video gen niches are broad, so we point them to the main hub
        // but we could map specific ones if needed.
        docsBtn.href = BASE_DOCS;
    }

    if (nicheSelectEl) {
        nicheSelectEl.addEventListener('change', updateDocsLink);
    }
    updateDocsLink();
    // ─────────────────────────────────────────────────────────────────────────

    // Buttons
    const generateBtn = document.getElementById('generate-video-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Mode Toggles
    const simpleModeBtn = document.getElementById('simple-mode-btn');
    const advancedModeBtn = document.getElementById('advanced-mode-btn');
    const simpleFields = document.getElementById('simple-fields');
    const advancedFields = document.getElementById('advanced-fields');

    // Output areas
    const promptOutput = document.getElementById('prompt-output');
    const emptyState = document.getElementById('empty-state');
    const form = document.getElementById('video-form');

    let currentMode = 'simple';

    // Toggle logic
    simpleModeBtn.addEventListener('click', () => {
        currentMode = 'simple';
        simpleModeBtn.classList.add('active');
        advancedModeBtn.classList.remove('active');
        simpleFields.classList.remove('hidden-mode');
        advancedFields.classList.add('hidden-mode');
    });

    advancedModeBtn.addEventListener('click', () => {
        currentMode = 'advanced';
        advancedModeBtn.classList.add('active');
        simpleModeBtn.classList.remove('active');
        advancedFields.classList.remove('hidden-mode');
        simpleFields.classList.add('hidden-mode');
    });

    // Handle "Other" inputs visibility
    const otherToggles = ['niche', 'motion', 'angle', 'lens', 'speed'];

    otherToggles.forEach(id => {
        const select = document.getElementById(id);
        const otherInput = document.getElementById(`${id}-other`);

        if (select && otherInput) {
            select.addEventListener('change', () => {
                if (select.value === 'other') {
                    otherInput.style.display = 'block';
                    otherInput.focus();
                } else {
                    otherInput.style.display = 'none';
                }
            });
        }
    });

    function generatePrompt() {
        const copyAction = document.getElementById('copy').value.trim();

        if (!copyAction) {
            alert("Ação principal (Copy) é obrigatória para gerar o vídeo.");
            return;
        }

        let niche, motion, angle, lens, speed;

        if (currentMode === 'simple') {
            niche = document.getElementById('niche').value === 'other' ? document.getElementById('niche-other').value : document.getElementById('niche').value;
            motion = document.getElementById('motion').value === 'other' ? document.getElementById('motion-other').value : document.getElementById('motion').value;
            angle = document.getElementById('angle').value === 'other' ? document.getElementById('angle-other').value : document.getElementById('angle').value;
            lens = document.getElementById('lens').value === 'other' ? document.getElementById('lens-other').value : document.getElementById('lens').value;
            speed = document.getElementById('speed').value === 'other' ? document.getElementById('speed-other').value : document.getElementById('speed').value;

        } else {
            niche = document.getElementById('niche-adv').value.trim();
            motion = document.getElementById('motion-adv').value.trim();
            angle = document.getElementById('angle-adv').value.trim();
            lens = document.getElementById('lens-adv').value.trim();
            speed = document.getElementById('speed-adv').value.trim();
            const negativeAdv = document.getElementById('negative-adv').value.trim();
            if (negativeAdv) this.negativePromptValue = negativeAdv; else this.negativePromptValue = '';
        }

        // --- THE MAGIC FORMULA FOR VIDEO AI (VEO, KLING, SORA) ---
        // A estrutura ideal para IAs de vídeo começa com a Técnica > O Que Está Acontecendo > Detalhes Técnicos.
        // A copy (Ação) é a estrela.

        let promptParts = [];

        // 1. Cine Directions (Abre o prompt já dando o tom de movimento)
        let direction = '';
        if (motion && angle) {
            direction = `${motion}, ${angle}.`;
        } else if (motion) {
            direction = `${motion}.`;
        } else if (angle) {
            direction = `${angle}.`;
        }
        if (direction) promptParts.push(direction);

        // 2. The Core Action (based on the short copy)
        // Explicitly format to demand a short/continuous action "A short video showing..."
        let actionStr = `A highly detailed video showing ${copyAction}`;
        if (niche) {
            actionStr += ` in a ${niche} environment.`;
        } else {
            actionStr += `.`;
        }
        promptParts.push(actionStr);

        // 3. Technical Finishers
        let techFinishers = [];
        if (lens) techFinishers.push(`Shot on ${lens}`);
        if (speed) techFinishers.push(speed);

        // Add robust rendering tags usually needed for Veo/Kling
        techFinishers.push('photorealistic, 8k resolution, cinematic lighting, ultra-detailed');

        promptParts.push(techFinishers.join(', ') + '.');

        const finalPrompt = promptParts.join(' ');


        // Update UI
        emptyState.classList.add('hidden');
        promptOutput.classList.remove('hidden');

        if (currentMode === 'advanced' && this.negativePromptValue) {
            promptOutput.value = finalPrompt + `\n\n[NEGATIVE PROMPT]: ${this.negativePromptValue}`;
        } else {
            promptOutput.value = finalPrompt;
        }
        copyBtn.disabled = false;

        // Auto-resize
        promptOutput.style.height = 'auto';
        promptOutput.style.height = promptOutput.scrollHeight + 'px';
    }

    // copy to clipboard
    function copyPrompt() {
        if (!promptOutput.value) return;

        navigator.clipboard.writeText(promptOutput.value).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="ph ph-check"></i> Copiado!';
            copyBtn.classList.add('btn-success');

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('btn-success');
            }, 2000);
        });
    }

    // clear the form
    function clearForm() {
        form.reset();
        emptyState.classList.remove('hidden');
        promptOutput.classList.add('hidden');
        promptOutput.value = '';
        copyBtn.disabled = true;
    }

    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyPrompt);
    clearBtn.addEventListener('click', clearForm);

    // Auto-resize textarea on input
    promptOutput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});
