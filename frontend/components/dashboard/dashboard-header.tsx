"use client"

import * as React from "react"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface DashboardHeaderProps {
  onAnalyzeAnother: () => void
}

export function DashboardHeader({ onAnalyzeAnother }: DashboardHeaderProps) {
  return (
    <header className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/50">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Cratos Intel</h1>
        </div>
        <p className="text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          Here's what your content is telling us.
        </p>
      </div>

      <Button onClick={onAnalyzeAnother} variant="outline" className="font-semibold shadow-sm hover:dark:bg-white/5 bg-black/5 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Analyze Another
      </Button>
    </header>
  )
}
