"use client"

import * as React from "react"
import { DashboardHeader } from "./dashboard-header"
import { VideoSummary } from "./video-summary"
import { ScoreOverview } from "./score-overview"
import { InsightGrid } from "./insight-grid"
import { PlatformRecommendation } from "./platform-recommendation"
import { TrendMatch } from "./trend-match"
import { HookAnalysis } from "./hook-analysis"
import { BestMove } from "./best-move"
import { Recommendations } from "./recommendations"
import { ContentSummary } from "./content-summary"
import { AnalysisResult } from "@/lib/mock-data"

export interface ResultsDashboardProps {
  data: AnalysisResult
  file: File | null
  onAnalyzeAnother: () => void
}

export function ResultsDashboard({ data, file, onAnalyzeAnother }: ResultsDashboardProps) {
  return (
    <div className="w-full flex flex-col gap-12 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <DashboardHeader onAnalyzeAnother={onAnalyzeAnother} />
      
      {/* Top Section: Video & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <VideoSummary file={file} />
        </div>
        <div className="lg:col-span-2">
          <ScoreOverview score={data.overallScore} insight={data.overallInsight} />
        </div>
      </div>

      {/* Key Insights */}
      <InsightGrid data={data} />

      {/* Main Analysis Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Recommendations & Deep Dives */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          <PlatformRecommendation data={data} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TrendMatch data={data} />
            <HookAnalysis data={data} />
          </div>
          
          <Recommendations data={data} />
        </div>
        
        {/* Right Column: Actions & Context */}
        <div className="lg:col-span-1 flex flex-col gap-12">
          <BestMove data={data} />
          <ContentSummary data={data} />
        </div>
      </div>
    </div>
  )
}
