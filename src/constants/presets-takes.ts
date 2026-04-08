import { Film, User, Camera, Sun, Mic } from "lucide-react"

export const TAKES_STYLES = [
  { id: "vlog", label: "Vlog Style", description: "Casual, handheld smartphone feel, talking directly to camera" },
  { id: "cinematic", label: "Cinematic", description: "High-end movie look, shallow depth of field, dramatic lighting" },
  { id: "ugc", label: "UGC (User Generated)", description: "Raw, authentic, TikTok/Reels aesthetic" },
  { id: "pov", label: "Estilo POV", description: "First-person perspective, viewing through the character's eyes" },
  { id: "documentary", label: "Documentary", description: "Realistic, objective angle, natural colors" },
  { id: "commercial", label: "Studio Commercial", description: "Perfect lighting, clean background, ultra-sharp" }
]

export const TAKES_RATIOS = [
  { id: "HORIZONTAL", label: "Desktop/YouTube (16:9)", value: "--ar 16:9" },
  { id: "VERTICAL", label: "Mobile/Reels (9:16)", value: "--ar 9:16" },
]

export const TAKES_SETTINGS = [
  { id: "soft-natural", label: "Luz Natural Suave (Soft natural light)" },
  { id: "golden-hour", label: "Pôr do Sol (Golden hour glow)" },
  { id: "bright-sun", label: "Luz do Sol Direta (Bright sunny day)" },
  { id: "studio", label: "Luz de Estúdio (Professional studio lighting)" },
  { id: "dark-cinematic", label: "Noturno Cinematográfico (Dark cinematic mood)" },
]

export const TAKES_ACTIONS = [
  { id: "talking-vlog", label: "Falando tipo Vlog (Talking directly to camera like a vlog)" },
  { id: "demonstrating", label: "Demonstrando Serviço (Working and demonstrating the service)" },
  { id: "walking", label: "Caminhando e Falando (Walking towards the camera while talking)" },
  { id: "pointing", label: "Apontando (Pointing at the background while explaining)" },
  { id: "before-after", label: "Mostrando Antes/Depois (Showing a before and after transition)" },
]

export const TAKES_SOUNDS = [
  { id: "light-yard", label: "Quintal/Vizinhança (Light yard background sounds)" },
  { id: "construction", label: "Ferramentas/Obra (Subtle construction working sounds)" },
  { id: "indoor-quiet", label: "Interior Silencioso (Quiet indoor room tone)" },
  { id: "street-city", label: "Rua/Cidade (Subtle city street ambient noise)" },
  { id: "nature", label: "Natureza (Birds chirping, natural wind)" },
]

export const TAKES_NICHES = [
  { id: "construction", label: "Construction / Remodeling", group: "Exterior" },
  { id: "roofing", label: "Roofing", group: "Exterior" },
  { id: "painting", label: "Painting", group: "Exterior" },
  { id: "hvac", label: "HVAC", group: "Interior" },
  { id: "plumbing", label: "Plumbing", group: "Interior" },
  { id: "electrical", label: "Electrical", group: "Interior" },
  { id: "cleaning", label: "Cleaning / Maid Services", group: "Interior" },
  { id: "landscaping", label: "Landscaping", group: "Exterior" },
  { id: "flooring", label: "Flooring (Geral)", group: "Interior" }
]
