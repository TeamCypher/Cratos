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
import { AiContent } from "./ai-content"
import { ContentSummary } from "./content-summary"
import { AnalysisResult } from "@/lib/mock-data"
import { AnalysisReport } from "@/types/api"

export interface ResultsDashboardProps {
  report: AnalysisReport
  file: File | null
  onAnalyzeAnother: () => void
}

function mapReportToUI(report: AnalysisReport): AnalysisResult {
  const sortedPredictions = [...(report.predictions || [])].sort((a, b) => b.score - a.score);
  const bestPred = sortedPredictions[0] || { platform: "Unknown", score: 0, confidence: 0 };
  const otherPreds = sortedPredictions.slice(1);

  const hookScore = report.content_profile?.hook_score || 80;
  let hookStatus: "success" | "warning" | "error" | "neutral" = "neutral";
  let hookLabel = "Average";
  if (hookScore >= 85) { hookStatus = "success"; hookLabel = "Strong"; }
  else if (hookScore >= 70) { hookStatus = "warning"; hookLabel = "Moderate"; }
  else { hookStatus = "error"; hookLabel = "Weak"; }

  const trendScore = report.trend_signal?.score || 80;
  const overallScore = Math.round((bestPred.score + hookScore + trendScore) / 3);

  const directionStr = (report.trend_signal?.direction || "").toLowerCase();
  let trendStatus: "rising" | "stable" | "falling" = "stable";
  if (directionStr.includes("up") || directionStr.includes("ris")) {
    trendStatus = "rising";
  } else if (directionStr.includes("down") || directionStr.includes("fall")) {
    trendStatus = "falling";
  }

  return {
    overallScore: overallScore || 85,
    overallInsight: `Strong potential on ${bestPred.platform} with room to improve.`,
    trendMatch: trendScore,
    hookStrength: hookScore,
    audienceFit: 85, // Static fallback since API doesn't provide specific fit score
    contentQuality: 90, // Static fallback
    bestPlatform: { 
      name: bestPred.platform, 
      score: bestPred.score, 
      fit: "Best fit" 
    },
    otherPlatforms: otherPreds.map(p => ({
      name: p.platform,
      score: p.score,
      fit: "Good fit"
    })),
    trendStatus: trendStatus,
    trendInsight: `Aligns with ${report.trend_signal?.momentum?.toLowerCase() || 'current'} momentum trends.`,
    hookStatus,
    hookLabel,
    hookInsight: "Your opening creates curiosity.",
    bestMove: { 
      insight: "Publish while this topic is gaining momentum.", 
      platform: report.recommendation?.platform || bestPred.platform, 
      time: report.recommendation?.best_time || "Peak Hours", 
      trend: trendStatus 
    },
    recommendations: (report.recommendation?.optimization || []).map((opt, i) => ({
      id: i + 1,
      title: `Optimization ${i+1}`,
      explanation: opt,
      priority: i === 0
    })),
    contentSummary: { 
      topic: report.content_profile?.topic || "Unknown Topic", 
      tone: report.content_profile?.emotion || "Neutral", 
      format: report.content_profile?.category || "General", 
      audience: report.content_profile?.audience || "General Audience"
    },
    videoDescription: report.recommendation?.video_description,
    hashtags: report.recommendation?.hashtags,
    captions: report.recommendation?.caption,
    titleVariations: report.recommendation?.title,
  }
}

export function ResultsDashboard({ report, file, onAnalyzeAnother }: ResultsDashboardProps) {
  const data = React.useMemo(() => mapReportToUI(report), [report])

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

      {/* AI Generated Content Assets */}
      <AiContent data={data} />

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
