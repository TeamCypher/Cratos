"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export type HistoryStatusFilter = "All" | "Rising" | "Stable" | "Falling"
export type HistoryCategoryFilter = "All Categories" | "Technology" | "Entertainment" | "Education" | "Lifestyle" | "Business"
export type HistorySortOption = "Newest" | "Highest Score" | "Lowest Score"

export interface HistoryFiltersProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  statusFilter: HistoryStatusFilter
  setStatusFilter: (f: HistoryStatusFilter) => void
  categoryFilter: HistoryCategoryFilter
  setCategoryFilter: (f: HistoryCategoryFilter) => void
  sortBy: HistorySortOption
  setSortBy: (s: HistorySortOption) => void
}

export function HistoryFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy
}: HistoryFiltersProps) {

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card/30 p-4 border dark:border-white/5 border-black/5 rounded-2xl">
      
      {/* Search */}
      <div className="relative w-full md:max-w-xs flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search your analyses..."
          className="pl-9 h-10 dark:bg-black/40 bg-black/5 dark:border-white/10 border-black/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters Container */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <select 
          className="h-10 px-3 py-2 dark:bg-black/40 bg-black/5 border dark:border-white/10 border-black/10 rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as HistoryStatusFilter)}
        >
          <option value="All">All Statuses</option>
          <option value="Rising">High Score</option>
          <option value="Rising">Rising</option>
          <option value="Stable">Stable</option>
          <option value="Falling">Falling</option>
        </select>

        {/* Category Filter */}
        <select 
          className="h-10 px-3 py-2 dark:bg-black/40 bg-black/5 border dark:border-white/10 border-black/10 rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as HistoryCategoryFilter)}
        >
          <option value="All Categories">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Business">Business</option>
        </select>

        {/* Sort */}
        <select 
          className="h-10 px-3 py-2 dark:bg-black/40 bg-black/5 border dark:border-white/10 border-black/10 rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as HistorySortOption)}
        >
          <option value="Newest">Newest</option>
          <option value="Highest Score">Highest Score</option>
          <option value="Lowest Score">Lowest Score</option>
        </select>
      </div>

    </div>
  )
}
