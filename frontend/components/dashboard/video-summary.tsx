"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { FileVideo } from "lucide-react"

export interface VideoSummaryProps {
  file: File | null
}

export function VideoSummary({ file }: VideoSummaryProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      const d = videoRef.current.duration
      if (d && !isNaN(d)) {
        const mins = Math.floor(d / 60)
        const secs = Math.floor(d % 60)
        setDuration(`${mins}:${secs.toString().padStart(2, '0')}`)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full overflow-hidden bg-card/50 dark:border-white/10 border-black/10 flex flex-col shadow-sm">
      <div className="relative w-full aspect-video bg-black flex items-center justify-center border-b dark:border-white/10 border-black/10">
        {previewUrl ? (
          <video 
            ref={videoRef}
            src={previewUrl} 
            className="w-full h-full object-contain"
            controls
            onLoadedMetadata={onLoadedMetadata}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <FileVideo className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm">Mock Video</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col gap-1">
        <h3 className="font-bold text-foreground truncate" title={file?.name || "mock-video.mp4"}>
          {file?.name || "mock-video.mp4"}
        </h3>
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
          <span>{file ? formatFileSize(file.size) : "12.4 MB"}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>{file?.type || "video/mp4"}</span>
          {duration && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span>{duration}</span>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
