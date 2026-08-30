"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trend } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Minus, ChevronRight, Youtube, Twitch } from "lucide-react"

export interface TrendCardProps {
  trend: Trend
  isSelected: boolean
  onClick: (trend: Trend) => void
}

export function TrendCard({ trend, isSelected, onClick }: TrendCardProps) {
  const TrendIcon = trend.direction === "rising" ? TrendingUp : trend.direction === "falling" ? TrendingDown : Minus
  
  return (
    <Card 
      onClick={() => onClick(trend)}
      className={`p-5 md:p-6 cursor-pointer transition-all duration-200 group relative overflow-hidden ${
        isSelected 
          ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
          : "dark:border-white/10 border-black/10 bg-card/50 hover:dark:border-white/20 border-black/20 hover:bg-card/80"
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 w-1 md:w-2 h-full bg-primary" />
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Info */}
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{trend.name}</h3>
            <Badge variant="outline" className="text-[10px] uppercase font-semibold">{trend.category}</Badge>
            {trend.platform?.toLowerCase() === 'youtube' && (
              <Youtube className="w-5 h-5 text-red-500" />
            )}
            {trend.platform?.toLowerCase() === 'twitch' && (
              <Twitch className="w-5 h-5 text-purple-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-1 max-w-2xl">
            {trend.description}
          </p>
        </div>
        
        {/* Right Side: Metrics */}
        <div className="flex items-center gap-8 md:gap-12 shrink-0 md:mr-6">
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={trend.direction === "rising" ? "success" : trend.direction === "falling" ? "error" : "neutral"} className="flex items-center gap-1 text-[10px] py-0 px-2">
                <TrendIcon className="w-3 h-3" />
                <span className="capitalize">{trend.direction}</span>
              </Badge>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{trend.momentum} Momentum</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`text-2xl font-black ${isSelected ? "text-primary" : "text-foreground"}`}>
              {trend.score}
            </span>
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Score</span>
          </div>
        </div>
      </div>
      
      <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 transition-transform duration-300 hidden md:block ${
        isSelected ? "text-primary translate-x-1 opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
      }`} />
    </Card>
  )
}
