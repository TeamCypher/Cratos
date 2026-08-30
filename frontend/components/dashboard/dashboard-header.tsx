"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

import { CratosLogo } from "@/components/CratosLogo"

export interface DashboardHeaderProps {
  onAnalyzeAnother: () => void
}

export function DashboardHeader({ onAnalyzeAnother }: DashboardHeaderProps) {
  return (
    <header className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/50">
      <div>
        <div className="flex items-center gap-4">
          <CratosLogo width={32} height={32} iconOnly imageClassName="rounded-lg shadow-md shadow-primary/10" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-pixel">Cratos Intel</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Here's what your content is telling us.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild variant="outline" className="font-semibold shadow-sm hover:dark:bg-white/5 bg-black/5 transition-colors">
          <Link href="/history">
            View History
          </Link>
        </Button>
        <Button onClick={onAnalyzeAnother} variant="default" className="font-semibold shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Analyze Another
        </Button>
      </div>
    </header>
  )
}
