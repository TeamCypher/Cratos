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
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-card/10 rounded-3xl border border-dashed dark:border-white/10 border-black/10 p-8 text-center">
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
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-primary fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 35 Q 30 35 45 25 T 70 15 T 95 5" className="animate-[dash_2s_ease-out_forwards]" strokeDasharray="100" strokeDashoffset="0" />
        </svg>
      )
    } else if (direction === "falling") {
      return (
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-destructive fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 5 Q 30 5 45 15 T 70 25 T 95 35" />
        </svg>
      )
    } else {
      return (
        <svg viewBox="0 0 100 40" className="w-full h-full stroke-muted-foreground fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 20 L 95 20" />
        </svg>
      )
    }
  }

  return (
    <div className="w-full flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">{trend.name}</h2>
            <Badge variant="outline" className="text-xs dark:bg-white/5 bg-black/5">{trend.category}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">{trend.description}</p>
        </div>
        
        <div className="flex items-center gap-6 shrink-0 dark:bg-black/40 bg-black/5 p-4 rounded-2xl border dark:border-white/5 border-black/5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Score</span>
            <span className="text-3xl font-black text-foreground">{trend.score}</span>
          </div>
          <div className="w-px h-10 dark:bg-white/10 bg-black/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Opportunity</span>
            <Badge variant={trend.opportunityScore === "HIGH" ? "success" : trend.opportunityScore === "MEDIUM" ? "warning" : "error"} className="px-2 py-1 text-xs font-bold tracking-widest">
              {trend.opportunityScore}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Momentum & Relevance */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 bg-card/50 dark:border-white/10 border-black/10 h-48 flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Momentum
                </h3>
                <p className="font-bold text-foreground capitalize text-xl">{trend.direction}</p>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase dark:bg-black/40 bg-black/5">30D</Badge>
            </div>
            <div className="h-20 w-full px-4 -mb-2 mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {renderMomentumChart(trend.direction)}
            </div>
          </Card>
          
          <Card className="p-6 bg-card/50 dark:border-white/10 border-black/10 h-48 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-1 flex items-center gap-2">
                <Target className="w-4 h-4" /> Content Relevance
              </h3>
              <p className="font-bold text-foreground text-xl">Does this fit your content?</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 shrink-0 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center text-xl font-black text-secondary shadow-[0_0_15px_rgba(var(--secondary),0.3)]">
                {trend.relevanceMatch}%
              </div>
              <p className="text-sm text-muted-foreground leading-tight">
                <span className="font-bold text-foreground block mb-0.5">Strong Match</span>
                This trend closely matches the content you recently analyzed.
              </p>
            </div>
          </Card>
        </div>

        {/* Why it Matters */}
        <Card className="p-6 bg-card/50 dark:border-white/10 border-black/10 flex flex-col">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Why it matters
          </h3>
          <p className="text-lg text-foreground leading-relaxed font-medium mb-auto">
            {trend.whyItMatters}
          </p>
          <div className="mt-8 pt-6 border-t dark:border-white/10 border-black/10">
            <PlatformRelevance relevance={trend.platformRelevance} />
          </div>
        </Card>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4">
        <ContentOpportunities opportunities={trend.opportunities} />
        <NextMove trend={trend} />
      </div>

    </div>
  )
}
