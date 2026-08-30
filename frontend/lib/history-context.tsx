"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { AnalysisHistoryItem } from "./types"
import { api } from "./api/client"

interface HistoryContextType {
  historyItems: AnalysisHistoryItem[]
  addHistoryItem: (item: AnalysisHistoryItem) => void
  deleteHistoryItem: (id: string) => Promise<void>
  clearHistory: () => void
  isLoading: boolean
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('google_token')
      if (token) {
        const data = await api.getUserHistory()
        // Map backend videos to AnalysisHistoryItem format
        if (data && data.history) {
          const formatted = data.history.map((v: any) => ({
            id: v.video_id,
            title: v.title || v.filename || "Uploaded Video",
            thumbnail: "bg-blue-900/50",
            date: new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            duration: "00:00",
            score: v.best_score || 0,
            bestPlatform: v.best_platform || "Unknown",
            trendStatus: "stable",
            category: v.category || "General",
            status: v.status // e.g. completed, processing, etc.
          })) as AnalysisHistoryItem[]
          setHistoryItems(formatted)
        }
      } else {
        setHistoryItems([])
      }
    } catch (e) {
      console.error("Failed to load history from backend", e)
    } finally {
      setIsLoading(false)
    }
  }

  // Load from backend on mount and when auth changes
  useEffect(() => {
    loadHistory()
    
    const handleAuthChange = () => {
      loadHistory()
    }
    window.addEventListener('auth_changed', handleAuthChange)
    return () => window.removeEventListener('auth_changed', handleAuthChange)
  }, [])

  const addHistoryItem = (item: AnalysisHistoryItem) => {
    setHistoryItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [item, ...prev]
    })
  }
  
  const deleteHistoryItem = async (id: string) => {
    try {
      await api.deleteUserHistory(id)
      setHistoryItems(prev => prev.filter(item => item.id !== id))
    } catch (e) {
      console.error("Failed to delete history item", e)
      // Ideally show a toast notification here
    }
  }

  const clearHistory = () => {
    setHistoryItems([])
  }

  return (
    <HistoryContext.Provider value={{ historyItems, addHistoryItem, deleteHistoryItem, clearHistory, isLoading }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
