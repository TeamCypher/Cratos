"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { AnalysisResult } from "@/lib/mock-data"

export interface ContentSummaryProps {
  data: AnalysisResult
}

export function ContentSummary({ data }: ContentSummaryProps) {
  const summaryItems = [
    { label: "Topic", value: data.contentSummary.topic },
    { label: "Tone", value: data.contentSummary.tone },
    { label: "Format", value: data.contentSummary.format },
    { label: "Audience", value: data.contentSummary.audience },
  ]

  return (
    <div className="w-full">
      <SectionHeading title="What Cratos Understood" description="The core profile extracted from your media." />
      
      <Card className="bg-card/50 border-white/10 p-6">
        <div className="flex flex-wrap gap-4">
          {summaryItems.map((item, idx) => (
            <div key={idx} className="flex-1 min-w-[120px] p-3 rounded-lg bg-white/5 border border-white/5">
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {item.label}
              </span>
              <span className="block font-medium text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
