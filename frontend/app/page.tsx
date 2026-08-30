"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { CratosLogo } from "@/components/CratosLogo"
import { Navbar } from "@/components/navigation/Navbar"
import { FileUpload } from "@/components/upload/FileUpload"
import { ProcessingState } from "@/components/upload/ProcessingState"
import { ResultsDashboard } from "@/components/dashboard/results-dashboard"
import { api } from "@/lib/api/client"

type AppState = "idle" | "processing" | "completed"

export default function Home() {
  const [appState, setAppState] = React.useState<AppState>("idle")
  const [activeFile, setActiveFile] = React.useState<File | null>(null)
  const [jobId, setJobId] = React.useState<string | null>(null)
  const [report, setReport] = React.useState<any | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  const handleAnalyze = async (file: File) => {
    setActiveFile(file)
    setIsUploading(true)
    setUploadError(null)

    try {
      const response = await api.uploadVideo(file)
      setJobId(response.job_id)
      setAppState("processing")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      console.error("Upload failed", err)
      setUploadError(err.message || "Failed to upload video")
      setActiveFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleProcessingComplete = async (videoId: string) => {
    try {
      const fetchedReport = await api.getVideoReport(videoId)
      setReport(fetchedReport)
      setAppState("completed")
    } catch (err: any) {
      console.error("Failed to fetch report", err)
      // In a real app we might want to handle this explicitly, 
      // but for MVP we will fallback to processing state with an error or handle gracefully.
      setUploadError("Processing completed, but failed to fetch the report.")
      setAppState("idle")
    }
  }

  const resetFlow = () => {
    setActiveFile(null)
    setJobId(null)
    setReport(null)
    setUploadError(null)
    setAppState("idle")
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/cratos_homepage.mp4"
          className="w-full h-full object-cover motion-reduce:hidden"
        />
        {/* Overlay to ensure readability and maintain dark theme aesthetic */}
        <div className="absolute inset-0 bg-background/70 dark:bg-[#090D0A]/75 backdrop-blur-[2px]" />
      </div>

      {/* Wrap Navbar in a relative container with high z-index to ensure it sits above the video */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative flex-1 container mx-auto px-6 py-12 md:py-24 max-w-6xl flex flex-col justify-center z-10">

        {/* HERO SECTION - Only show if idle */}
        <div className={`transition-all duration-700 ease-in-out ${appState === "idle" ? 'opacity-100 transform translate-y-0 relative' : 'opacity-0 transform -translate-y-10 absolute pointer-events-none'}`}>
          <section className="flex flex-col items-center text-center mb-16 space-y-6">
            <CratosLogo 
              iconOnly 
              width={320} 
              height={320} 
              imageClassName="w-[180px] h-[180px] md:w-[260px] md:h-[260px] lg:w-[320px] lg:h-[320px] drop-shadow-[0_0_35px_rgba(203,255,0,0.15)] mb-6" 
            />
            
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
            <div className="w-full">
              {uploadError && (
                <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-center font-medium max-w-3xl mx-auto border border-destructive/20">
                  {uploadError}
                </div>
              )}
              <FileUpload onAnalyze={handleAnalyze} disabled={isUploading} />
            </div>
          </section>
        </div>

        {/* PROCESSING SECTION */}
        <div className={`w-full flex justify-center transition-all duration-700 delay-300 ease-in-out ${appState === "processing" ? 'opacity-100 transform translate-y-0 relative' : 'opacity-0 transform translate-y-10 absolute pointer-events-none'}`}>
          {appState === "processing" && jobId && (
            <ProcessingState jobId={jobId} onComplete={handleProcessingComplete} />
          )}
        </div>

        {/* RESULTS DASHBOARD */}
        <div className={`w-full flex justify-center transition-all duration-700 delay-300 ease-in-out ${appState === "completed" ? 'opacity-100 transform translate-y-0 relative' : 'opacity-0 transform translate-y-10 absolute pointer-events-none'}`}>
          {appState === "completed" && report && (
            <ResultsDashboard
              report={report}
              file={activeFile}
              onAnalyzeAnother={resetFlow}
            />
          )}
        </div>

      </main>
    </div>
  )
}
