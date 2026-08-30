"use client"

import * as React from "react"
import { MetricCard } from "@/components/ui/metric-card"
import { Activity, Target, Users, Zap } from "lucide-react"
import { AnalysisResult } from "@/lib/types"

export interface InsightGridProps {
  data: AnalysisResult
}

export function InsightGrid({ data }: InsightGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Trend Match"
        value={`${data.trendMatch}%`}
        icon={Activity}
        trend={data.trendStatus === "rising" ? "up" : data.trendStatus === "falling" ? "down" : "none"}
        status={data.trendStatus === "rising" ? "success" : data.trendStatus === "falling" ? "error" : "neutral"}
      />
      <MetricCard
        title="Hook Strength"
        value={`${data.hookStrength}/100`}
        icon={Zap}
        description={data.hookLabel}
      />
      <MetricCard
        title="Audience Fit"
        value={`${data.audienceFit}%`}
        icon={Users}
      />
      <MetricCard
        title="Content Quality"
        value={`${data.contentQuality}%`}
        icon={Target}
      />
    </div>
  )
}
