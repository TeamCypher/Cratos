"use client"

import * as React from "react"
import { HistoryCard } from "./history-card"
import { AnalysisHistoryItem } from "@/lib/types"

export interface HistoryListProps {
  items: AnalysisHistoryItem[]
}

export function HistoryList({ items }: HistoryListProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-bold tracking-tight text-foreground px-1 mb-2">Recent Analyses</h2>
      <div className="flex flex-col gap-4">
        {items.map(item => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
