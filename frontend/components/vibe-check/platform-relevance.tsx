"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Smartphone } from "lucide-react"

export interface PlatformRelevanceProps {
  relevance: {
    youtubeShorts: number;
    instagramReels: number;
    tiktok: number;
  }
}

export function PlatformRelevance({ relevance }: PlatformRelevanceProps) {
  
  const platforms = [
    { name: "YouTube Shorts", score: relevance.youtubeShorts },
    { name: "Instagram Reels", score: relevance.instagramReels },
    { name: "TikTok", score: relevance.tiktok }
  ].sort((a, b) => b.score - a.score)
  
  const topPlatform = platforms[0]

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">Where does this fit?</h3>
        <p className="text-sm text-muted-foreground">Platform performance alignment.</p>
      </div>
      
      <Card className="p-5 bg-card/50 dark:border-white/10 border-black/10">
        <div className="flex items-center gap-3 mb-6 p-3 dark:bg-white/5 bg-black/5 rounded-xl border dark:border-white/5 border-black/5">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-foreground font-medium leading-snug">
            <span className="font-bold text-primary">{topPlatform.name}</span> currently shows stronger alignment with this trend and your content profile.
          </p>
        </div>
        
        <div className="space-y-4">
          {platforms.map((platform, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className={`text-sm font-semibold w-1/3 truncate ${idx === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                {platform.name}
              </span>
              <div className="flex-1">
                <Progress value={platform.score} className={`h-2 ${idx === 0 ? "dark:bg-white/10 bg-black/10" : "dark:bg-black/40 bg-black/5"}`} />
              </div>
              <span className={`text-sm font-bold w-12 text-right ${idx === 0 ? "text-primary" : "text-muted-foreground"}`}>
                {platform.score}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
