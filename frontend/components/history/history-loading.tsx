"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"

export function HistoryLoading() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      <div className="h-6 w-40 dark:bg-white/5 bg-black/5 rounded-md mb-2"></div>
      
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4 md:p-5 bg-card/20 dark:border-white/5 border-black/5 flex flex-col md:flex-row gap-5 items-start md:items-center">
          {/* Thumbnail Skeleton */}
          <div className="w-full md:w-40 h-48 md:h-28 shrink-0 rounded-xl dark:bg-white/5 bg-black/5"></div>
          
          {/* Meta Info Skeleton */}
          <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
            <div className="h-7 w-3/4 max-w-sm dark:bg-white/10 bg-black/10 rounded-md"></div>
            <div className="flex gap-2">
              <div className="h-4 w-24 dark:bg-white/5 bg-black/5 rounded-md"></div>
              <div className="h-4 w-20 dark:bg-white/5 bg-black/5 rounded-full"></div>
            </div>
            <div className="flex gap-2 mt-2">
              <div className="h-6 w-28 dark:bg-white/5 bg-black/5 rounded-full"></div>
              <div className="h-6 w-20 dark:bg-white/5 bg-black/5 rounded-full"></div>
            </div>
          </div>
          
          {/* Score & Action Skeleton */}
          <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:items-end gap-4 shrink-0 pl-0 md:pl-4 border-t md:border-t-0 md:border-l dark:border-white/5 border-black/5 pt-4 md:pt-0">
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="h-8 w-24 dark:bg-white/10 bg-black/10 rounded-md"></div>
              <div className="h-3 w-28 dark:bg-white/5 bg-black/5 rounded-md"></div>
            </div>
            <div className="h-10 w-full md:w-32 dark:bg-white/5 bg-black/5 rounded-md"></div>
          </div>
        </Card>
      ))}
    </div>
  )
}
