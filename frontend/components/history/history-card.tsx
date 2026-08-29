"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnalysisHistoryItem } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Minus, PlayCircle, Clock, CalendarDays, Smartphone } from "lucide-react"
import Link from "next/link"

export interface HistoryCardProps {
  item: AnalysisHistoryItem
}

export function HistoryCard({ item }: HistoryCardProps) {
  const TrendIcon = item.trendStatus === "rising" ? TrendingUp : item.trendStatus === "falling" ? TrendingDown : Minus

  return (
    <Card className="p-4 md:p-5 bg-card/50 border-white/10 hover:bg-card/80 transition-colors group flex flex-col md:flex-row gap-5 items-start md:items-center">
      
      {/* Thumbnail */}
      <div className={`w-full md:w-40 h-48 md:h-28 shrink-0 rounded-xl ${item.thumbnail} flex items-center justify-center relative overflow-hidden group-hover:shadow-lg transition-all`}>
        <PlayCircle className="w-10 h-10 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-bold text-white tracking-wider">
          {item.duration}
        </div>
      </div>
      
      {/* Meta Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div>
          <h3 className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors">{item.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {item.date}</span>
            <span className="hidden md:inline">•</span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">{item.category}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <Badge variant="outline" className="bg-black/40 text-[10px] flex items-center gap-1.5 py-0.5">
            <Smartphone className="w-3 h-3 text-muted-foreground" />
            {item.bestPlatform}
          </Badge>
          
          <Badge variant={item.trendStatus === "rising" ? "success" : item.trendStatus === "falling" ? "error" : "neutral"} className="flex items-center gap-1 text-[10px] py-0.5">
            <TrendIcon className="w-3 h-3" />
            <span className="capitalize">{item.trendStatus}</span>
          </Badge>
        </div>
      </div>
      
      {/* Score & Action */}
      <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:items-end gap-4 shrink-0 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
        <div className="flex flex-col items-start md:items-end">
          <span className="text-2xl font-black text-foreground leading-none">{item.score} <span className="text-sm text-muted-foreground font-medium">/ 100</span></span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">Opportunity Score</span>
        </div>
        
        <Link href={`/results/${item.id}`} className="w-full md:w-auto">
          <Button variant="secondary" className="w-full md:w-auto font-semibold">
            View Analysis
          </Button>
        </Link>
      </div>

    </Card>
  )
}
