"use client"

import * as React from "react"
import { MetricCard } from "@/components/ui/metric-card"
import { TrendingUp, Zap, Target, Flame } from "lucide-react"
import { VibeCheckSummary } from "@/lib/mock-data"

export interface TopSummaryProps {
  data: VibeCheckSummary
}

export function TopSummary({ data }: TopSummaryProps) {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">What's happening</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Rising Trends"
          value={data.risingTrends}
          icon={TrendingUp}
          trend="up"
          status="success"
        />
        <MetricCard
          title="High Momentum"
          value={data.highMomentum}
          icon={Zap}
        />
        <MetricCard
          title="Content Opportunities"
          value={data.contentOpportunities}
          icon={Target}
        />
        <MetricCard
          title="Fast Growing"
          value={data.fastGrowing}
          icon={Flame}
          trend="up"
          status="warning"
        />
      </div>
    </div>
  )
}
