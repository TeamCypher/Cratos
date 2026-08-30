"use client"

import * as React from "react"
import { Navbar } from "@/components/navigation/Navbar"
import { HistoryHeader } from "@/components/history/history-header"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-6 py-8 md:py-12 max-w-5xl">
        <HistoryHeader />
        
        <div className="w-full py-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
          <div className="text-muted-foreground w-20 h-20 mb-6 bg-muted/10 rounded-full flex items-center justify-center border-4 border-muted/20 text-4xl font-bold">
            ℹ
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">History Unavailable</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md">
            The Cratos API currently does not support persisting or retrieving past analysis history.
            Analyses exist only for the duration of your session.
          </p>
        </div>
      </main>
    </div>
  )
}
