"use client"

import React, { useMemo } from "react"
import { Calendar, CloudSun, Hammer, AlertTriangle, CheckCircle2, Wind, Snowflake, Sun, Zap, Star, ExternalLink, MapPin, PartyPopper, Home, Wrench, TreePine, Newspaper } from "lucide-react"
import { StateMarketingData } from "@/data/us-states-data"
import { cn } from "@/lib/utils"

interface StateDetailsProps {
  data: StateMarketingData
  news?: any[]
  loadingNews?: boolean
}

const StateDetails: React.FC<StateDetailsProps> = ({ data, news = [], loadingNews = false }) => {
  const currentYear = new Date().getFullYear()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const MONTHS_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
  const MONTHS_PT = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
  const currentMonthIndex = new Date().getMonth()

  // Sort culturalEvents chronologically and flag past/current/future
  const sortedEvents = useMemo(() => {
    return [...data.culturalEvents].sort((a, b) => {
      const getMonth = (item: string) => {
        const lower = item.toLowerCase()
        const idxEn = MONTHS_EN.findIndex(m => lower.includes(m))
        const idxPt = MONTHS_PT.findIndex(m => lower.includes(m))
        return idxEn >= 0 ? idxEn : idxPt >= 0 ? idxPt : 12
      }
      return getMonth(a) - getMonth(b)
    })
  }, [data.culturalEvents])

  // Parse workWindow into structured chips
  const workChips = useMemo(() => {
    if (!data.workWindow) return []
    return data.workWindow
      .split(/\.\s+/)
      .map(s => s.trim().replace(/\.$/, ""))
      .filter(Boolean)
      .map(sentence => {
        const lower = sentence.toLowerCase()
        const isExterior = lower.includes("extern") || lower.includes("telhado") || lower.includes("siding") || lower.includes("deck") || lower.includes("verão") || lower.includes("maio")
        const isInterior = lower.includes("intern") || lower.includes("cozinha") || lower.includes("banheiro") || lower.includes("reforma") || lower.includes("inverno") || lower.includes("novembro")
        const isAlert = lower.includes("evit") || lower.includes("risco") || lower.includes("dano") || lower.includes("limita") || lower.includes("demanda")
        return { text: sentence, isExterior, isInterior, isAlert }
      })
  }, [data.workWindow])

  const getClimateIcon = (text: string) => {
    const lower = text.toLowerCase()
    if (lower.includes("snow") || lower.includes("blizzard") || lower.includes("nevasca") || lower.includes("neve")) return <Snowflake size={14} />
    if (lower.includes("wind") || lower.includes("nor'easters") || lower.includes("ventos") || lower.includes("vento")) return <Wind size={14} />
    if (lower.includes("hurricane") || lower.includes("furacão") || lower.includes("furacoes") || lower.includes("tornado") || lower.includes("storm")) return <Zap size={14} />
    if (lower.includes("dry") || lower.includes("stable") || lower.includes("seca") || lower.includes("heat") || lower.includes("calor")) return <Sun size={14} />
    if (lower.includes("foliage") || lower.includes("tourism") || lower.includes("turismo")) return <Star size={14} />
    if (lower.includes("flood") || lower.includes("rain") || lower.includes("chuva") || lower.includes("enchente")) return <CloudSun size={14} />
    return <CloudSun size={14} />
  }

  return (
    <div className="w-full space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-700">
      
      {/* Header: Flag + State Name + Capital + Site */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
            Estratégia Regional
          </span>
        </div>

        {/* Flag */}
        <div className="flex justify-center">
          <div className="relative group w-28 h-16 md:w-40 md:h-24 rounded-xl overflow-hidden border-2 border-zinc-800/50 shadow-2xl hover:border-primary/30 transition-all duration-500">
            <img
              src={data.flagUrl}
              alt={`Bandeira de ${data.name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          </div>
        </div>

        <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          {data.name} <span className="text-primary/30">.</span>
        </h2>

        {/* Capital + Official Site */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-black uppercase tracking-widest">
            <MapPin size={12} className="text-primary/50" />
            <span>Capital: <span className="text-zinc-300">{data.capital}</span></span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-700" />
          <a
            href={data.officialSite}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors group/link"
          >
            <ExternalLink size={12} className="group-hover/link:text-primary transition-colors" />
            {data.officialSite.replace('https://', '')}
          </a>
        </div>

        {/* Major Cities */}
        {data.majorCities && data.majorCities.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700 mr-1">Principais cidades:</span>
            {data.majorCities.map((city, i) => (
              <a
                key={i}
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(city.replace(/ /g, '_'))}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-[9px] font-black uppercase tracking-wider text-zinc-500 hover:border-primary/40 hover:text-primary transition-all"
              >
                {city}
              </a>
            ))}
          </div>
        )}

        <p className="text-zinc-500 text-lg font-bold uppercase tracking-widest max-w-xl mx-auto italic opacity-60">
          Dados perenes e recorrentes para alta performance de anúncios e social media.
        </p>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* Eventos: Dynamic from date-holidays */}
        <div className="p-10 bg-zinc-900/20 rounded-[40px] border border-zinc-800/50 hover:border-primary/30 transition-all duration-500 group">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-14 rounded-2xl bg-zinc-800 group-hover:bg-primary/20 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-all duration-500 border border-zinc-700 group-hover:border-primary/30">
              <Calendar size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Eventos</h3>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{currentYear} • Feriados Oficiais</p>
            </div>
          </div>

          <ul className="space-y-5">
            {sortedEvents.length > 0 ? sortedEvents.map((item, i) => {
              const lower = item.toLowerCase()
              const monthIdx = [...MONTHS_EN, ...MONTHS_PT].findIndex(m => lower.includes(m)) % 12
              const isPast = monthIdx >= 0 && monthIdx < currentMonthIndex
              const isCurrent = monthIdx === currentMonthIndex
              const isFair = lower.includes("fair") || lower.includes("feira") || lower.includes("festival")

              return (
                <li key={i} className={cn("flex items-start gap-3 group/item transition-all duration-500", isPast && "opacity-30 grayscale")}>
                  <div className={cn(
                    "size-7 rounded-xl flex items-center justify-center shrink-0 transition-all border",
                    isPast ? "bg-zinc-900 border-zinc-800 text-zinc-600" : isCurrent ? "bg-primary border-primary text-black" : "bg-zinc-800/60 border-zinc-700/50 text-primary/60 group-hover/item:border-primary/40 group-hover/item:text-primary"
                  )}>
                    {isFair ? <Star size={12} /> : <PartyPopper size={12} />}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-bold uppercase italic leading-tight transition-colors",
                      isPast ? "text-zinc-600" : isCurrent ? "text-primary" : "text-zinc-400 group-hover/item:text-white"
                    )}>
                      {item}
                    </p>
                    {isCurrent && <span className="text-[8px] font-black uppercase tracking-widest text-primary/50 animate-pulse">Acontecendo este mês</span>}
                  </div>
                </li>
              )
            }) : (
              <p className="text-zinc-700 italic font-bold uppercase text-xs">Sem eventos culturais cadastrados para este estado.</p>
            )}
          </ul>
        </div>

        {/* Right column: Climate + Work Window */}
        <div className="flex flex-col gap-8">

          {/* Sazonalidade Climática */}
          <div className="p-8 bg-zinc-900/20 rounded-[40px] border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-12 rounded-xl bg-zinc-800 group-hover:bg-blue-500/20 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-all duration-500 border border-zinc-700 group-hover:border-blue-500/30">
                <CloudSun size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Sazonalidade Climática</h3>
            </div>
            <ul className="space-y-4">
              {data.climateSeasons.length > 0 ? data.climateSeasons.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-xs text-zinc-500 font-bold uppercase tracking-widest italic group/item hover:text-blue-400 transition-colors">
                  <div className="size-6 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-600 group-hover/item:text-blue-400 transition-all shrink-0">
                    {getClimateIcon(s)}
                  </div>
                  {s}
                </li>
              )) : <p className="text-zinc-700 italic font-bold uppercase text-xs">Sem dados climáticos.</p>}
            </ul>
          </div>

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
            <ul className="space-y-4 relative z-10">
              {workChips.map((chip, i) => {
                const Icon = chip.isInterior ? Home : chip.isAlert ? Wrench : TreePine
                const color = chip.isInterior
                  ? "bg-blue-900/30 border-blue-800/50 text-blue-300"
                  : chip.isAlert
                  ? "bg-orange-900/20 border-orange-800/40 text-orange-300"
                  : "bg-primary/10 border-primary/30 text-primary"
                const iconColor = chip.isInterior ? "text-blue-400" : chip.isAlert ? "text-orange-400" : "text-primary"
                return (
                  <li key={i} className={cn("flex items-start gap-3 p-3 rounded-2xl border transition-all", color)}>
                    <div className={cn("size-6 shrink-0 flex items-center justify-center rounded-lg bg-black/20", iconColor)}>
                      <Icon size={13} />
                    </div>
                    <p className="text-xs font-black uppercase italic leading-snug">{chip.text}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Mercado & Notícias Locais */}
      <div className="max-w-6xl mx-auto mt-16 p-10 bg-zinc-900/10 rounded-[40px] border border-zinc-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
              <Newspaper className="text-primary size-8" />
              Mercado & Notícias Locais
            </h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-60 italic">
              Nicho: Home Services • Insights em Tempo Real
            </p>
          </div>
          {loadingNews && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Atualizando...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingNews ? (
            // Skeleton Loading
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-zinc-900/40 rounded-3xl p-6 border border-zinc-800/50 animate-pulse space-y-4">
                <div className="w-full aspect-video bg-zinc-800 rounded-2xl" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))
          ) : news && news.length > 0 ? (
            news.map((item: any, i: number) => (
              <a 
                key={i} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="group/news bg-zinc-900/40 rounded-3xl p-6 border border-zinc-800/50 hover:border-primary/40 hover:bg-zinc-900/60 transition-all duration-500 flex flex-col h-full"
              >
                <div className="w-full aspect-video bg-zinc-800 rounded-2xl overflow-hidden mb-4 border border-zinc-800 group-hover/news:border-primary/20 transition-all flex items-center justify-center relative">
                  {item.urlToImage ? (
                    <img 
                      src={item.urlToImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover/news:scale-110 transition-transform duration-700 opacity-60 group-hover/news:opacity-100"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div 
                    className="absolute inset-0 bg-primary flex items-center justify-center p-4 text-center" 
                    style={{ display: item.urlToImage ? "none" : "flex" }}
                  >
                    <span className="text-black font-black uppercase tracking-[0.2em] text-[10px] italic leading-tight">
                      TS-TOOLS / INTELIGÊNCIA
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/70 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                    {item.source}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-black text-white group-hover/news:text-primary transition-colors line-clamp-2 uppercase italic tracking-tight mb-2">
                  {item.title}
                </h4>
                <p className="text-[10px] text-zinc-500 font-bold leading-relaxed line-clamp-3 mb-6">
                  {item.description}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/50 group-hover/news:border-primary/10 transition-colors">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover/news:text-primary">Leia mais</span>
                  <ExternalLink size={10} className="text-zinc-700 group-hover/news:text-primary" />
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-700 space-y-4">
              <Newspaper size={40} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Nenhuma notícia recente encontrada para este mercado.</p>
            </div>
          )}
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
