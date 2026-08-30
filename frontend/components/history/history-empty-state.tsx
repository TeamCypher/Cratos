"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FolderSearch, SearchX } from "lucide-react"

export interface HistoryEmptyStateProps {
  isSearchEmpty: boolean
  onClearFilters: () => void
}

export function HistoryEmptyState({ isSearchEmpty, onClearFilters }: HistoryEmptyStateProps) {
  if (isSearchEmpty) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-card/20 rounded-3xl border border-dashed dark:border-white/10 border-black/10">
        <div className="w-16 h-16 rounded-full dark:bg-white/5 bg-black/5 flex items-center justify-center mb-6">
          <SearchX className="w-8 h-8 text-muted-foreground opacity-70" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No analyses found</h3>
        <p className="text-muted-foreground max-w-sm mb-8">
          Try a different search or clear your filters to see more results.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-card/20 rounded-3xl border border-dashed dark:border-white/10 border-black/10">
      <div className="w-20 h-20 rounded-full dark:bg-white/5 bg-black/5 flex items-center justify-center mb-6">
        <FolderSearch className="w-10 h-10 text-primary/70" />
      </div>
      <h3 className="text-3xl font-bold text-foreground mb-4">No analyses yet</h3>
      <p className="text-muted-foreground text-lg max-w-md mb-10">
        Upload your first video to start building your content intelligence history.
      </p>
      <Link href="/">
        <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/20">
          Analyze Your First Video
        </Button>
      </Link>
    </div>
  )
}
