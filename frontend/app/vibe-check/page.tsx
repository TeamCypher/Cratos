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

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 md:py-16 max-w-5xl">
        <VibeCheckHeader />
        
        {isLoading ? (
          <div className="w-full py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading trend intelligence...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700 flex flex-col gap-16 md:gap-24 mt-12">
            
            {/* 1. What's Happening Summary */}
            <section>
              <TopSummary data={mockVibeCheckSummary} />
            </section>
            
            {/* 2. Discover Trends Filters */}
            <section className="scroll-m-20">
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Discover Trends</h2>
                <p className="text-muted-foreground mt-2 text-lg">Search and filter the latest movements in your niche.</p>
              </div>
              <TrendFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                directionFilter={directionFilter}
                setDirectionFilter={setDirectionFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            </section>
            
            {/* 3. Trending Now List */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Trending Now</h2>
                <p className="text-muted-foreground mt-2 text-lg">Explore topics currently gaining attention.</p>
              </div>
              <TrendList 
                trends={filteredTrends} 
                selectedTrendId={selectedTrend?.id || null} 
                onSelectTrend={setSelectedTrend} 
              />
            </section>

            {/* 4. Selected Trend Details */}
            <section className="pt-8 border-t border-border">
              <TrendDetail trend={selectedTrend} />
            </section>
            
          </div>
        )}
      </main>
    </div>
  )
}
