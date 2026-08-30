"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { AnalysisResult } from "@/lib/types"
import { Zap, Clock, Smartphone, TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface BestMoveProps {
  data: AnalysisResult
}

export function BestMove({ data }: BestMoveProps) {
  const TrendIcon = data.bestMove.trend === "rising" ? TrendingUp : data.bestMove.trend === "falling" ? TrendingDown : Minus

  return (
    <div className="w-full">
      <SectionHeading title="Your Best Move" description="The single highest-leverage action right now." />
      
      <Card className="w-full bg-primary/10 border-primary/20 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="shrink-0 p-3 bg-primary/20 rounded-xl border border-primary/30 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground leading-snug">
              "{data.bestMove.insight}"
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-primary/20 pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Target Platform</span>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                {data.bestMove.platform}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Optimal Time</span>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {data.bestMove.time}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Momentum</span>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <TrendIcon className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize">{data.bestMove.trend}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
