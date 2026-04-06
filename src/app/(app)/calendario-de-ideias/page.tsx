"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import USAMap from "@/components/USAMap"
import StateDetails from "@/components/StateDetails"
import StateCalendar from "@/components/StateCalendar"
import { US_STATES_DATA } from "@/data/us-states-data"
import { Search, ChevronDown, Map as MapIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function CalendarioDeIdeiasContent() {
  const searchParams = useSearchParams()
  const [selectedState, setSelectedState] = useState<string | null>(null) 
  const [searchQuery, setSearchQuery] = useState("")

  // Pre-select state from URL query param (e.g. coming from Ctrl+K)
  useEffect(() => {
    const stateParam = searchParams.get("state")
    if (stateParam && US_STATES_DATA[stateParam]) {
      setSelectedState(stateParam)
    }
  }, [searchParams])

  const statesList = useMemo(() => {
    return Object.values(US_STATES_DATA).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const filteredStates = useMemo(() => {
    if (!searchQuery) return []
    return statesList.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
  }, [searchQuery, statesList])

  const handleStateSelect = (id: string) => {
    setSelectedState(id)
    setSearchQuery("")
    
    // Update URL without reloading to persist selection on F5
    const url = new URL(window.location.href)
    url.searchParams.set("state", id)
    window.history.replaceState({}, "", url.toString())

    setTimeout(() => {
      document.getElementById("state-details-section")?.scrollIntoView({ behavior: "smooth" })
    }, 150)
  }

  const activeData = selectedState ? US_STATES_DATA[selectedState] : null

  const [news, setNews] = useState<any[]>([])
  const [loadingNews, setLoadingNews] = useState(false)

  // Fetch real-time news when state is selected
  useEffect(() => {
    if (selectedState) {
      setLoadingNews(true)
      setNews([]) // Clear previous news immediately to avoid stale data
      fetch(`/api/state-content/${selectedState.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
          if (data.news) {
            setNews(data.news)
          } else {
            setNews([])
          }
          setLoadingNews(false)
        })
        .catch(err => {
          console.error("Fetch news error:", err)
          setNews([])
          setLoadingNews(false)
        })
    } else {
      setNews([])
    }
  }, [selectedState])

  return (
    <div className="flex-1 bg-black min-h-screen text-white selection:bg-primary selection:text-black font-sans">
      
      {/* INITIAL SCREEN: SCALED DOWN HERO */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-20 overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl mx-auto text-center space-y-10">
          
          {/* Headline - Scaled Down (5xl-6xl) */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.95] text-white">
              Planeje. <br className="sm:hidden" />
              Publique. <br />
              <span className="text-primary drop-shadow-[0_0_30px_rgba(255,107,0,0.15)]">Domine.</span>
            </h1>
            <p className="max-w-lg mx-auto text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-2 opacity-60 leading-relaxed italic">
              Central de inteligência para escalar Home Services nos EUA.
            </p>
          </div>

          <div className="relative w-full max-w-md mx-auto">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-20 pointer-events-none drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" size={20} />
              <Input 
                placeholder="Busque por um estado..."
                className="pl-12 h-14 bg-zinc-900/60 border-zinc-700 focus:border-primary/50 text-white rounded-xl transition-all text-base font-medium placeholder:text-zinc-500 shadow-xl backdrop-blur-md relative z-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Float Menu Results */}
            {filteredStates.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
                {filteredStates.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => handleStateSelect(state.id)}
                    className="w-full flex items-center justify-between px-8 py-5 hover:bg-primary transition-all text-left group"
                  >
                    <span className="text-white font-black text-lg uppercase tracking-tighter italic group-hover:text-black">
                      {state.name}
                    </span>
                    <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest bg-zinc-800 px-2.5 py-1 rounded-lg group-hover:bg-black/20 group-hover:text-black transition-all">
                      {state.id}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map - Centered & Accurate Shape */}
          <div className="w-full max-w-4xl mx-auto pt-6">
             <div className="flex items-center justify-center gap-2 mb-4 text-zinc-700 text-[10px] font-black uppercase tracking-widest opacity-50">
               <MapIcon size={12} className="text-primary/30" />
               Mapa de Contornos Reais (Albers USA)
             </div>
             <USAMap 
                onStateClick={handleStateSelect} 
                selectedState={selectedState} 
             />
          </div>
        </div>

        {/* Action Indicator */}
        <div className="mt-12 text-zinc-800 animate-pulse flex flex-col items-center gap-2">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Scroll</span>
           <ChevronDown size={24} strokeWidth={3} />
        </div>
      </section>

      {/* STATE CONTENT AREA */}
      {selectedState && (
        <section 
          id="state-details-section" 
          className="min-h-screen px-4 md:px-8 py-24 bg-zinc-950 border-t border-zinc-900"
        >
          <div className="max-w-screen-2xl mx-auto space-y-16">
            {activeData && <StateDetails data={activeData} news={news} loadingNews={loadingNews} />}
            <StateCalendar stateId={selectedState} />
          </div>
        </section>
      )}

    </div>
  )
}

export default function CalendarioDeIdeias() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-primary animate-pulse font-black uppercase tracking-widest italic text-xl">
          Carregando...
        </div>
      </div>
    }>
      <CalendarioDeIdeiasContent />
    </Suspense>
  )
}
