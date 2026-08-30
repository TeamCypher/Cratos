"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/ui/section-heading"
import { AnalysisResult } from "@/lib/types"

export interface HookAnalysisProps {
  data: AnalysisResult
}

export function HookAnalysis({ data }: HookAnalysisProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <SectionHeading title="Hook Strength" />
      <Card className="flex-1 bg-card/50 dark:border-white/10 border-black/10 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-4xl font-bold text-foreground">
              {data.hookStrength} <span className="text-xl text-muted-foreground font-medium">/100</span>
            </h3>
            <Badge variant={data.hookStatus}>{data.hookLabel}</Badge>
          </div>
          
          {/* Custom Visualization for Hook Strength: The first 3 seconds */}
          <div className="w-full h-8 flex gap-1 mb-6 rounded-md overflow-hidden dark:bg-black/40 bg-black/5 p-1">
            <div className={`h-full rounded-sm flex-1 ${data.hookStrength > 50 ? 'bg-primary' : 'dark:bg-white/10 bg-black/10'}`}></div>
            <div className={`h-full rounded-sm flex-1 ${data.hookStrength > 70 ? 'bg-primary/80' : 'dark:bg-white/10 bg-black/10'}`}></div>
            <div className={`h-full rounded-sm flex-1 ${data.hookStrength > 85 ? 'bg-primary/60' : 'dark:bg-white/10 bg-black/10'}`}></div>
            <div className="h-full rounded-sm flex-[3] dark:bg-white/5 bg-black/5 border border-dashed dark:border-white/10 border-black/10"></div>
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">
          {data.hookInsight}
        </p>
      </Card>
    </div>
  )
}
