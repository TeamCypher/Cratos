"use client"

import * as React from "react"
import { Upload, FileVideo, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const MAX_FILE_SIZE_MB = 100
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const SUPPORTED_FORMATS = ["video/mp4", "video/quicktime", "video/webm"]

export interface FileUploadProps {
  onAnalyze: (file: File) => void
  disabled?: boolean
}

export function FileUpload({ onAnalyze, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = React.useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    setError(null)
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError("Unsupported file type")
      return false
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("That video is too large")
      return false
    }
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        handleFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        handleFileSelect(file)
      }
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    setDuration(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const onVideoLoadedMetadata = () => {
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

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 md:p-16 border-destructive/20 bg-destructive/5 text-center w-full max-w-3xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{error}</h3>
        <p className="text-muted-foreground mb-8 text-sm">Please ensure your video is an MP4, MOV, or WebM under {MAX_FILE_SIZE_MB}MB.</p>
        <Button onClick={clearFile} variant="outline" className="border-destructive/30 hover:bg-destructive/10">
          Try another video
        </Button>
      </Card>
    )
  }

  if (selectedFile && previewUrl) {
    return (
      <Card className="w-full max-w-3xl mx-auto overflow-hidden bg-card/50 backdrop-blur-sm dark:border-white/10 border-black/10">
        <div className="p-6 md:p-8 flex flex-col items-center">
          <div className="relative w-full max-w-xl aspect-[9/16] md:aspect-video bg-black rounded-xl overflow-hidden border dark:border-white/10 border-black/10 shadow-2xl mb-8">
            <video 
              ref={videoRef}
              src={previewUrl} 
              className="w-full h-full object-contain"
              controls
              onLoadedMetadata={onVideoLoadedMetadata}
            />
            <button 
              onClick={clearFile}
              className="absolute top-4 right-4 p-2 rounded-full dark:bg-black/60 bg-black/10 hover:bg-destructive/80 dark:text-white text-foreground backdrop-blur-md transition-colors z-10"
              aria-label="Remove video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="w-full max-w-xl flex flex-col md:flex-row items-center justify-between gap-6 dark:bg-white/5 bg-black/5 p-4 rounded-xl border dark:border-white/5 border-black/5 mb-8">
            <div className="flex items-center gap-4 w-full overflow-hidden">

              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground truncate">{selectedFile.name}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  {duration && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                      <span>{duration}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFile}
              className="shrink-0 hidden md:inline-flex"
            >
              Change
            </Button>
          </div>

          <Button 
            size="lg" 
            className="w-full max-w-xl text-lg font-bold py-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
            onClick={() => onAnalyze(selectedFile)}
            disabled={disabled}
          >
            {disabled ? "Uploading..." : "Analyze Video"}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto group relative">
      <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl transition-opacity opacity-0 group-hover:opacity-100 duration-700 pointer-events-none"></div>
      
      <div 
        className={`relative flex flex-col items-center justify-center p-12 md:p-20 rounded-3xl border-2 border-dashed transition-all duration-300 w-full ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${dragActive && !disabled ? "border-[#DFFF00] bg-[#DFFF00]/5 shadow-[0_0_35px_rgba(223,255,0,0.4)]" : "border-white/15 bg-card/50 hover:bg-card/80 hover:border-white/25 shadow-[0_0_15px_rgba(223,255,0,0.15),_0_0_30px_rgba(223,255,0,0.05)] hover:shadow-[0_0_20px_rgba(223,255,0,0.25),_0_0_40px_rgba(223,255,0,0.1)]"}
        `}
        onDragEnter={disabled ? undefined : handleDrag}
        onDragLeave={disabled ? undefined : handleDrag}
        onDragOver={disabled ? undefined : handleDrag}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => { if (!disabled) inputRef.current?.click() }}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept={SUPPORTED_FORMATS.join(",")} 
          className="hidden" 
          disabled={disabled}
          onChange={handleChange}
        />
        
        <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center border transition-all duration-300
          ${dragActive ? "bg-primary/20 border-primary scale-110" : "bg-card dark:border-white/10 border-black/10 group-hover:scale-105 group-hover:dark:border-white/20 border-black/20"}
        `}>
          <Upload className={`w-8 h-8 transition-colors ${dragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
          Drop your video here
        </h3>
        <p className="text-muted-foreground mb-8 text-center">or browse from your device</p>
        
        <Button 
          variant="outline" 
          className="mb-8 font-semibold rounded-full px-8 pointer-events-none"
        >
          Select Video
        </Button>

        <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <span>MP4</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
          <span>MOV</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
          <span>WebM</span>
        </div>
      </div>
    </div>
  )
}
