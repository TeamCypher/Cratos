"use client"

import * as React from "react"
import { Navbar } from "@/components/navigation/Navbar"
import { VibeCheckHeader } from "@/components/vibe-check/vibe-check-header"
import { TopSummary } from "@/components/vibe-check/top-summary"
import { TrendFilter, TrendDirectionFilter, TrendCategoryFilter } from "@/components/vibe-check/trend-filter"
import { TrendList } from "@/components/vibe-check/trend-list"
import { TrendDetail } from "@/components/vibe-check/trend-detail"
import { mockTrends, mockVibeCheckSummary, Trend } from "@/lib/mock-data"
import { Loader2 } from "lucide-react"

export default function VibeCheckPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [directionFilter, setDirectionFilter] = React.useState<TrendDirectionFilter>("All")
  const [categoryFilter, setCategoryFilter] = React.useState<TrendCategoryFilter>("All")
  const [selectedTrend, setSelectedTrend] = React.useState<Trend | null>(null)
  
  // Simulate loading state
  const [isLoading, setIsLoading] = React.useState(true)
  
  React.useEffect(() => {
    // Simulate network request
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Auto-select first trend if available
      if (mockTrends.length > 0) {
        setSelectedTrend(mockTrends[0])
      }
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  // Filter logic
  const filteredTrends = React.useMemo(() => {
    return mockTrends.filter((trend) => {
      const matchesSearch = trend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            trend.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDirection = directionFilter === "All" || 
                               trend.direction.toLowerCase() === directionFilter.toLowerCase()
      
      const matchesCategory = categoryFilter === "All" || 
                              trend.category.toLowerCase() === categoryFilter.toLowerCase()
      
      return matchesSearch && matchesDirection && matchesCategory
    })
  }, [searchQuery, directionFilter, categoryFilter])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 max-w-7xl">
        <VibeCheckHeader />
        
        {isLoading ? (
          <div className="w-full py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading trend intelligence...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <TopSummary data={mockVibeCheckSummary} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
              
              {/* Left Column: Filters and List */}
              <div className="lg:col-span-4 flex flex-col gap-2">
                <TrendFilter 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  directionFilter={directionFilter}
                  setDirectionFilter={setDirectionFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                />
                
                <TrendList 
                  trends={filteredTrends} 
                  selectedTrendId={selectedTrend?.id || null} 
                  onSelectTrend={setSelectedTrend} 
                />
              </div>

              {/* Right Column: Detailed View */}
              <div className="lg:col-span-8">
                <div className="sticky top-24">
                  <TrendDetail trend={selectedTrend} />
                </div>
              </div>
              
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
