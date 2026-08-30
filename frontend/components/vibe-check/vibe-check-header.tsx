"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

export function VibeCheckHeader() {
  return (
    <header className="mb-10 pb-6 border-b border-border/50">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
        Vibe Check
      </h1>
      <p className="text-lg md:text-xl text-foreground font-medium mb-2">
        See what's gaining momentum and where your content fits.
      </p>
      <p className="text-muted-foreground flex items-center gap-1.5 text-sm md:text-base">

        Discover rising topics, understand their momentum and find opportunities worth creating around.
      </p>
    </header>
  )
}
