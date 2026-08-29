"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { Navbar } from "@/components/navigation/Navbar"
import { FileUpload } from "@/components/upload/FileUpload"
import { ProcessingState } from "@/components/upload/ProcessingState"
import { ResultsDashboard } from "@/components/dashboard/results-dashboard"
import { mockAnalysisResult } from "@/lib/mock-data"

type AppState = "idle" | "processing" | "completed"

export default function Home() {
  const [appState, setAppState] = React.useState<AppState>("idle")
  const [activeFile, setActiveFile] = React.useState<File | null>(null)

  const handleAnalyze = (file: File) => {
    setActiveFile(file)
    // In a real app, we would upload the file to the backend here.
    // For now, we just transition to the mock processing state.
    setAppState("processing")

    // Scroll to top to ensure processing state is visible
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleProcessingComplete = () => {
    setAppState("completed")
  }

  const resetFlow = () => {
    setActiveFile(null)
    setAppState("idle")
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-12 md:py-24 max-w-6xl flex flex-col justify-center">

        {/* HERO SECTION - Only show if idle */}
        <div className={`transition-all duration-700 ease-in-out ${appState === "idle" ? 'opacity-100 transform translate-y-0 relative' : 'opacity-0 transform -translate-y-10 absolute pointer-events-none'}`}>
          <section className="flex flex-col items-center text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI-Powered Content Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.1]">
              Your content.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                ANALYZE TREND REPOST
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Upload a video and let Cratos understand where it fits, what's trending, and how you can optimize it.
            </p>
          </section>

          {/* UPLOAD SECTION */}
          <section className="w-full flex justify-center pb-24">
            <FileUpload onAnalyze={handleAnalyze} />
          </section>
        </div>

        {/* PROCESSING SECTION */}
        <div className={`w-full flex justify-center transition-all duration-700 delay-300 ease-in-out ${appState === "processing" ? 'opacity-100 transform translate-y-0 relative' : 'opacity-0 transform translate-y-10 absolute pointer-events-none'}`}>
          {appState === "processing" && (
            <ProcessingState onComplete={handleProcessingComplete} />
          )}
        </div>

        {/* RESULTS DASHBOARD */}
        <div className={`w-full flex justify-center transition-all duration-700 delay-300 ease-in-out ${appState === "completed" ? 'opacity-100 transform translate-y-0 relative' : 'opacity-0 transform translate-y-10 absolute pointer-events-none'}`}>
          {appState === "completed" && (
            <ResultsDashboard
              data={mockAnalysisResult}
              file={activeFile}
              onAnalyzeAnother={resetFlow}
            />
          )}
        </div>

      </main>
    </div>
  )
}
