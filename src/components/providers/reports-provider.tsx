"use client"

import React, { createContext, useContext, useState, ReactNode, useRef } from "react"
import { UserReportCardData } from "@/types"

interface ReportsContextType {
  reports: UserReportCardData[]
  setReports: React.Dispatch<React.SetStateAction<UserReportCardData[]>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  hasMore: boolean
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  statusFilter: string
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>
  severityFilter: string
  setSeverityFilter: React.Dispatch<React.SetStateAction<string>>
  dateSort: string
  setDateSort: React.Dispatch<React.SetStateAction<string>>
  scrollPositionRef: React.MutableRefObject<number>
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<UserReportCardData[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [severityFilter, setSeverityFilter] = useState("All")
  const [dateSort, setDateSort] = useState("newest")
  const scrollPositionRef = useRef(0)

  return (
    <ReportsContext.Provider
      value={{
        reports,
        setReports,
        page,
        setPage,
        hasMore,
        setHasMore,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        severityFilter,
        setSeverityFilter,
        dateSort,
        setDateSort,
        scrollPositionRef,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReportsContext() {
  const context = useContext(ReportsContext)
  if (context === undefined) {
    throw new Error("useReportsContext must be used within a ReportsProvider")
  }
  return context
}
