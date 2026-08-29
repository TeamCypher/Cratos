"use client"

import * as React from "react"
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const STAGES = [
  "Uploading your content",
  "Understanding visual & audio context",
  "Detecting relevant trends",
  "Building your publishing strategy"
]

export interface ProcessingStateProps {
  onComplete: () => void
}

export function ProcessingState({ onComplete }: ProcessingStateProps) {
  const [currentStage, setCurrentStage] = React.useState(0)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    // Total duration of mock processing is roughly 6 seconds
    const intervalTime = 60 // ms
    const totalTime = 6000 // ms
    const increment = (100 / (totalTime / intervalTime))

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        
        // Update stages based on progress
        if (next >= 100) {
          setCurrentStage(4)
          clearInterval(timer)
          setTimeout(onComplete, 500) // Delay before firing complete
          return 100
        } else if (next >= 75) {
          setCurrentStage(3)
        } else if (next >= 50) {
          setCurrentStage(2)
        } else if (next >= 25) {
          setCurrentStage(1)
        }
        
        return next
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden bg-card/80 backdrop-blur-md border-white/10 shadow-2xl p-8 md:p-12 relative">
      {/* Glowing accent top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
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
          <span className="text-muted-foreground">{currentStage + 1} of 4</span>
        </div>
        <Progress value={progress} className="h-2 bg-white/5" />
      </div>

      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isComplete = index < currentStage
          const isActive = index === currentStage
          const isPending = index > currentStage

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
    </Card>
  )
}
