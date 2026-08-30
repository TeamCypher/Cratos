"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AnalysisResult } from "@/lib/types"
import { Smartphone } from "lucide-react"

export interface PlatformRecommendationProps {
  data: AnalysisResult
}

export function PlatformRecommendation({ data }: PlatformRecommendationProps) {
  return (
    <div className="w-full">
      <SectionHeading title="Best Platform" description="Where your content will perform strongest" />
      
      <Card className="w-full bg-card/50 dark:border-white/10 border-black/10 overflow-hidden shadow-sm">
        {/* Best Platform */}
        <div className="p-6 md:p-8 border-b dark:border-white/5 border-black/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">

              <div>
                <h3 className="text-2xl font-bold text-foreground">{data.bestPlatform.name}</h3>
                <Badge variant="success" className="mt-1">{data.bestPlatform.fit}</Badge>
              </div>
            </div>
            
            <div className="w-full md:w-48 flex items-center gap-4">
              <div className="flex-1">
                <Progress value={data.bestPlatform.score} className="h-2.5 dark:bg-black/40 bg-black/5" />
              </div>
              <span className="font-bold text-xl">{data.bestPlatform.score}</span>
            </div>
          </div>
        </div>
        
        {/* Other Platforms */}
        <div className="p-6 md:p-8 dark:bg-black/20 bg-black/5 flex flex-col gap-4">
          <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-2">Other Fits</h4>
          
          {data.otherPlatforms.map((platform, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/5 border-black/5">
              <div className="flex items-center gap-3">
                <h5 className="font-bold text-foreground">{platform.name}</h5>
                <span className="text-sm text-muted-foreground">{platform.fit}</span>
              </div>
              
              <div className="w-full md:w-48 flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={platform.score} className="h-2 dark:bg-black/40 bg-black/5" />
                </div>
                <span className="font-semibold text-muted-foreground">{platform.score}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
