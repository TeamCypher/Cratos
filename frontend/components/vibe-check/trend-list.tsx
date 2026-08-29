"use client"

import * as React from "react"
import { TrendCard } from "./trend-card"
import { Trend } from "@/lib/mock-data"
import { Search } from "lucide-react"

export interface TrendListProps {
  trends: Trend[]
  selectedTrendId: string | null
  onSelectTrend: (trend: Trend) => void
}

export function TrendList({ trends, selectedTrendId, onSelectTrend }: TrendListProps) {
  
  if (trends.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No trends found</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Try adjusting your search or removing some filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold tracking-tight text-foreground px-1 mb-2">Trending Now</h2>
      <div className="flex flex-col gap-3">
        {trends.map(trend => (
          <TrendCard 
            key={trend.id} 
            trend={trend} 
            isSelected={selectedTrendId === trend.id}
            onClick={onSelectTrend}
          />
        ))}
      </div>
    </div>
  )
}
