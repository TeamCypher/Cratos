"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trend } from "@/lib/mock-data"
import { ContentOpportunities } from "./content-opportunities"
import { PlatformRelevance } from "./platform-relevance"
import { NextMove } from "./next-move"
import { Activity, Target, AlertCircle } from "lucide-react"

export interface TrendDetailProps {
  trend: Trend | null
}

export function TrendDetail({ trend }: TrendDetailProps) {
  if (!trend) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-card/10 rounded-3xl border border-dashed dark:border-white/10 border-black/10 p-8 text-center mt-12">
        <Target className="w-12 h-12 mb-4 opacity-20" />
        <h3 className="text-xl font-bold mb-2">Select a Trend</h3>
        <p className="max-w-xs text-sm">Click on a trend from the list to view deep insights, relevance, and content opportunities.</p>
      </div>
    )
  }

  // Momentum visualization SVG
  const renderMomentumChart = (direction: string) => {
    if (direction === "rising") {
      return (
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-primary fill-none stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 35 Q 30 35 45 25 T 70 15 T 95 5" className="animate-[dash_2s_ease-out_forwards]" strokeDasharray="100" strokeDashoffset="0" />
        </svg>
      )
    } else if (direction === "falling") {
      return (
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-destructive fill-none stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 5 Q 30 5 45 15 T 70 25 T 95 35" />
        </svg>
      )
    } else {
      return (
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-muted-foreground fill-none stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 20 L 95 20" />
        </svg>
      )
    }
  }

  return (
    <div className="w-full flex flex-col gap-16 md:gap-20 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 5. Selected Trend Overview */}
      <section className="flex flex-col gap-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">{trend.name}</h2>
              <Badge variant="outline" className="text-sm dark:bg-white/5 bg-black/5 px-3 py-1">{trend.category}</Badge>
            </div>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">{trend.description}</p>
          </div>
          
          <div className="flex items-center gap-8 shrink-0 dark:bg-black/40 bg-black/5 p-6 rounded-3xl border dark:border-white/5 border-black/5 self-start md:self-auto">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-2">Score</span>
              <span className="text-5xl font-black text-foreground">{trend.score}</span>
            </div>
            <div className="w-px h-16 dark:bg-white/10 bg-black/10"></div>
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-2">Opportunity</span>
              <Badge variant={trend.opportunityScore === "HIGH" ? "success" : trend.opportunityScore === "MEDIUM" ? "warning" : "error"} className="px-3 py-1.5 text-sm font-bold tracking-widest">
                {trend.opportunityScore}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Why it Matters (Part of Overview) */}
        <Card className="p-8 bg-card/50 dark:border-white/10 border-black/10">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Why it matters
          </h3>
          <p className="text-xl text-foreground leading-relaxed font-medium">
            {trend.whyItMatters}
          </p>
        </Card>
      </section>

      {/* 6. Momentum Analysis */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Momentum</h2>
          <p className="text-muted-foreground mt-2 text-lg">Current trajectory and growth speed.</p>
        </div>
        <Card className="p-8 bg-card/50 dark:border-white/10 border-black/10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Current Status
              </h3>
              <p className="font-black text-foreground capitalize text-4xl">{trend.direction}</p>
            </div>
            <Badge variant="outline" className="text-xs uppercase dark:bg-black/40 bg-black/5 px-3 py-1">30 Days</Badge>
          </div>
          <div className="flex-[2] w-full h-32 px-4 opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {renderMomentumChart(trend.direction)}
          </div>
        </Card>
      </section>

      {/* 7. Content Relevance */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Content Relevance</h2>
          <p className="text-muted-foreground mt-2 text-lg">Does this fit your content?</p>
        </div>
        <Card className="p-8 bg-card/50 dark:border-white/10 border-black/10 flex items-center gap-8">
          <div className="w-24 h-24 shrink-0 rounded-full bg-secondary/10 border-[3px] border-secondary flex items-center justify-center text-3xl font-black text-secondary shadow-[0_0_25px_rgba(var(--secondary),0.4)]">
            {trend.relevanceMatch}%
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Strong Match</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This trend closely matches the content you recently analyzed. Your audience is highly likely to engage with this topic.
            </p>
          </div>
        </Card>
      </section>

      {/* 8. Platform Fit */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Platform Fit</h2>
          <p className="text-muted-foreground mt-2 text-lg">Where does this perform best?</p>
        </div>
        <Card className="p-8 bg-card/50 dark:border-white/10 border-black/10">
          <PlatformRelevance relevance={trend.platformRelevance} />
        </Card>
      </section>

      {/* 9. Content Opportunities */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Content Opportunities</h2>
          <p className="text-muted-foreground mt-2 text-lg">Turn the trend into something you can create.</p>
        </div>
        <ContentOpportunities opportunities={trend.opportunities} />
      </section>

      {/* 10. Your Next Move */}
      <section className="mt-8">
        <NextMove trend={trend} />
      </section>

    </div>
  )
}
