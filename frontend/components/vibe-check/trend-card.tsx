"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trend } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react"

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
      className={`p-5 cursor-pointer transition-all duration-200 group relative overflow-hidden ${
        isSelected 
          ? "border-primary bg-primary/10 shadow-md shadow-primary/5" 
          : "border-white/10 bg-card/50 hover:border-white/20 hover:bg-card/80"
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{trend.name}</h3>
          <span className="text-xs font-medium text-muted-foreground">{trend.category}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xl font-black ${isSelected ? "text-primary" : "text-foreground"}`}>
            {trend.score}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Score</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={trend.direction === "rising" ? "success" : trend.direction === "falling" ? "error" : "neutral"} className="flex items-center gap-1 text-[10px] py-0">
          <TrendIcon className="w-3 h-3" />
          <span className="capitalize">{trend.direction}</span>
        </Badge>
        <span className="text-xs font-medium text-muted-foreground">• {trend.momentum} Momentum</span>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 pr-6">
        {trend.description}
      </p>
      
      <ChevronRight className={`absolute right-4 bottom-5 w-5 h-5 transition-transform duration-300 ${
        isSelected ? "text-primary translate-x-1 opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
      }`} />
    </Card>
  )
}
