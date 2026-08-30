"use client"

import * as React from "react"
import { Navbar } from "@/components/navigation/Navbar"
import { ResultsDashboard } from "@/components/dashboard/results-dashboard"
import { mockAnalysisResult } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export default function ResultsDynamicPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  // When 'Analyze Another' is clicked from the History view,
  // we route them back to the home page (Upload flow).
  const handleAnalyzeAnother = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 max-w-6xl flex flex-col justify-center">
        <ResultsDashboard 
          data={mockAnalysisResult} 
          file={null} // We don't have the original local File object in history
          onAnalyzeAnother={handleAnalyzeAnother} 
        />
      </main>
    </div>
  )
}
