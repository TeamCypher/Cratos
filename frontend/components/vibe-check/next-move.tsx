"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Trend } from "@/lib/mock-data"
import { Zap, PlayCircle, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface NextMoveProps {
  trend: Trend
}

export function NextMove({ trend }: NextMoveProps) {
  const TrendIcon = trend.direction === "rising" ? TrendingUp : trend.direction === "falling" ? TrendingDown : Minus

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">Your Next Move</h3>
        <p className="text-sm text-muted-foreground">Turn data into a decision.</p>
      </div>
      
      <Card className="w-full bg-primary/10 border-primary/30 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="shrink-0 p-2.5 bg-primary/20 rounded-xl border border-primary/40 text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-lg md:text-xl font-bold text-foreground leading-snug">
              "{trend.nextMove.insight}"
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 dark:bg-black/40 bg-black/5 rounded-lg border dark:border-white/5 border-black/5 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1 flex items-center gap-1"><PlayCircle className="w-3 h-3" /> Best Platform</span>
              <span className="font-medium text-sm truncate">{trend.nextMove.platform}</span>
            </div>
            <div className="p-3 dark:bg-black/40 bg-black/5 rounded-lg border dark:border-white/5 border-black/5 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1 flex items-center gap-1"><TrendIcon className="w-3 h-3" /> Trend Momentum</span>
              <span className="font-medium text-sm capitalize flex items-center gap-2">
                {trend.momentum}
                <Badge variant={trend.direction === "rising" ? "success" : trend.direction === "falling" ? "error" : "neutral"} className="px-1.5 py-0 text-[9px]">
                  {trend.direction}
                </Badge>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
