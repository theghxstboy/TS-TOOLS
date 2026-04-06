import React, { useMemo, useState, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import Holidays from "date-holidays"
import { EventInput } from "@fullcalendar/core"
import { ExternalLink, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { US_STATES_DATA } from "@/data/us-states-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StateCalendarProps {
  stateId: string
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

export default function StateCalendar({ stateId }: StateCalendarProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth()) // 0-11
  const calendarRef = useRef<FullCalendar>(null)

  const stateData = US_STATES_DATA[stateId]

  // Memoize the events generation
  const events = useMemo<EventInput[]>(() => {
    try {
      const hdNational = new Holidays("US")
      const hdState = new Holidays("US", stateId)
      const yearsToFetch = [currentYear - 1, currentYear, currentYear + 1]
      
      const allEvents: EventInput[] = []
      const seen = new Map<string, any>() // date-title -> event
      
      yearsToFetch.forEach((year) => {
        const nationalHolidays = hdNational.getHolidays(year) || []
        const stateHolidays = hdState.getHolidays(year) || []

        // Process National
        nationalHolidays.forEach((h) => {
          const key = `${h.date}-${h.name}`
          seen.set(key, {
            title: h.name,
            start: h.date,
            allDay: true,
            color: "#3f3f46",
            textColor: "#f8fafc",
            extendedProps: { type: "national" }
          })
        })

        // Process State (Overwrites or Merges with National)
        stateHolidays.forEach((h) => {
          const key = `${h.date}-${h.name}`
          const existing = seen.get(key)
          
          if (existing) {
             // If already exists as national, we keep it but mark as BOTH or prioritize State look
             seen.set(key, {
                ...existing,
                color: "rgba(245, 158, 11, 0.2)",
                borderColor: "#f59e0b",
                textColor: "#f59e0b",
                extendedProps: { type: "both" } // Unified type
             })
          } else {
             seen.set(key, {
                title: h.name,
                start: h.date,
                allDay: true,
                color: "rgba(245, 158, 11, 0.2)",
                borderColor: "#f59e0b",
                textColor: "#f59e0b",
                extendedProps: { type: "state" }
             })
          }
        })
      })

      return Array.from(seen.values())
    } catch (e) {
      console.error("Error generating holidays:", e)
      return []
    }
  }, [stateId, currentYear])

  // Filter extra insights based on the active month
  const monthlyInsights = useMemo(() => {
    if (!stateData) return []
    
    const combined = [
      ...(stateData.holidays || []),
      ...(stateData.culturalEvents || [])
    ]
    
    const monthLabel = MONTH_NAMES[activeMonth].toLowerCase()
    
    // Filter by month keyword in string
    return combined.filter(item => {
      const lower = item.toLowerCase()
      // Look for the specific month or generic "monthly" mentions
      return lower.includes(monthLabel)
    })
  }, [stateData, activeMonth])


  // Get date-holidays for the specific month to list them properly
  const monthlyOfficialHolidays = useMemo(() => {
    try {
       const hdNational = new Holidays("US")
       const hdState = new Holidays("US", stateId)
       
       const seen = new Map<string, any>()

       const national = (hdNational.getHolidays(currentYear) || [])
         .filter(h => new Date(h.date).getMonth() === activeMonth)
       
       national.forEach(h => {
          seen.set(h.name, { title: h.name, type: 'national' as const, date: new Date(h.date) })
       })
         
       const state = (hdState.getHolidays(currentYear) || [])
         .filter(h => new Date(h.date).getMonth() === activeMonth)

       state.forEach(h => {
          const existing = seen.get(h.name)
          if (existing) {
             seen.set(h.name, { title: h.name, type: 'both' as const, date: new Date(h.date) })
          } else {
             seen.set(h.name, { title: h.name, type: 'state' as const, date: new Date(h.date) })
          }
       })

       return Array.from(seen.values()).sort((a, b) => a.date.getTime() - b.date.getTime())
    } catch (e) {
       return []
    }
  }, [stateId, currentYear, activeMonth])

  const handleDatesSet = (dateInfo: any) => {
    const viewStart = dateInfo.view.currentStart
    const middleOfView = new Date(viewStart.getTime() + (dateInfo.view.currentEnd.getTime() - viewStart.getTime()) / 2)
    
    const newMonth = middleOfView.getMonth()
    const newYear = middleOfView.getFullYear()
    
    if (newMonth !== activeMonth) setActiveMonth(newMonth)
    if (newYear !== currentYear) setCurrentYear(newYear)
  }

  const handlePrev = () => calendarRef.current?.getApi().prev()
  const handleNext = () => calendarRef.current?.getApi().next()
  const handleToday = () => calendarRef.current?.getApi().today()

  // Helper to get holiday type for a specific date cell
  const getDayClasses = (arg: any) => {
    const dateStr = arg.date.toISOString().split('T')[0]
    const holiday = events.find(e => e.start === dateStr)
    if (!holiday) return ""
    
    const type = holiday.extendedProps?.type
    if (type === "state") return "holiday-state"
    if (type === "national") return "holiday-national"
    if (type === "both") return "holiday-both"
    return ""
  }

  return (
    <div className="w-full mt-16 bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-6 lg:p-12 shadow-2xl backdrop-blur-xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: The Calendar (Greater) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
                  <CalendarIcon className="text-primary size-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" strokeWidth={2.5} />
                  Plano de Ação
                </h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 opacity-60 leading-relaxed italic flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-zinc-800" />
                  Marketing Intelligence • {stateData?.name}
                </p>
              </div>

              {/* Custom Header Controls */}
              <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/50 backdrop-blur-md">
                <div className="flex items-center gap-4 px-4 border-r border-zinc-800">
                  <span className="text-white font-black uppercase italic tracking-tighter text-sm md:text-lg min-w-[120px]">
                    {MONTH_NAMES[activeMonth]} {currentYear}
                  </span>
                </div>
                <div className="flex items-center gap-1 mr-2 px-2">
                   <Button variant="ghost" size="icon-sm" onClick={handlePrev} className="hover:bg-zinc-800 rounded-xl">
                      <ChevronLeft size={18} />
                   </Button>
                   <Button variant="ghost" size="icon-sm" onClick={handleNext} className="hover:bg-zinc-800 rounded-xl">
                      <ChevronRight size={18} />
                   </Button>
                </div>
                <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleToday}
                  className="bg-zinc-900 border-zinc-800 hover:bg-primary hover:text-black hover:border-primary font-black uppercase tracking-widest text-[10px] rounded-xl transition-all duration-300"
                >
                  Hoje
                </Button>
              </div>
           </div>

           <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest">
               <div className="flex items-center gap-2.5 bg-zinc-900/40 px-4 py-2 rounded-full border border-zinc-800/50">
                 <div className="w-2 h-2 rounded-full bg-zinc-600 shadow-[0_0_10px_rgba(82,82,91,0.3)]" />
                 <span className="text-zinc-500">Nacionais</span>
               </div>
               <div className="flex items-center gap-2.5 bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                 <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                 <span className="text-primary italic">Estaduais ({stateId})</span>
               </div>
            </div>
          </div>

          <div className="calendar-container flex-1 bg-zinc-950/20 rounded-[2.5rem] border border-zinc-900/50 shadow-2xl overflow-hidden flex flex-col relative group">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 size-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 size-48 bg-zinc-800/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="p-4 md:p-8 relative z-10">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                datesSet={handleDatesSet}
                headerToolbar={false} // Disable default toolbar
                height="auto"
                aspectRatio={1.4}
                dayMaxEvents={3}
                eventContent={(eventInfo) => {
                  const isBothOrState = eventInfo.event.extendedProps.type === "state" || eventInfo.event.extendedProps.type === "both"
                  return (
                    <div 
                       className={cn(
                        "w-full px-2.5 py-2.5 text-[12px] font-black leading-none truncate rounded-xl border transition-all duration-500 group/event",
                        isBothOrState 
                          ? "bg-primary text-black border-primary shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(245,158,11,0.4)]" 
                          : "bg-zinc-800/80 border-zinc-700/50 text-zinc-100 hover:border-zinc-400"
                       )}
                       title={eventInfo.event.title}
                    >
                      <span className="uppercase italic tracking-tight">{eventInfo.event.title}</span>
                    </div>
                  )
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Monthly Insights (Side Panel) */}
        <div className="lg:col-span-4 flex flex-col">
           <div className="flex flex-col gap-1 mb-8">
             <div className="flex items-center gap-3">
               <div className="bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-700/50">
                 <CalendarIcon className="text-zinc-500 size-5" />
               </div>
               <div>
                 <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none italic">
                    Calendário Oficial
                 </h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-2 opacity-60 leading-relaxed italic">
                    Feriados & Tradições Mensais
                 </p>
               </div>
             </div>
           </div>

            <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-[2.5rem] p-8 md:p-10 shadow-2xl flex-1 flex flex-col relative overflow-hidden group/panel">
              {/* Subtle panel glow */}
              <div className="absolute top-0 right-0 size-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none group-hover/panel:bg-primary/10 transition-colors duration-500" />
              
              <div className="space-y-10 flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
                 <div className="space-y-8">
                    {monthlyOfficialHolidays.length === 0 && monthlyInsights.length === 0 ? (
                       <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30 group-hover/panel:opacity-50 transition-opacity">
                          <CalendarIcon size={40} className="text-zinc-800" strokeWidth={1} />
                          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] italic">
                             Nenhum feriado <br /> específico este mês
                          </p>
                       </div>
                    ) : (
                       <ul className="space-y-0 relative">
                          {monthlyOfficialHolidays.map((item: any, idx, arr) => {
                             const isBothOrState = item.type === 'both' || item.type === 'state';
                             const isLast = idx === arr.length - 1;
                             
                             // Logic for Past vs Future
                             const now = new Date()
                             now.setHours(0,0,0,0)
                             const eventDate = item.date ? new Date(item.date) : null
                             if (eventDate) eventDate.setHours(0,0,0,0)

                             const isPast = eventDate && eventDate < now
                             const isToday = eventDate && eventDate.getTime() === now.getTime()
                             
                             // Format date for the label: e.g. "APR 15, 2026"
                             const formattedDate = item.date ? 
                               item.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() : 
                               "DATE TBA";

                             return (
                               <li key={idx} className={cn(
                                 "relative pl-16 pb-12 group/item transition-all duration-500",
                                 isPast ? "opacity-30 grayscale-[0.8]" : "opacity-100"
                               )}>
                                  {/* Connection Line */}
                                  {!isLast && (
                                    <div className={cn(
                                        "absolute left-[19.5px] top-10 bottom-0 w-[2px] transition-colors duration-700",
                                        isPast ? "bg-zinc-800" : "bg-zinc-700 group-hover/item:bg-primary/30"
                                    )} />
                                  )}
                                  
                                  {/* Timeline Circle with Day Number */}
                                  <div className={cn(
                                    "absolute left-0 top-0 size-10 rounded-full border-4 border-zinc-950 flex items-center justify-center transition-all duration-500 shadow-2xl z-20",
                                    isPast 
                                      ? "bg-zinc-900 border-zinc-800 text-zinc-600 scale-90" 
                                      : isToday 
                                      ? "bg-primary border-primary text-black shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-125" 
                                      : "bg-black border-zinc-700 text-zinc-200 group-hover/item:border-primary group-hover/item:scale-110"
                                  )}>
                                     <span className="text-[14px] font-black italic leading-none">
                                       {item.date ? item.date.getDate() : "•"}
                                     </span>
                                  </div>
                                  
                                  <div className="space-y-3 pt-1">
                                     <div className="flex items-center gap-3">
                                       <span className={cn(
                                          "text-[9px] font-black tracking-[0.2em] uppercase transition-colors",
                                          isPast ? "text-zinc-700" : isToday ? "text-primary italic animate-pulse" : "text-zinc-500"
                                       )}>
                                         {formattedDate} • {item.type === 'national' ? 'NATIONAL' : item.type === 'state' ? 'STATE' : 'STATE + NAT'}
                                       </span>
                                       {isToday && <div className="h-[1px] flex-1 bg-primary/20" />}
                                     </div>
                                     
                                     <div className="space-y-1">
                                        <p className={cn(
                                            "font-black uppercase italic leading-tight transition-all duration-500",
                                            isPast 
                                              ? 'text-zinc-600' 
                                              : isToday
                                              ? 'text-primary text-lg tracking-tighter drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                              : 'text-zinc-200 group-hover/item:text-white',
                                            item.title.length > 30 ? 'text-sm' : 'text-base'
                                        )}>
                                            {item.title}
                                        </p>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed line-clamp-2 max-w-[240px]">
                                           Holiday confirmed for {stateData?.name} using official US intelligence.
                                        </p>
                                     </div>
                                  </div>
                               </li>
                             );
                          })}
                       </ul>
                    )}
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-between items-center opacity-60">
                 <a 
                   href="https://www.npmjs.com/package/date-holidays" 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center gap-1.5 text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors uppercase font-black tracking-widest"
                 >
                   date-holidays <ExternalLink size={8} />
                 </a>
                 <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                   2026 Ready
                 </span>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}


