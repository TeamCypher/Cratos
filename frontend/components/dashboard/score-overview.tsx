"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Score } from "@/components/ui/score"
import { Sparkles } from "lucide-react"

export interface ScoreOverviewProps {
  score: number
  insight: string
}

export function ScoreOverview({ score, insight }: ScoreOverviewProps) {
  return (
    <Card className="w-full h-full p-8 md:p-12 flex flex-col items-center justify-center bg-card/40 dark:border-white/10 border-black/10 shadow-lg relative overflow-hidden group">
      {/* Background ambient glow based on score */}
      <div className="absolute inset-0 bg-primary/5 rounded-xl blur-3xl transition-opacity opacity-50 group-hover:opacity-80 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-sm md:text-base font-semibold tracking-widest text-muted-foreground uppercase mb-8">
          Overall Content Score
        </h2>
        
        <div className="mb-8">
          <Score value={score} max={100} size="hero" />
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm md:text-base font-medium text-foreground">
            {insight}
          </p>
        </div>
      </div>
    </Card>
  )
}
