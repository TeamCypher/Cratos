"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { AnalysisHistoryItem } from "./mock-data"

interface HistoryContextType {
  historyItems: AnalysisHistoryItem[]
  addHistoryItem: (item: AnalysisHistoryItem) => void
  clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

const HISTORY_STORAGE_KEY = "cratos_session_history"

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from session storage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(HISTORY_STORAGE_KEY)
      if (stored) {
        setHistoryItems(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to load history from session storage", e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to session storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyItems))
      } catch (e) {
        console.error("Failed to save history to session storage", e)
      }
    }
  }, [historyItems, isLoaded])

  const addHistoryItem = (item: AnalysisHistoryItem) => {
    setHistoryItems((prev) => {
      // Check if item already exists
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [item, ...prev]
    })
  }

  const clearHistory = () => {
    setHistoryItems([])
    sessionStorage.removeItem(HISTORY_STORAGE_KEY)
  }

  return (
    <HistoryContext.Provider value={{ historyItems, addHistoryItem, clearHistory }}>
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
