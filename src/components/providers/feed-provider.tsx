"use client"

import React, { createContext, useContext, useState, ReactNode, useRef } from "react"
import { PublicReportCardData } from "@/types"

interface FeedContextType {
  reports: PublicReportCardData[]
  setReports: React.Dispatch<React.SetStateAction<PublicReportCardData[]>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  hasMore: boolean
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  severityFilter: string
  setSeverityFilter: React.Dispatch<React.SetStateAction<string>>
  dateSort: string
  setDateSort: React.Dispatch<React.SetStateAction<string>>
  scrollPositionRef: React.MutableRefObject<number>
  hasLoadedOnce: boolean
  setHasLoadedOnce: (val: boolean) => void
}

const FeedContext = createContext<FeedContextType | undefined>(undefined)

export function FeedProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<PublicReportCardData[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("All")
  const [dateSort, setDateSort] = useState("newest")
  const [hasLoadedOnce, setHasLoadedOnceState] = useState(false)
  const scrollPositionRef = useRef(0)

  const setHasLoadedOnce = (val: boolean) => {
    setHasLoadedOnceState(val)
  }

  return (
    <FeedContext.Provider
      value={{
        reports,
        setReports,
        page,
        setPage,
        hasMore,
        setHasMore,
        searchQuery,
        setSearchQuery,
        severityFilter,
        setSeverityFilter,
        dateSort,
        setDateSort,
        scrollPositionRef,
        hasLoadedOnce,
        setHasLoadedOnce,
      }}
    >
      {children}
    </FeedContext.Provider>
  )
}

export function useFeedContext() {
  const context = useContext(FeedContext)
  if (context === undefined) {
    throw new Error("useFeedContext must be used within a FeedProvider")
  }
  return context
}
