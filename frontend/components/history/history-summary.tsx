"use client"

import * as React from "react"
import { MetricCard } from "@/components/ui/metric-card"
import { HistorySummary as HistorySummaryType } from "@/lib/types"
import { Layers, Activity, TrendingUp, Smartphone } from "lucide-react"

export interface HistorySummaryProps {
  data: HistorySummaryType
}

export function HistorySummary({ data }: HistorySummaryProps) {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Analyses"
          value={data.totalAnalyses}
          icon={Layers}
        />
        <MetricCard
          title="Average Score"
          value={data.averageScore}
          icon={Activity}
          trend="up"
          status="success"
        />
        <MetricCard
          title="Rising Opportunities"
          value={data.risingOpportunities}
          icon={TrendingUp}
        />
        <MetricCard
          title="Top Platform"
          value={data.topPlatform}
          icon={Smartphone}
        />
      </div>
    </div>
  )
}
