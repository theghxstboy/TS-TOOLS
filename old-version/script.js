document.addEventListener('DOMContentLoaded', () => {

    // ── TS Explore DOCS Map ──────────────────────────────────────────────────
    const BASE_DOCS = 'docs/nichos';
    const nicheDocsMap = {
        'painting': `${BASE_DOCS}/painting.html`,
        'construction': `${BASE_DOCS}/construction.html`,
        'cleaning': `${BASE_DOCS}/cleaning.html`,
        'flooring': `${BASE_DOCS}/flooring.html`,
        'landscaping': `${BASE_DOCS}/landscaping.html`,
        'roofing': `${BASE_DOCS}/roofing.html`,
        'remodeling': `${BASE_DOCS}/remodeling.html`,
        'carpentry': `${BASE_DOCS}/carpentry.html`,
        'framing': `${BASE_DOCS}/framing.html`,
        'additions': `${BASE_DOCS}/additions.html`,
        'siding': `${BASE_DOCS}/siding.html`,
        'insulation': `${BASE_DOCS}/insulation.html`,
        'countertops': `${BASE_DOCS}/countertops.html`,
        'hardwood-flooring': `${BASE_DOCS}/hardwood-flooring.html`,
        'luxury-vinyl-plank': `${BASE_DOCS}/luxury-vinyl-plank.html`,
        'epoxy-flooring': `${BASE_DOCS}/epoxy-flooring.html`,
        'sand-and-refinish': `${BASE_DOCS}/sand-and-refinish.html`,
        'hvac': 'docs/nichos.html',
        'plumbing': 'docs/nichos.html',
        'electrical': 'docs/nichos.html',
        'other': 'docs/nichos.html',
        '': 'docs/nichos.html',
    };

    const docsBtn = document.getElementById('docs-btn');
    const nicheLabelEl = document.getElementById('docs-niche-label');

    const nicheLabels = {
        'painting': 'Painting',
        'construction': 'Construction',
        'cleaning': 'Cleaning',
        'flooring': 'Flooring',
        'landscaping': 'Landscaping',
        'roofing': 'Roofing',
        'remodeling': 'Remodeling',
        'carpentry': 'Carpentry',
        'framing': 'Framing',
        'additions': 'Additions',
        'siding': 'Siding',
        'insulation': 'Insulation',
        'countertops': 'Countertops',
        'hardwood-flooring': 'Hardwood',
        'luxury-vinyl-plank': 'LVP',
        'epoxy-flooring': 'Epoxy',
        'sand-and-refinish': 'Sand & Refinish',
        'hvac': 'HVAC',
        'plumbing': 'Plumbing',
        'electrical': 'Electrical',
    };

    function updateDocsLink(nicheValue) {
        if (!docsBtn) return;
        const url = nicheDocsMap[nicheValue] || `${BASE_EXPLORE}/home/`;
        docsBtn.href = url;
        if (nicheLabelEl) {
            const label = nicheLabels[nicheValue];
            nicheLabelEl.textContent = label ? ` · ${label}` : '';
        }
    }

    // Init with default (no niche selected)
    updateDocsLink('');

    // Watch niche select for changes
    const nicheSelect = document.getElementById('niche');
    if (nicheSelect) {
        nicheSelect.addEventListener('change', () => {
            updateDocsLink(nicheSelect.value);
        });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Buttons
    const btnGenerate = document.getElementById('generate-btn');
    const btnClear = document.getElementById('clear-btn');
    const btnCopy = document.getElementById('copy-btn');

    // Mode Toggles
    const simpleModeBtn = document.getElementById('simple-mode-btn');
    const advancedModeBtn = document.getElementById('advanced-mode-btn');
    const simpleFields = document.getElementById('simple-fields');
    const advancedFields = document.getElementById('advanced-fields');

    // Output areas
    const outputArea = document.getElementById('prompt-output');
    const emptyState = document.getElementById('empty-state');
    const form = document.getElementById('prompt-form');

    let currentMode = 'simple';

    // Mode Toggle Listeners
    simpleModeBtn.addEventListener('click', () => {
        currentMode = 'simple';
        simpleModeBtn.classList.add('active');
        advancedModeBtn.classList.remove('active');
        simpleFields.style.display = 'grid';
        advancedFields.classList.add('hidden-mode');
    });

    advancedModeBtn.addEventListener('click', () => {
        currentMode = 'advanced';
        advancedModeBtn.classList.add('active');
        simpleModeBtn.classList.remove('active');
        advancedFields.classList.remove('hidden-mode');
        simpleFields.style.display = 'none';
    });

    // Handle "Other" inputs visibility
    const otherToggles = ['niche', 'style', 'environment', 'lighting', 'location', 'objective'];

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

    // Niche details (to add extra context based on user selection)
    const nicheContexts = {
        'painting': 'professional house painter, wearing uniform, applying flawless paint, fine interior painting',
        'construction': 'professional construction worker, wearing hard hat and safety vest, construction equipment',
        'cleaning': 'professional residential cleaner, wearing uniform, spotless clean room, cleaning supplies',
        'flooring': 'professional flooring installer, laying down premium hardwood flooring, meticulous craftsmanship',
        'landscaping': 'professional landscaper, manicured lawn, beautiful garden design, landscaping equipment',
        'hvac': 'professional HVAC technician, inspecting AC unit, well-lit utility room, modern equipment',
        'plumbing': 'professional plumber, fixing modern plumbing fixtures, clean under-sink area, high quality work',
        'electrical': 'professional electrician, working on electrical panel, safety gear, bright lighting',
        'roofing': 'professional roofer, working on residential roof, safety harness, clear sky'
    };

    const nicheNohumanContexts = {
        'painting': 'freshly painted walls, professional paint finish, painting tools arranged neatly',
        'construction': 'completed construction work, structural details, building materials',
        'cleaning': 'immaculate sparkling room, organized space, cleaning equipment on the side',
        'flooring': 'premium hardwood floor installation, flawless wood grain, carpentry details',
        'landscaping': 'manicured lawn, beautiful garden design, landscaping work',
        'hvac': 'modern HVAC unit installation, piping and electrical details',
        'plumbing': 'installed plumbing fixtures, clean sink area, modern chrome finish',
        'electrical': 'neatly wired electrical panel, modern switches, professional installation',
        'roofing': 'newly installed roof shingles, clean rooflines, clear sky background'
    };

    const styleModifiers = {
        'photorealistic': 'hyper detailed, photorealistic, 8k resolution, highly detailed photography',
        'cinematic': 'cinematic shot, cinematic lighting, movie still, 35mm lens, highly detailed',
        'commercial': 'commercial photography, magazine cover, ultra polished, professional ad campaign',
        'iphone-photo': 'shot on iPhone 15 Pro Max, casual social media photo, unedited, spontaneous, realistic day in the life',
        'drone-view': 'drone aerial view, birds eye view, wide landscape, dji mavic 3 pro',
        'minimalist': 'minimalist composition, clean lines, negative space, simple color palette, modern aesthetic',
        '3d-render': 'unreal engine 5 render, highly detailed 3D artwork, octane render, architectural visualization'
    };

    const envModifiers = {
        'residential': 'in a beautiful modern residential home, cleanly decorated, natural colors',
        'commercial-building': 'in a modern commercial office building, corporate environment',
        'luxury-home': 'in a high-end luxury estate, expensive furniture, large windows',
        'suburban-neighborhood': 'in a classic American suburban neighborhood, pleasant weather',
        'construction-site': 'active commercial construction site in the background, organized and safe',
        'outdoor': 'outdoors, exterior view, bright daylight, clear sky, street view',
        'modern-office': 'in a bright modern office with glass walls and contemporary furniture',
        'warehouse': 'inside a large organized industrial warehouse with high ceilings'
    };

    const objectiveModifiers = {
        'product': 'commercial product photography, high-quality lens, focus on tools and materials, sharp details',
        'no-people': 'clean environment, showcase of completed work, empty of people, wide shot',
        'service': 'action-oriented shot, showing the professional service being performed with care and expertise'
    };

    const locationModifiers = {
        'florida': 'Florida style',
        'new-england': 'New England style',
        'california': 'California style',
        'texas': 'Texas style',
        'midwest': 'American Midwest style'
    };

    const lightModifiers = {
        'natural-daylight': 'bright natural daylight, sunlit room, soft shadows',
        'golden-hour': 'golden hour lighting, warm sunset light, beautiful glowing atmosphere',
        'bright-sunny': 'bright sunny day, clear blue sky, vivid colors',
        'studio-lighting': 'professional studio lighting, rim light, softbox lighting, perfect exposure',
        'overcast': 'overcast lighting, soft diffused light, moody atmosphere'
    };

    function generatePrompt() {
        let promptParts = [];
        const subject = document.getElementById('subject').value.trim();

        if (currentMode === 'simple') {
            const lighting = document.getElementById('lighting').value === 'other' ? document.getElementById('lighting-other').value : document.getElementById('lighting').value;
            const objective = document.getElementById('objective').value === 'other' ? document.getElementById('objective-other').value : document.getElementById('objective').value;
            const location = document.getElementById('location').value === 'other' ? document.getElementById('location-other').value : document.getElementById('location').value;

            // 1. Subject & Niche Context
            let baseSubject = '';
            const finalNiche = document.getElementById('niche').value === 'other' ? document.getElementById('niche-other').value : document.getElementById('niche').value;
            const finalStyle = document.getElementById('style').value === 'other' ? document.getElementById('style-other').value : document.getElementById('style').value;
            const finalEnvironment = document.getElementById('environment').value === 'other' ? document.getElementById('environment-other').value : document.getElementById('environment').value;

            if (objective === 'no-people' || objective === 'product') {
                if (subject) {
                    baseSubject = subject.replace(/painter|worker|technician|cleaner|pro|professional|person|man|woman|people|personne/gi, 'detail');
                } else if (finalNiche && nicheNohumanContexts[finalNiche]) {
                    baseSubject = nicheNohumanContexts[finalNiche];
                } else if (finalNiche) {
                    baseSubject = `A detail of ${finalNiche} work`;
                } else {
                    baseSubject = 'A high quality home service work detail';
                }
            } else {
                if (subject) {
                    baseSubject = subject;
                    if (finalNiche && nicheContexts[finalNiche]) baseSubject += `, ${nicheContexts[finalNiche]}`;
                    else if (finalNiche) baseSubject += `, professional ${finalNiche}`;
                } else if (finalNiche && nicheContexts[finalNiche]) {
                    baseSubject = nicheContexts[finalNiche];
                } else if (finalNiche) {
                    baseSubject = `A professional ${finalNiche}`;
                } else {
                    baseSubject = 'A professional home service scene';
                }
            }
            promptParts.push(baseSubject);

            // 2-6. Modifiers
            if (objective && objectiveModifiers[objective]) promptParts.push(objectiveModifiers[objective]);
            else if (objective && objective !== 'other') promptParts.push(objective);

            if (location && locationModifiers[location]) promptParts.push(locationModifiers[location]);
            else if (location && location !== 'other') promptParts.push(location);

            if (finalEnvironment && envModifiers[finalEnvironment]) promptParts.push(envModifiers[finalEnvironment]);
            else if (finalEnvironment) promptParts.push(finalEnvironment);

            if (lighting && lightModifiers[lighting]) promptParts.push(lightModifiers[lighting]);
            else if (lighting && lighting !== 'other') promptParts.push(lighting);

            if (finalStyle && styleModifiers[finalStyle]) promptParts.push(styleModifiers[finalStyle]);
            else if (finalStyle) promptParts.push(finalStyle);

        } else {
            // ADVANCED MODE
            const nicheAdv = document.getElementById('niche-adv').value.trim();
            const styleAdv = document.getElementById('style-adv').value.trim();
            const environmentAdv = document.getElementById('environment-adv').value.trim();
            const lightingAdv = document.getElementById('lighting-adv').value.trim();
            const locationAdv = document.getElementById('location-adv').value.trim();
            const objectiveAdv = document.getElementById('objective-adv').value.trim();
            const negativeAdv = document.getElementById('negative-adv').value.trim();

            if (subject) promptParts.push(subject);
            if (nicheAdv) promptParts.push(nicheAdv);
            if (objectiveAdv) promptParts.push(objectiveAdv);
            if (locationAdv) promptParts.push(locationAdv);
            if (environmentAdv) promptParts.push(environmentAdv);
            if (lightingAdv) promptParts.push(lightingAdv);
            if (styleAdv) promptParts.push(styleAdv);

            let finalPrompt = promptParts.join(', ') + '.';
            if (negativeAdv) {
                finalPrompt += `\n\n[NEGATIVE PROMPT]: ${negativeAdv}`;
            }
            return finalPrompt;
        }

        return promptParts.join(', ') + '.';
    }

    btnGenerate.addEventListener('click', () => {
        const generated = generatePrompt();
        emptyState.classList.add('hidden');
        outputArea.classList.remove('hidden');
        outputArea.value = generated;
        btnCopy.disabled = false;

        btnGenerate.innerHTML = '<i class="ph ph-check-circle"></i> Gerado com Sucesso!';
        setTimeout(() => {
            btnGenerate.innerHTML = '<i class="ph ph-sparkle"></i> Gerar Prompt';
        }, 2000);
    });

    btnClear.addEventListener('click', () => {
        form.reset();
        emptyState.classList.remove('hidden');
        outputArea.classList.add('hidden');
        outputArea.value = '';
        btnCopy.disabled = true;
    });

    btnCopy.addEventListener('click', async () => {
        const text = outputArea.value;
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            btnCopy.innerHTML = '<i class="ph ph-check"></i> Copiado!';
            setTimeout(() => {
                btnCopy.innerHTML = '<i class="ph ph-copy"></i> Copiar Prompt';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });
});

