"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HistoryHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border/50">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3 font-pixel">
          History
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Revisit your previous content intelligence.
        </p>
      </div>
      
      <Link href="/">
        <Button size="lg" className="font-semibold shadow-lg shadow-primary/20">
          Analyze New Video
        </Button>
      </Link>
    </header>
  )
}
