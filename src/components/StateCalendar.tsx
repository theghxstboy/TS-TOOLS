import React, { useMemo, useState, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import Holidays from "date-holidays"
import { EventInput } from "@fullcalendar/core"
import { ExternalLink, Calendar as CalendarIcon } from "lucide-react"
import { US_STATES_DATA } from "@/data/us-states-data"

interface StateCalendarProps {
  stateId: string
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
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
          seen.set(h.name, { title: h.name, type: 'national' as const })
       })
         
       const state = (hdState.getHolidays(currentYear) || [])
         .filter(h => new Date(h.date).getMonth() === activeMonth)

       state.forEach(h => {
          const existing = seen.get(h.name)
          if (existing) {
             seen.set(h.name, { title: h.name, type: 'both' as const })
          } else {
             seen.set(h.name, { title: h.name, type: 'state' as const })
          }
       })

       return Array.from(seen.values())
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
    if (Math.abs(newYear - currentYear) > 1) setCurrentYear(newYear)
  }

  return (
    <div className="w-full mt-16 bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-6 lg:p-12 shadow-2xl backdrop-blur-xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: The Calendar (Greater) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                <CalendarIcon className="text-primary size-8" strokeWidth={2.5} />
                Plano de Ação
              </h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-60 leading-relaxed italic">
                Sincronize com o pulso dos EUA • {stateData?.name}
              </p>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest bg-black/40 px-5 py-2.5 rounded-full border border-zinc-800/50 shadow-inner">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-sm bg-zinc-700" />
                 <span className="text-zinc-500">Nacionais</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                 <span className="text-primary">Estaduais ({stateId})</span>
               </div>
            </div>
          </div>

          <div className="calendar-container flex-1 bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800 shadow-inner overflow-hidden flex flex-col">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              datesSet={handleDatesSet}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: ""
              }}
              buttonText={{
                today: "Hoje",
                month: "Mês"
              }}
              height="auto"
              aspectRatio={1.5}
              eventContent={(eventInfo) => {
                const isBothOrState = eventInfo.event.extendedProps.type === "state" || eventInfo.event.extendedProps.type === "both"
                return (
                  <div 
                     className={`w-full h-full px-2 py-1 text-[10px] font-bold leading-tight truncate rounded-md border transition-all duration-300
                                 ${isBothOrState 
                                    ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                                    : "bg-zinc-800/80 border-zinc-700/50 text-zinc-400"}`}
                     title={eventInfo.event.title}
                  >
                    {eventInfo.event.title}
                  </div>
                )
              }}
            />
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

           <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl flex-1 flex flex-col">
              <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <div className="space-y-6">
                    {monthlyOfficialHolidays.length === 0 && monthlyInsights.length === 0 ? (
                       <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest italic py-10 opacity-30">
                          Nenhum feriado específico para este mês.
                       </p>
                    ) : (
                       <ul className="space-y-8">
                          {[
                            ...monthlyOfficialHolidays,
                            ...monthlyInsights.map(item => ({ title: item, type: 'tradition' as const }))
                          ].map((item, idx) => {
                             const isBothOrState = item.type === 'both' || item.type === 'state';
                             const isLong = item.title.length > 40;
                             
                             return (
                               <li key={idx} className="flex gap-4 group">
                                  <div className={`mt-1.5 size-1.5 rounded-full transition-all duration-300 shadow-lg shrink-0
                                     ${isBothOrState 
                                        ? 'bg-primary shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                                        : 'bg-zinc-600'}`} 
                                  />
                                  <div className="space-y-1.5 min-w-0">
                                     <div className="flex items-center gap-2">
                                       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border leading-none
                                         ${item.type === 'national' 
                                            ? 'border-zinc-800 text-zinc-600' 
                                            : isBothOrState
                                            ? 'border-primary/20 text-primary'
                                            : 'border-zinc-800 text-zinc-500'}`}>
                                         {item.type === 'national' ? 'NACIONAL' : item.type === 'state' ? 'ESTADUAL' : item.type === 'both' ? 'NAC. + EST.' : 'EVENTO'}
                                       </span>
                                     </div>
                                     <p className={`font-black uppercase italic leading-relaxed group-hover:text-white transition-colors
                                        ${isLong 
                                           ? 'text-[10px] tracking-[0.08em] text-zinc-400' 
                                           : 'text-xs tracking-[0.12em] text-zinc-300'}`}>
                                        {item.title}
                                     </p>
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


