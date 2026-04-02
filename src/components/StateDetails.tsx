"use client"

import React from "react"
import { Calendar, CloudSun, PartyPopper, Hammer, AlertTriangle, CheckCircle2 } from "lucide-react"
import { StateMarketingData } from "@/data/us-states-data"
import { cn } from "@/lib/utils"

interface StateDetailsProps {
  data: StateMarketingData
}

const StateDetails: React.FC<StateDetailsProps> = ({ data }) => {
  return (
    <div className="w-full space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-700">
      
      {/* Header Area - Extreme Impact */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
            Estratégia Regional
          </span>
          {data.isPlaceholder && (
            <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] border border-zinc-800">
              Aguardando Dados
            </span>
          )}
        </div>
        
        <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          {data.name} <span className="text-primary/30">.</span>
        </h2>
        
        <p className="text-zinc-500 text-lg font-bold uppercase tracking-widest max-w-xl mx-auto italic opacity-60">
          Dados perenes e recorrentes para alta performance de anúncios e social media.
        </p>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Feriados & Eventos (Unified for better impact) */}
        <div className="p-10 bg-zinc-900/20 rounded-[40px] border border-zinc-800/50 hover:border-primary/30 transition-all duration-500 group">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-14 rounded-2xl bg-zinc-800 group-hover:bg-primary/20 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-all duration-500 border border-zinc-700 group-hover:border-primary/30">
              <Calendar size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Calendário Oficial</h3>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest tracking-[0.2em]">Feriados & Tradições</p>
            </div>
          </div>
          
          <ul className="space-y-6">
            {[...data.holidays, ...data.culturalEvents].length > 0 ? (
              [...data.holidays, ...data.culturalEvents].map((item, i) => (
                <li key={i} className="flex gap-4 group/item">
                  <div className="size-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0 group-hover/item:scale-150 transition-transform duration-300" />
                  <p className="text-sm text-zinc-400 font-bold uppercase italic leading-relaxed group-hover/item:text-white transition-colors">
                    {item}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-zinc-700 italic font-bold uppercase text-xs">Dados em fase de catalogação...</p>
            )}
          </ul>
        </div>

        {/* Clima & Janela de Obras */}
        <div className="flex flex-col gap-8">
           
           {/* Section: Climate */}
           <div className="p-8 bg-zinc-900/20 rounded-[40px] border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-zinc-800 group-hover:bg-blue-500/20 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-all duration-500 border border-zinc-700 group-hover:border-blue-500/30">
                  <CloudSun size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Sazonalidade Climática</h3>
              </div>
              <ul className="space-y-4">
                {data.climateSeasons.map((s, i) => (
                  <li key={i} className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic">{s}</li>
                ))}
              </ul>
           </div>

           {/* Section: Work Window */}
           <div className="p-8 bg-primary/5 rounded-[40px] border border-primary/20 hover:bg-primary/10 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 text-primary/5 group-hover:text-primary/10 transition-colors rotate-12">
                 <Hammer size={120} />
              </div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Janela de Obras</h3>
              </div>
              <p className="text-sm text-zinc-300 font-black italic uppercase leading-relaxed relative z-10 pr-10">
                {data.workWindow}
              </p>
           </div>
        </div>

      </div>

      {/* Warning Footer */}
      <div className="max-w-6xl mx-auto pt-16 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-zinc-900/10 rounded-[50px] border border-zinc-800/30">
              <div className="flex items-center gap-6">
                <AlertTriangle size={48} className="text-orange-600/40" />
                <div>
                   <h4 className="text-lg font-black text-orange-600 uppercase tracking-tighter mb-1 leading-none italic">Aviso de Segurança Social Media</h4>
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Sempre confirme as datas variáveis e anúncios</p>
                </div>
              </div>
              <p className="max-w-md text-right text-xs text-zinc-700 font-black uppercase leading-relaxed italic opacity-50">
                Informações anuais e recorrências naturais/culturais permanentes. O uso para tráfego pago deve ser validado mensalmente.
              </p>
          </div>
      </div>

    </div>
  )
}

export default StateDetails
