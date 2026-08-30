"use client"

import * as React from "react"
import { Navbar } from "@/components/navigation/Navbar"
import { ResultsDashboard } from "@/components/dashboard/results-dashboard"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api/client"
import { AnalysisReport } from "@/types/api"
import { Loader2 } from "lucide-react"

export default function ResultsDynamicPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [report, setReport] = React.useState<AnalysisReport | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  
  const [loadingText, setLoadingText] = React.useState("Loading Cratos Intel...")
  
  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (isLoading) {
      timer = setTimeout(() => {
        setLoadingText("Reconnecting to Gemini API...")
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [isLoading])

  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        const fetchedReport = await api.getVideoReport(params.id)
        setReport(fetchedReport)
      } catch (err: any) {
        setErrorMsg("Failed to load analysis report.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchReport()
  }, [params.id])

  const handleAnalyzeAnother = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 max-w-6xl flex flex-col justify-center">
        {isLoading ? (
          <div className="w-full py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">{loadingText}</p>
          </div>
        ) : errorMsg || !report ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="text-destructive w-20 h-20 mb-6 bg-destructive/10 rounded-full flex items-center justify-center border-4 border-destructive/20 text-4xl font-bold">
              !
            </div>
            <h2 className="text-3xl font-bold text-destructive mb-4">Intel Unavailable</h2>
            <p className="text-muted-foreground font-medium text-lg max-w-md">
              {errorMsg || "The analysis report could not be found."}
            </p>
            <button 
              onClick={handleAnalyzeAnother}
              className="mt-8 px-6 py-3 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Analyze Another Video
            </button>
          </div>
        ) : (
          <ResultsDashboard 
            report={report} 
            file={null}
            onAnalyzeAnother={handleAnalyzeAnother} 
          />
        )}
      </main>
    </div>
  )
}
