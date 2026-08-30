"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { Badge } from "@/components/ui/badge"
import { AnalysisResult } from "@/lib/mock-data"
import { Sparkles, Copy, CheckCircle2 } from "lucide-react"

export interface AiContentProps {
  data: AnalysisResult
}

export function AiContent({ data }: AiContentProps) {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null)

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  if (!data.videoDescription && !data.titleVariations?.length && !data.hashtags?.length) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <SectionHeading title="AI-Generated Assets" description="Tailored content to boost reach and engagement." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Variations & Captions */}
        <div className="flex flex-col gap-6">
          {data.titleVariations && data.titleVariations.length > 0 && (
            <Card className="p-6 bg-card/50 dark:border-white/10 border-black/10 hover:dark:bg-white/5 bg-black/5 transition-colors">
              <h4 className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-4">Title Variations</h4>
              <div className="flex flex-col gap-3">
                {data.titleVariations.map((title, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 group cursor-pointer hover:border-primary/50 transition-all" onClick={() => handleCopy(title, `title-${i}`)}>
                    <span className="text-sm font-medium text-foreground">{title}</span>
                    {copiedSection === `title-${i}` ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {data.captions && data.captions.length > 0 && (
            <Card className="p-6 bg-card/50 dark:border-white/10 border-black/10 hover:dark:bg-white/5 bg-black/5 transition-colors">
              <h4 className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-4">Suggested Captions</h4>
              <div className="flex flex-col gap-3">
                {data.captions.map((cap, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 group cursor-pointer hover:border-primary/50 transition-all" onClick={() => handleCopy(cap, `caption-${i}`)}>
                    <span className="text-sm font-medium text-foreground">{cap}</span>
                    {copiedSection === `caption-${i}` ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Video Description & Hashtags */}
        <div className="flex flex-col gap-6">
          {data.videoDescription && (
            <Card className="p-6 bg-card/50 dark:border-white/10 border-black/10 hover:dark:bg-white/5 bg-black/5 transition-colors flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">Video Description</h4>
                <button 
                  onClick={() => data.videoDescription && handleCopy(data.videoDescription, 'description')}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedSection === 'description' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'description' ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="p-4 rounded-lg dark:bg-black/40 bg-white/40 border dark:border-white/5 border-black/5 flex-1 font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {data.videoDescription}
              </div>
            </Card>
          )}

          {data.hashtags && data.hashtags.length > 0 && (
            <Card className="p-6 bg-card/50 dark:border-white/10 border-black/10 hover:dark:bg-white/5 bg-black/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-primary/70 uppercase tracking-wider">Viral Hashtags</h4>
                <button 
                  onClick={() => data.hashtags && handleCopy(data.hashtags.join(' '), 'hashtags')}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedSection === 'hashtags' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSection === 'hashtags' ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.hashtags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="px-2.5 py-1 text-xs font-medium dark:bg-white/10 bg-black/10 hover:bg-primary/20 transition-colors cursor-pointer" onClick={() => handleCopy(tag, `hashtag-${i}`)}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
