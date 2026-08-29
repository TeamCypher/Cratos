"use client"

import * as React from "react"
import { Navbar } from "@/components/navigation/Navbar"
import { HistoryHeader } from "@/components/history/history-header"
import { HistorySummary } from "@/components/history/history-summary"
import { HistoryFilters, HistoryStatusFilter, HistoryCategoryFilter, HistorySortOption } from "@/components/history/history-filters"
import { HistoryList } from "@/components/history/history-list"
import { HistoryEmptyState } from "@/components/history/history-empty-state"
import { HistoryLoading } from "@/components/history/history-loading"
import { mockHistoryItems, mockHistorySummary } from "@/lib/mock-data"

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<HistoryStatusFilter>("All")
  const [categoryFilter, setCategoryFilter] = React.useState<HistoryCategoryFilter>("All Categories")
  const [sortBy, setSortBy] = React.useState<HistorySortOption>("Newest")
  
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleClearFilters = () => {
    setSearchQuery("")
    setStatusFilter("All")
    setCategoryFilter("All Categories")
  }

  const filteredAndSortedItems = React.useMemo(() => {
    // 1. Filter
    let result = mockHistoryItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "All" || item.trendStatus.toLowerCase() === statusFilter.toLowerCase()
      const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })

    // 2. Sort
    result = result.sort((a, b) => {
      if (sortBy === "Highest Score") {
        return b.score - a.score
      } else if (sortBy === "Lowest Score") {
        return a.score - b.score
      } else {
        // Newest (just reverse the ID order for mock data)
        return b.id.localeCompare(a.id)
      }
    })

    return result
  }, [searchQuery, statusFilter, categoryFilter, sortBy])

  const hasZeroAnalyses = mockHistoryItems.length === 0

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 max-w-5xl">
        <HistoryHeader />
        
        {hasZeroAnalyses && !isLoading ? (
          <HistoryEmptyState isSearchEmpty={false} onClearFilters={handleClearFilters} />
        ) : (
          <div className="animate-in fade-in duration-500">
            <HistorySummary data={mockHistorySummary} />
            
            <HistoryFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {isLoading ? (
              <HistoryLoading />
            ) : filteredAndSortedItems.length === 0 ? (
              <HistoryEmptyState isSearchEmpty={true} onClearFilters={handleClearFilters} />
            ) : (
              <HistoryList items={filteredAndSortedItems} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
