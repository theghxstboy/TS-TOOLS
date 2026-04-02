"use client"

import React, { useState, useEffect, useMemo } from "react"
import * as d3 from "d3-geo"
import { feature } from "topojson-client"
import { cn } from "@/lib/utils"

interface USAMapProps {
  onStateClick: (stateId: string) => void
  selectedState: string | null
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"

const USAMap: React.FC<USAMapProps> = ({ onStateClick, selectedState }) => {
  const [geographies, setGeographies] = useState<any[]>([])
  const [hoveredState, setHoveredState] = useState<{ name: string, x: number, y: number } | null>(null)

  // us-atlas albers-10m is already projected. 
  // We use a null projection to avoid the "spaghetti" effect.
  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(null)
  }, [])

  useEffect(() => {
    fetch(GEO_URL)
      .then((response) => response.json())
      .then((us) => {
        const states = (feature(us, us.objects.states) as any).features
        setGeographies(states)
      })
      .catch((err) => console.error("Error loading map data:", err))
  }, [])

  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center pt-4 pb-8">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/2 blur-[100px] pointer-events-none rounded-full" />
      
      <svg
        viewBox="0 0 960 600"
        className="w-full h-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {geographies.map((geo: any) => {
            const stateName = geo.properties.name
            const abbr = STATE_TO_ABBR[stateName] || stateName
            const isSelected = selectedState === abbr
            const isHovered = hoveredState?.name === stateName
            const pathData = pathGenerator(geo)

            if (!pathData) return null

            const centroid = pathGenerator.centroid(geo)

            return (
              <path
                key={geo.id}
                d={pathData}
                fill={isSelected ? "#FF6B00" : (isHovered ? "rgba(255, 107, 0, 0.4)" : "rgba(255, 255, 255, 0.05)")}
                stroke={isSelected || isHovered ? "#FF6B00" : "rgba(255, 255, 255, 0.15)"}
                strokeWidth={isSelected ? 1.5 : 0.8}
                className={cn(
                  "cursor-pointer transition-all duration-300 ease-out z-10",
                )}
                onClick={() => onStateClick(abbr)}
                onMouseEnter={() => {
                  if (centroid && !isNaN(centroid[0])) {
                    setHoveredState({ name: stateName, x: centroid[0], y: centroid[1] })
                  }
                }}
                onMouseLeave={() => setHoveredState(null)}
              />
            )
          })}
        </g>

        {/* Labels Overlay */}
        <g pointerEvents="none">
          {geographies.map((geo: any) => {
            const stateName = geo.properties.name
            const abbr = STATE_TO_ABBR[stateName]
            if (!abbr) return null
            
            const centroid = pathGenerator.centroid(geo)
            if (!centroid || isNaN(centroid[0])) return null

            const isSelected = selectedState === abbr
            const isHovered = hoveredState?.name === stateName

            return (
              <text
                key={`label-${geo.id}`}
                x={centroid[0]}
                y={centroid[1]}
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fill={isSelected || isHovered ? "#000" : "rgba(255, 255, 255, 0.4)"}
                className="pointer-events-none select-none transition-all duration-300 font-sans uppercase italic"
              >
                {abbr}
              </text>
            )
          })}
        </g>
      </svg>

      {/* Dynamic Tooltip */}
      {hoveredState && (
        <div 
          className="absolute pointer-events-none z-50 px-4 py-2 bg-zinc-900/95 backdrop-blur-xl rounded-xl border border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200"
          style={{
            top: `${(hoveredState.y / 600) * 100}%`,
            left: `${(hoveredState.x / 960) * 100}%`,
            transform: 'translate(-50%, -100%) translateY(-15px)',
          }}
        >
           <span className="text-white text-xs font-black uppercase tracking-tighter italic leading-none whitespace-nowrap">
             {hoveredState.name}
           </span>
           {/* Tooltip Arrow */}
           <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-zinc-800" />
        </div>
      )}
    </div>
  )
}

const STATE_TO_ABBR: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC"
}

export default USAMap
