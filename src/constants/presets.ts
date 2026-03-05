export interface PresetGerador {
    id: string;
    title: string;
    image: string;
    data: {
        niche: string;
        nicheOther?: string;
        style: string;
        environment: string;
        lighting: string;
        location: string;
        objective: string;
        subject: string;
    };
}

export interface PresetAntesDepois {
    id: string;
    title: string;
    image: string;
    data: {
        niche: string;
        nicheOther?: string;
        focus: string;
        stateBefore: string;
        stateAfter: string;
        style: string;
    };
}

export interface PresetVideo {
    id: string;
    title: string;
    image: string;
    data: {
        niche: string;
        nicheOther?: string;
        motion: string;
        angle: string;
        lens: string;
        speed: string;
        action: string;
    };
}

// ============================================
// 1. PRESETS: GERADOR PADRÃO (IMAGENS)
// ============================================
export const PRESETS_GERADOR: PresetGerador[] = [
    {
        id: "construction", title: "Construction", image: "/presets/construction.jpeg",
        data: { niche: "construction", style: "photorealistic", environment: "construction-site", lighting: "bright-sunny", location: "florida", objective: "service", subject: "A construction worker wearing a yellow hard hat and safety vest, reviewing blueprints on a bustling commercial construction site." }
    },
    {
        id: "remodeling", title: "Remodeling", image: "/presets/remodeling.jpeg",
        data: { niche: "remodeling", style: "commercial", environment: "residential", lighting: "natural-daylight", location: "california", objective: "service", subject: "A professional contractor installing modern kitchen cabinets, bright and clean indoor environment." }
    },
    {
        id: "carpentry", title: "Carpentry", image: "/presets/carpentry.jpeg",
        data: { niche: "carpentry", style: "photorealistic", environment: "residential", lighting: "studio-lighting", location: "new-england", objective: "product", subject: "Close up of highly detailed custom wood trim and pristine carpentry work, raw wood textures." }
    },
    {
        id: "framing", title: "Framing", image: "/presets/framing.jpeg",
        data: { niche: "framing", style: "drone-view", environment: "construction-site", lighting: "golden-hour", location: "texas", objective: "no-people", subject: "Wooden framing of a new residential house under construction, cinematic sunset lighting illuminating the wooden studs." }
    },
    {
        id: "additions", title: "Additions", image: "/presets/additions.jpeg",
        data: { niche: "additions", style: "photorealistic", environment: "residential", lighting: "natural-daylight", location: "midwest", objective: "no-people", subject: "A newly built sunroom addition attached to a classic suburban brick house, perfectly blending with the original architecture." }
    },
    {
        id: "painting", title: "Painting", image: "/presets/painting.jpeg",
        data: { niche: "painting", style: "commercial", environment: "residential", lighting: "natural-daylight", location: "florida", objective: "service", subject: "A professional house painter in white uniform carefully rolling fresh white paint onto a living room wall, clean edges." }
    },
    {
        id: "roofing", title: "Roofing", image: "/presets/roofing.jpeg",
        data: { niche: "roofing", style: "drone-view", environment: "outdoor", lighting: "bright-sunny", location: "florida", objective: "service", subject: "Professional roofers installing new dark grey architectural shingles on a suburban house roof, clear blue sky." }
    },
    {
        id: "siding", title: "Siding", image: "/presets/siding.jpeg",
        data: { niche: "siding", style: "photorealistic", environment: "outdoor", lighting: "golden-hour", location: "new-england", objective: "no-people", subject: "Flawless newly installed premium vinyl siding on a beautiful suburban home exterior, warm sunset lighting." }
    },
    {
        id: "insulation", title: "Insulation", image: "/presets/insulation.jpeg",
        data: { niche: "insulation", style: "photorealistic", environment: "residential", lighting: "studio-lighting", location: "midwest", objective: "service", subject: "A worker in protective gear expertly spraying pink foam insulation inside the attic walls of a house." }
    },
    {
        id: "countertops", title: "Countertops", image: "/presets/countertops.jpeg",
        data: { niche: "countertops", style: "commercial", environment: "luxury-home", lighting: "natural-daylight", location: "california", objective: "product", subject: "Close-up macro shot of a pristine white quartz kitchen countertop with subtle grey veining, flawless finish, modern faucet in background." }
    },
    {
        id: "laminate", title: "Laminate", image: "/presets/laminate.jpeg",
        data: { niche: "laminate-flooring", style: "photorealistic", environment: "residential", lighting: "natural-daylight", location: "texas", objective: "service", subject: "A contractor installing light oak laminate flooring in a modern living room, focusing on the interlocking planks." }
    },
    {
        id: "hardwood", title: "Hardwood", image: "/presets/hardwood.jpeg",
        data: { niche: "hardwood-flooring", style: "commercial", environment: "luxury-home", lighting: "bright-sunny", location: "new-england", objective: "no-people", subject: "Wide shot of an empty luxury living room featuring newly installed premium solid oak hardwood floors shining in the sunlight." }
    },
    {
        id: "lvp", title: "LVP", image: "/presets/lvp.jpeg",
        data: { niche: "luxury-vinyl-plank", style: "photorealistic", environment: "residential", lighting: "natural-daylight", location: "florida", objective: "service", subject: "Contractor precisely snapping luxury vinyl plank (LVP) flooring pieces together in a modern home." }
    },
    {
        id: "epoxy", title: "Epoxy", image: "/presets/epoxy.jpeg",
        data: { niche: "epoxy-flooring", style: "commercial", environment: "warehouse", lighting: "studio-lighting", location: "texas", objective: "product", subject: "High gloss metallic epoxy garage floor coating, reflective marble-like finish in dark grey and blue tones." }
    },
    {
        id: "sand-refinish", title: "Refinish", image: "/presets/refinishing.jpeg",
        data: { niche: "sand-and-refinish", style: "photorealistic", environment: "residential", lighting: "natural-daylight", location: "new-england", objective: "service", subject: "A professional operating a heavy-duty floor sander on old hardwood floors, creating a smooth raw wood surface." }
    },
    {
        id: "landscaping", title: "Landscaping", image: "/presets/landscaping.jpeg",
        data: { niche: "landscaping", style: "commercial", environment: "outdoor", lighting: "bright-sunny", location: "california", objective: "service", subject: "Landscape crew mowing and trimming a perfectly manicured bright green lawn in front of a luxury estate." }
    },
    {
        id: "cleaning", title: "Cleaning", image: "/presets/cleaning.jpeg",
        data: { niche: "cleaning", style: "iphone-photo", environment: "residential", lighting: "natural-daylight", location: "florida", objective: "service", subject: "A maid in a neat uniform wiping down a sparkling clean kitchen island, casual and authentic." }
    },
    {
        id: "hvac", title: "HVAC", image: "/presets/hvac.jpeg",
        data: { niche: "hvac", style: "photorealistic", environment: "outdoor", lighting: "bright-sunny", location: "texas", objective: "service", subject: "An HVAC technician holding a digital gauge meter while inspecting a modern outdoor AC condenser unit." }
    },
    {
        id: "plumbing", title: "Plumbing", image: "/presets/plumbing.jpeg",
        data: { niche: "plumbing", style: "photorealistic", environment: "residential", lighting: "studio-lighting", location: "midwest", objective: "service", subject: "A licensed plumber using a wrench to tighten pipes under a clean modern bathroom sink." }
    },
    {
        id: "electrical", title: "Electrical", image: "/presets/electrical.jpeg",
        data: { niche: "electrical", style: "photorealistic", environment: "residential", lighting: "studio-lighting", location: "california", objective: "service", subject: "An electrician in safety gear working on a complex residential electrical breaker panel, brightly lit." }
    }
];

// ============================================
// 2. PRESETS: ANTES E DEPOIS
// ============================================
export const PRESETS_ANTES_DEPOIS: PresetAntesDepois[] = [
    {
        id: "painting", title: "House Painting", image: "/presets/ad-painting.jpeg",
        data: { niche: "House Painting", focus: "the main surface", stateBefore: "old, outdated and peeling", stateAfter: "modern, fresh and beautiful", style: "photorealistic, highly detailed, captured with DSLR camera" }
    },
    {
        id: "roofing", title: "Roof Repair", image: "/presets/ad-roofing.jpeg",
        data: { niche: "Roof Repair", focus: "the entire scene", stateBefore: "broken, damaged and worn out", stateAfter: "fully repaired, professional finish", style: "photorealistic, highly detailed, captured with DSLR camera" }
    },
    {
        id: "hardwood", title: "Wood Floors", image: "/presets/ad-hardwood.jpeg",
        data: { niche: "Floor Sanding & Refinishing", focus: "the main surface", stateBefore: "extremely dirty, covered in grime and stains", stateAfter: "spotless, shining like new and pristine", style: "commercial bright lighting, studio quality, sharp focus" }
    },
    {
        id: "powerwashing", title: "Power Washing", image: "/presets/ad-powerwashing.jpeg",
        data: { niche: "Power Washing", focus: "the main surface", stateBefore: "extremely dirty, covered in grime and stains", stateAfter: "spotless, shining like new and pristine", style: "raw street photography style, high contrast, iphone photo" }
    },
    {
        id: "cleaning", title: "House Cleaning", image: "/presets/ad-cleaning.jpeg",
        data: { niche: "House Cleaning", focus: "the entire scene", stateBefore: "overgrown with weeds and mess", stateAfter: "perfectly manicured and organized", style: "photorealistic, highly detailed, captured with DSLR camera" }
    },
    {
        id: "landscaping", title: "Landscaping", image: "/presets/ad-landscaping.jpeg",
        data: { niche: "Landscaping & Lawn Care", focus: "the entire scene", stateBefore: "overgrown with weeds and mess", stateAfter: "perfectly manicured and organized", style: "photorealistic, highly detailed, captured with DSLR camera" }
    },
    {
        id: "remodel", title: "Kitchen Remodel", image: "/presets/ad-kitchen.jpeg",
        data: { niche: "Kitchen Remodel", focus: "the workspace", stateBefore: "old, outdated and peeling", stateAfter: "modern, fresh and beautiful", style: "commercial bright lighting, studio quality, sharp focus" }
    },
    {
        id: "epoxy", title: "Garage Epoxy", image: "/presets/ad-epoxy.jpeg",
        data: { niche: "Epoxy Flooring", focus: "the main surface", stateBefore: "extremely dirty, covered in grime and stains", stateAfter: "polished, smooth and clean", style: "commercial bright lighting, studio quality, sharp focus" }
    }
];

// ============================================
// 3. PRESETS: GERADOR DE VÍDEO
// ============================================
export const PRESETS_VIDEO: PresetVideo[] = [
    {
        id: "drone-roof", title: "Drone Roof Inspect", image: "/presets/vid-roof.jpeg",
        data: { niche: "outdoor residential", motion: "Smooth Drone Tracking", angle: "High Angle", lens: "Cinematic 35mm lens, beautiful shallow depth of field, sharp focus", speed: "Real-time default speed", action: "drone flying smoothly over a newly installed dark architectural shingle roof on a large suburban home." }
    },
    {
        id: "epoxy-pour", title: "Epoxy Pour", image: "/presets/vid-epoxy.jpeg",
        data: { niche: "garage workshop", motion: "Slow Dolly Push-in", angle: "Eye-level Angle", lens: "Cinematic 35mm lens, beautiful shallow depth of field, sharp focus", speed: "Cinematic 120fps Slow Motion, smooth", action: "worker pouring thick metallic blue epoxy resin onto a concrete garage floor and spreading it, beautiful reflections." }
    },
    {
        id: "painting-roll", title: "Paint Rolling", image: "/presets/vid-paint.jpeg",
        data: { niche: "residential interior", motion: "Handheld Documentary Style", angle: "Eye-level Angle", lens: "iPhone 15 Pro Max footage, casual style", speed: "Real-time default speed", action: "professional painter sliding a paint roller with fresh white paint over a textured living room wall." }
    },
    {
        id: "power-wash", title: "Power Washing", image: "/presets/vid-powerwash.jpeg",
        data: { niche: "outdoor residential", motion: "Static Tripod Shot", angle: "Eye-level Angle", lens: "GoPro action camera, ultra-wide angle", speed: "Real-time default speed", action: "cleaning a dirty driveway with a high pressure power washer, blasting away dark dirt to reveal white concrete." }
    },
    {
        id: "kitchen-pan", title: "Kitchen Reveal", image: "/presets/vid-kitchen.jpeg",
        data: { niche: "residential interior", motion: "Slow Pan Right", angle: "Eye-level Angle", lens: "Cinematic 35mm lens, beautiful shallow depth of field, sharp focus", speed: "Real-time default speed", action: "revealing a stunning modern luxury kitchen with white quartz countertops, stainless steel appliances, and gold fixtures." }
    },
    {
        id: "landscape-clip", title: "Lawn Mowing", image: "/presets/vid-lawn.jpeg",
        data: { niche: "outdoor residential", motion: "Slow Dolly Push-in", angle: "Low Angle", lens: "Cinematic 35mm lens, beautiful shallow depth of field, sharp focus", speed: "Real-time default speed", action: "professional landscaper pushing a lawnmower towards the camera on bright green grass, sunny day." }
    }
];
