"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendOpportunity } from "@/lib/mock-data"
import { Lightbulb, Target } from "lucide-react"

export interface ContentOpportunitiesProps {
  opportunities: TrendOpportunity[]
}

export function ContentOpportunities({ opportunities }: ContentOpportunitiesProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">Content Opportunities</h3>
        <p className="text-sm text-muted-foreground">Turn the trend into something you can create.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {opportunities.map((opp) => (
          <Card key={opp.id} className="p-4 bg-card/50 border-white/10 flex flex-col hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">{opp.title}</h4>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 text-[10px] bg-white/5 border-white/10">
                <Target className="w-3 h-3 text-secondary" />
                {opp.relevance}% Fit
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
              {opp.explanation}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
