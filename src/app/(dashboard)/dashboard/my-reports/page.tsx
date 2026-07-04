"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { toast } from "sonner"
import { getUserReports } from "@/actions/report/report"
import {
  FiGrid,
  FiList,
  FiSearch,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserReportCardData } from "@/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserReportCard } from "../../../../components/my-reports/user-report-card"

gsap.registerPlugin(useGSAP)

export default function MyReportsPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const observerTarget = useRef<HTMLDivElement>(null)
  const [reports, setReports] = useState<UserReportCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [severityFilter, setSeverityFilter] = useState("All")
  const [dateSort, setDateSort] = useState("newest")

  // Fetch reports when page or filters change
  useEffect(() => {

    if (page === 1) {
      setIsLoading(true)
      setReports([])
    }
    else setIsFetchingMore(true)

    const fetchReports = async () => {

      const res = await getUserReports({
        searchQuery,
        statusFilter,
        severityFilter,
        dateSort,
        page,
        limit: 3
      })

      if (res.success && res.data) {
        if (page === 1) {
          setReports(res.data.reports)
        } else {
          setReports(prev => {
            const existingIds = new Set(prev.map(r => r.postId))
            const newReports = (res.data?.reports || []).filter(r => !existingIds.has(r.postId))
            return [...prev, ...newReports]
          })
        }
        setHasMore(res.data.hasMore)
      } else {
        toast.error(res.message || "Failed to load reports")
      }

      setIsLoading(false)
      setIsFetchingMore(false)
    }

    const timeoutId = setTimeout(() => {
      fetchReports()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [page, searchQuery, statusFilter, severityFilter, dateSort])

  // Intersection Observer for infinite scrolling
  const fetchStateRef = useRef({ hasMore, isLoading, isFetchingMore })
  useEffect(() => {
    fetchStateRef.current = { hasMore, isLoading, isFetchingMore }
  }, [hasMore, isLoading, isFetchingMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const state = fetchStateRef.current
          if (state.hasMore && !state.isLoading && !state.isFetchingMore) {
            setPage(p => p + 1)
          }
        }
      },
      { rootMargin: "100px" }
    )

    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [isLoading, hasMore])

  // GSAP animation for page entrance
  useGSAP(
    () => {
      gsap.fromTo(
        ".animate-gsap-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
      gsap.fromTo(
        ".animate-gsap-filters",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.15 }
      )
    },
    { scope: pageRef }
  )


  return (
    <div ref={pageRef} className="max-w-[1000px] w-full space-y-6">
      {/* Header Section */}
      <div className="animate-gsap-header flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-secondary text-xs font-semibold uppercase tracking-widest">
            Report Center
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient mt-2">
            My Reports
          </h2>
          <p className="text-muted-foreground mt-2">
            You have <span className="text-secondary font-bold">{reports.length}</span> active reports matching your filters.
          </p>
        </div>

        {/* Layout Toggles */}
        <div className="lg:flex gap-2 hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-xl border-white/10 hover:bg-white/10 hover:text-white transition-all",
              viewMode === "grid" ? "bg-primary/20 text-primary border-primary/30" : "text-muted-foreground"
            )}
          >
            <FiGrid className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-xl border-white/10 hover:bg-white/10 hover:text-white transition-all",
              viewMode === "list" ? "bg-primary/20 text-primary border-primary/30" : "text-muted-foreground"
            )}
          >
            <FiList className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="animate-gsap-filters glass-card p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center border border-white/5">
        <div className="w-full md:flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 h-11 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-0 focus-visible:bg-white/[0.06] outline-none text-foreground transition-all"
              placeholder="Search by Report ID, Title, or content..."
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px] text-muted-foreground">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
              <SelectItem value="Appealed">Appealed</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={dateSort}
            onValueChange={(value) => {
              setDateSort(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] text-muted-foreground">
              <SelectValue placeholder="Date: Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Date: Newest First</SelectItem>
              <SelectItem value="oldest">Date: Oldest First</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={severityFilter}
            onValueChange={(value) => {
              setSeverityFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px] text-muted-foreground">
              <SelectValue placeholder="Severity: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Severities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports Feed */}
      <motion.div
        layout
        className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        )}
      >
        <AnimatePresence>
          {reports.map((report) => (
            <UserReportCard key={report.postId} report={report} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {!isLoading && reports.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <FiInfo className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-display text-lg font-bold text-foreground">No reports found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-1">
            We couldn't find any reports matching your search or filters. Try clearing them or using different terms.
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 mt-8">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
            Loading Reports...
          </p>
        </div>
      )}

      {/* Infinite Scroll Loader Placeholder */}
      {!isLoading && hasMore && (
        <div ref={observerTarget} className="flex flex-col items-center justify-center py-8 gap-3 border-t border-white/5 mt-8">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            Loading More...
          </p>
        </div>
      )}

      {/* Feed Up To Date Indicator */}
      {!isLoading && !hasMore && reports.length > 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-3 border-t border-white/5 mt-8">
          <FiCheckCircle className="w-6 h-6 text-primary/50" />
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            Feed up to date
          </p>
        </div>
      )}
    </div>
  )
}
