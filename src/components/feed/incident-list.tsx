"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { FiZap, FiInfo, FiCheckCircle } from "react-icons/fi"
import { IncidentCard } from "./incident-card"
import { FilterTabs } from "./filter-tabs"
import { LoadingMore } from "./loading-more"
import { getPublicReports } from "@/actions/report/report"
import { PublicReportCardData } from "@/types"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface IncidentListProps {
  initialReports: PublicReportCardData[]
  initialHasMore: boolean
}

export function IncidentList({ initialReports, initialHasMore }: IncidentListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Filters and Pagination states
  const [reports, setReports] = useState<PublicReportCardData[]>(initialReports)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("All")
  const [dateSort, setDateSort] = useState("newest")

  // Track if this is the first client-side load to avoid duplicate initial fetches
  const isFirstRender = useRef(true)

  // Fetch reports when filters or page changes
  useEffect(() => {
    // Skip the very first render as we already have server-rendered initialReports
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (page === 1) {
      setIsLoading(true)
      setReports([])
    } else {
      setIsFetchingMore(true)
    }

    const fetchReports = async () => {
      const res = await getPublicReports({
        searchQuery,
        severityFilter,
        dateSort,
        page,
        limit: 6,
      })

      if (res.success && res.data) {
        if (page === 1) {
          setReports(res.data.reports)
        } else {
          setReports((prev) => {
            const existingIds = new Set(prev.map((r) => r.postId))
            const newReports = (res.data?.reports || []).filter((r) => !existingIds.has(r.postId))
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
  }, [page, searchQuery, severityFilter, dateSort])

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery, severityFilter, dateSort])

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
            setPage((p) => p + 1)
          }
        }
      },
      { rootMargin: "100px" }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) observer.observe(currentTarget)

    return () => {
      if (currentTarget) observer.unobserve(currentTarget)
    }
  }, [isLoading, hasMore])

  useGSAP(
    () => {
      // Animate section title on scroll
      gsap.from(".section-title", {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // Animate the "Real-time updates" label
      gsap.from(".section-meta", {
        opacity: 0,
        x: 30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section-meta",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Filters Bar */}
      <FilterTabs
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        dateSort={dateSort}
        setDateSort={setDateSort}
      />

      {/* Section Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-title font-display text-xl md:text-2xl text-primary flex items-center gap-2 font-semibold">
          <FiZap className="fill-current" />
          Recent Incidents
        </h2>
        <span className="section-meta text-xs md:text-sm text-muted-foreground">
          Real-time updates
        </span>
      </div>

      {/* Loading state for page 1 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
            Loading Reports...
          </p>
        </div>
      )}

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

      {/* Cards Grid */}
      {!isLoading && reports.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {reports.map((incident) => <IncidentCard key={incident.postId} data={incident} />)}
          </AnimatePresence>
        </div>
      )}

      {/* Infinite Scroll Loader */}
      {!isLoading && hasMore && (
        <div ref={observerTarget}>
          <LoadingMore />
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