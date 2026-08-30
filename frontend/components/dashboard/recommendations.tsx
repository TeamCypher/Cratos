"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { Badge } from "@/components/ui/badge"
import { AnalysisResult } from "@/lib/types"
import { Lightbulb } from "lucide-react"

export interface RecommendationsProps {
  data: AnalysisResult
}

export function Recommendations({ data }: RecommendationsProps) {
  return (
    <div className="w-full">
      <SectionHeading title="How to Improve" description="Tactical adjustments to boost your content's performance." />
      
      <div className="grid grid-cols-1 gap-4">
        {data.recommendations.map((rec) => (
          <Card key={rec.id} className="p-5 bg-card/50 dark:border-white/10 border-black/10 flex items-start gap-4 hover:dark:bg-white/5 bg-black/5 transition-colors">
            <div className="shrink-0 w-8 h-8 rounded-full dark:bg-white/5 bg-black/5 flex items-center justify-center border dark:border-white/10 border-black/10 text-muted-foreground font-bold text-sm">
              {rec.id}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold text-foreground">{rec.title}</h4>
                {rec.priority && (
                  <Badge variant="rising" className="text-[10px] uppercase px-1.5 py-0">Priority</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rec.explanation}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
