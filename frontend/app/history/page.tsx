"use client"

import * as React from "react"
import { Navbar } from "@/components/navigation/Navbar"
import { HistoryHeader } from "@/components/history/history-header"
import { HistoryList } from "@/components/history/history-list"
import { HistorySummary } from "@/components/history/history-summary"
import { HistoryEmptyState } from "@/components/history/history-empty-state"
import { useHistory } from "@/lib/history-context"

export default function HistoryPage() {
  const { historyItems } = useHistory()

  // Calculate summary stats dynamically
  const totalAnalyses = historyItems.length
  const averageScore = totalAnalyses > 0 
    ? Math.round(historyItems.reduce((acc, item) => acc + item.score, 0) / totalAnalyses) 
    : 0
  const risingOpportunities = historyItems.filter(item => item.trendStatus === 'rising').length
  
  // Find top platform
  const platformCounts: Record<string, number> = {}
  let topPlatform = "N/A"
  let maxCount = 0
  historyItems.forEach(item => {
    platformCounts[item.bestPlatform] = (platformCounts[item.bestPlatform] || 0) + 1
    if (platformCounts[item.bestPlatform] > maxCount) {
      maxCount = platformCounts[item.bestPlatform]
      topPlatform = item.bestPlatform
    }
  })

  const summaryData = {
    totalAnalyses,
    averageScore,
    risingOpportunities,
    topPlatform
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 max-w-5xl">
        <HistoryHeader />
        
        {historyItems.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <HistorySummary data={summaryData} />
            <HistoryList items={historyItems} />
          </div>
        ) : (
          <HistoryEmptyState />
        )}
      </main>
    </div>
  )
}
