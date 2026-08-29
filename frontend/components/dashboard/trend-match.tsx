"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/ui/section-heading"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { AnalysisResult } from "@/lib/mock-data"

export interface TrendMatchProps {
  data: AnalysisResult
}

export function TrendMatch({ data }: TrendMatchProps) {
  const TrendIcon = data.trendStatus === "rising" ? TrendingUp : data.trendStatus === "falling" ? TrendingDown : Minus

  return (
    <div className="w-full h-full flex flex-col">
      <SectionHeading title="Trend Match" />
      <Card className="flex-1 bg-card/50 dark:border-white/10 border-black/10 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-4xl font-bold text-foreground">{data.trendMatch}%</h3>
            <Badge variant={data.trendStatus === "rising" ? "success" : data.trendStatus === "falling" ? "error" : "neutral"} className="flex items-center gap-1">
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{data.trendStatus}</span>
            </Badge>
          </div>
          
          <div className="w-full mb-6">
            <Progress value={data.trendMatch} className="h-2 dark:bg-black/40 bg-black/5" />
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">
          {data.trendInsight}
        </p>
      </Card>
    </div>
  )
}
