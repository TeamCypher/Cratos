"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export type TrendDirectionFilter = "All" | "Rising" | "Stable" | "Falling"
export type TrendCategoryFilter = "All" | "Technology" | "Entertainment" | "Education" | "Lifestyle" | "Business"

export interface TrendFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  directionFilter: TrendDirectionFilter
  setDirectionFilter: (filter: TrendDirectionFilter) => void
  categoryFilter: TrendCategoryFilter
  setCategoryFilter: (filter: TrendCategoryFilter) => void
}

export function TrendFilter({
  searchQuery,
  setSearchQuery,
  directionFilter,
  setDirectionFilter,
  categoryFilter,
  setCategoryFilter,
}: TrendFilterProps) {
  
  const directions: TrendDirectionFilter[] = ["All", "Rising", "Stable", "Falling"]
  const categories: TrendCategoryFilter[] = ["All", "Technology", "Entertainment", "Education", "Lifestyle", "Business"]

  return (
    <div className="flex flex-col gap-6 mb-8 p-6 bg-card/30 border dark:border-white/5 border-black/5 rounded-2xl">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search trends..."
          className="pl-10 dark:bg-black/40 bg-black/5 dark:border-white/10 border-black/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">Momentum:</span>
          {directions.map((d) => (
            <button
              key={d}
              onClick={() => setDirectionFilter(d)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                directionFilter === d 
                  ? "bg-primary text-primary-foreground" 
                  : "dark:bg-white/5 bg-black/5 text-muted-foreground hover:dark:bg-white/10 bg-black/10"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 shrink-0">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === c 
                  ? "bg-secondary text-secondary-foreground" 
                  : "dark:bg-white/5 bg-black/5 text-muted-foreground hover:dark:bg-white/10 bg-black/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
