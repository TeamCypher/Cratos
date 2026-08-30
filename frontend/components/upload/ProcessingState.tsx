"use client"

import * as React from "react"
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { api } from "@/lib/api/client"
import { AnalysisStatusString } from "@/types/api"

const STAGES = [
  "Waiting",
  "Checking your video",
  "Processing video",
  "Understanding your content",
  "Checking current trends",
  "Comparing platforms",
  "Building your strategy",
  "Analysis complete"
]

const STATUS_STAGE_MAP: Record<AnalysisStatusString, number> = {
  QUEUED: 0,
  RETRY_REQUESTED: 0,
  VALIDATING: 1,
  PROCESSING_MEDIA: 2,
  AI_ANALYSIS: 3,
  TREND_ANALYSIS: 4,
  SCORING: 5,
  RECOMMENDING: 6,
  COMPLETED: 7,
  FAILED: -1
}

export interface ProcessingStateProps {
  jobId: string
  onComplete: (videoId: string) => void
}

export function ProcessingState({ jobId, onComplete }: ProcessingStateProps) {
  const [currentStage, setCurrentStage] = React.useState(0)
  const [progress, setProgress] = React.useState(0)
  const [hasFailed, setHasFailed] = React.useState(false)
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (hasFailed) return

    const startTime = Date.now()
    const TIMEOUT_MS = 2 * 60 * 1000 // 2 minutes
    
    let timer: NodeJS.Timeout | null = null

    const poll = async () => {
      if (Date.now() - startTime > TIMEOUT_MS) {
        setHasFailed(true)
        setErrorMsg("Analysis request timed out. Please try again.")
        return
      }

      try {
        const response = await api.getAnalysisStatus(jobId)
        
        if (response.status === "FAILED") {
          setHasFailed(true)
          return
        }

        const stageIndex = STATUS_STAGE_MAP[response.status] || 0
        setCurrentStage(stageIndex)
        
        // Use backend progress if available, otherwise fake it based on stage
        if (response.progress !== undefined) {
          setProgress(response.progress)
        } else {
          // Fallback progress: stage / total stages * 100
          const calcProgress = Math.min(100, Math.round((stageIndex / (STAGES.length - 1)) * 100))
          setProgress(calcProgress)
        }

        if (response.status === "COMPLETED" && response.video_id) {
          if (timer) clearInterval(timer)
          setTimeout(() => onComplete(response.video_id!), 500)
        }
      } catch (err: any) {
        console.error("Polling error", err)
        setErrorMsg("Failed to connect to analysis service.")
      }
    }

    // Initial poll
    poll()
    
    // Poll every 2.5s
    timer = setInterval(poll, 2500)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [jobId, onComplete, hasFailed])

  const handleRetry = async () => {
    setIsRetrying(true)
    setErrorMsg(null)
    try {
      await api.retryAnalysis(jobId)
      setHasFailed(false)
      setCurrentStage(0)
      setProgress(0)
    } catch (err: any) {
      setErrorMsg("Failed to retry analysis.")
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden bg-card/80 backdrop-blur-md dark:border-white/10 border-black/10 shadow-2xl p-8 md:p-12 relative">
      {/* Glowing accent top */}
      <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${hasFailed ? 'bg-destructive' : 'bg-gradient-to-r from-transparent via-primary to-transparent'}`}></div>
      
      {hasFailed ? (
        <div className="flex flex-col items-center mb-10 animate-in fade-in zoom-in duration-500">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-destructive/10 border-4 border-destructive/20">
            <CheckCircle2 className="w-10 h-10 text-destructive" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-destructive mb-2 text-center">
            Analysis Failed
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {errorMsg || "An unexpected error occurred while analyzing your video."}
          </p>

          <button 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="px-8 py-3 rounded-full font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isRetrying ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Retrying...
              </span>
            ) : "Retry Analysis"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 dark:border-white/5 border-black/5 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
              Analyzing your content...
            </h2>
            <p className="text-muted-foreground text-center">
              This usually takes a few seconds. Do not close this page.
            </p>
          </div>

          <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2 text-sm font-medium">
              <span className="text-primary">{Math.round(progress)}%</span>
              <span className="text-muted-foreground">{Math.min(currentStage + 1, STAGES.length)} of {STAGES.length}</span>
            </div>
            <Progress value={progress} className="h-2 dark:bg-white/5 bg-black/5" />
          </div>

          <div className="space-y-4">
            {STAGES.map((stage, index) => {
              const isComplete = index < currentStage
              const isActive = index === currentStage

              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-500
                    ${isActive ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'}
                  `}
                >
                  <div className="shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : isActive ? (
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    ) : (
                      <CircleDashed className="w-6 h-6 text-muted-foreground/50" />
                    )}
                  </div>
                  <span className={`text-sm md:text-base font-medium transition-colors duration-500
                    ${isComplete ? 'text-foreground' : isActive ? 'text-primary' : 'text-muted-foreground/50'}
                  `}>
                    {stage}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </Card>
  )
}
