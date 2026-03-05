// script-ba.js - Lógica exclusiva para o Gerador Antes e Depois

document.addEventListener('DOMContentLoaded', () => {

    // ── TS Explore DOCS Map ──────────────────────────────────────────────────
    const BASE_DOCS = 'docs/nichos';
    // Maps the niche-select values to local doc pages
    const baDocsMap = {
        'Construction': `${BASE_DOCS}/construction.html`,
        'Kitchen Remodel': `${BASE_DOCS}/remodeling.html`,
        'Bathroom Remodel': `${BASE_DOCS}/remodeling.html`,
        'Basement Finishing': `${BASE_DOCS}/remodeling.html`,
        'Home Addition': `${BASE_DOCS}/additions.html`,
        'House Painting': `${BASE_DOCS}/painting.html`,
        'Roof Repair': `${BASE_DOCS}/roofing.html`,
        'Siding Installation': `${BASE_DOCS}/siding.html`,
        'Countertop Installation': `${BASE_DOCS}/countertops.html`,
        'Hardwood Flooring': `${BASE_DOCS}/hardwood-flooring.html`,
        'LVP Installation': `${BASE_DOCS}/luxury-vinyl-plank.html`,
        'Epoxy Flooring': `${BASE_DOCS}/epoxy-flooring.html`,
        'Floor Sanding & Refinishing': `${BASE_DOCS}/sand-and-refinish.html`,
        'Landscaping & Lawn Care': `${BASE_DOCS}/landscaping.html`,
        'Power Washing': `${BASE_DOCS}/cleaning.html`,
        'House Cleaning': `${BASE_DOCS}/cleaning.html`,
        'Auto Detailing': 'docs/nichos.html',
    };

    const baDocsLabels = {
        'Construction': 'Construction',
        'Kitchen Remodel': 'Remodeling',
        'Bathroom Remodel': 'Remodeling',
        'Basement Finishing': 'Remodeling',
        'Home Addition': 'Additions',
        'House Painting': 'Painting',
        'Roof Repair': 'Roofing',
        'Siding Installation': 'Siding',
        'Countertop Installation': 'Countertops',
        'Hardwood Flooring': 'Hardwood',
        'LVP Installation': 'LVP',
        'Epoxy Flooring': 'Epoxy',
        'Floor Sanding & Refinishing': 'Sand & Refinish',
        'Landscaping & Lawn Care': 'Landscaping',
        'Power Washing': 'Cleaning',
        'House Cleaning': 'Cleaning',
    };

    const docsBtn = document.getElementById('docs-btn');
    const nicheLabelEl = document.getElementById('docs-niche-label');

    function updateDocsLink(nicheValue) {
        if (!docsBtn) return;
        const url = baDocsMap[nicheValue] || `${BASE_EXPLORE}/home/`;
        docsBtn.href = url;
        if (nicheLabelEl) {
            const label = baDocsLabels[nicheValue];
            nicheLabelEl.textContent = label ? ` · ${label}` : '';
        }
    }

    updateDocsLink('House Cleaning'); // default value

    const nicheSelectEl = document.getElementById('niche-select');
    if (nicheSelectEl) {
        nicheSelectEl.addEventListener('change', () => {
            updateDocsLink(nicheSelectEl.value);
        });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Buttons
    const generateBtn = document.getElementById('generate-ba-btn');
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
    const form = document.getElementById('ba-form');

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
    const otherToggles = ['niche-select', 'focus-select', 'state_before_select', 'state_after_select', 'style'];

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
        let niche, focus, stateBefore, stateAfter;
        const style = document.getElementById('style').value === 'other' ? document.getElementById('style-other').value : document.getElementById('style').value;

        if (currentMode === 'simple') {
            niche = document.getElementById('niche-select').value === 'other' ? document.getElementById('niche-select-other').value : document.getElementById('niche-select').value;
            focus = document.getElementById('focus-select').value === 'other' ? document.getElementById('focus-select-other').value : document.getElementById('focus-select').value;
            stateBefore = document.getElementById('state_before_select').value === 'other' ? document.getElementById('state_before_select-other').value : document.getElementById('state_before_select').value;
            stateAfter = document.getElementById('state_after_select').value === 'other' ? document.getElementById('state_after_select-other').value : document.getElementById('state_after_select').value;
        } else {
            niche = document.getElementById('niche').value.trim();
            focus = document.getElementById('focus').value.trim();
            stateBefore = document.getElementById('state_before').value.trim();
            stateAfter = document.getElementById('state_after').value.trim();

            if (!niche || !focus || !stateBefore || !stateAfter) {
                alert("Por favor, preencha todos os campos do modo avançado.");
                return;
            }
            this.negativePromptAdv = document.getElementById('negative-adv').value.trim();
        }

        // --- THE MAGIC FORMULA (BEFORE & AFTER SPLIT SCREEN) ---
        let finalPrompt = `A side-by-side split-screen comparison photograph. On the left side, the 'Before': ${stateBefore} ${focus} in a ${niche} context. On the right side, the 'After': ${stateAfter} ${focus}. Both sides feature realistic lighting, ${style}. Clean professional aesthetics, highly detailed. NO TEXT, NO LETTERS, NO WORDS in the image.`;

        if (currentMode === 'advanced' && this.negativePromptAdv) {
            finalPrompt += `\n\n[NEGATIVE PROMPT]: ${this.negativePromptAdv}`;
        }


        // Update UI
        emptyState.classList.add('hidden');
        promptOutput.classList.remove('hidden');

        promptOutput.value = finalPrompt;
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
