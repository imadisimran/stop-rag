"use client"

import { motion } from "framer-motion"
import { FiSearch, FiXCircle } from "react-icons/fi"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterTabsProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  severityFilter: string
  setSeverityFilter: (val: string) => void
  dateSort: string
  setDateSort: (val: string) => void
}

export function FilterTabs({
  searchQuery,
  setSearchQuery,
  severityFilter,
  setSeverityFilter,
  dateSort,
  setDateSort,
}: FilterTabsProps) {
  const isFiltersDirty = searchQuery !== "" || severityFilter !== "All" || dateSort !== "newest"

  const handleReset = () => {
    setSearchQuery("")
    setSeverityFilter("All")
    setDateSort("newest")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 w-full"
    >
      {/* Search Input */}
      <div className="relative w-full md:flex-1">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-70 z-10 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports, institutions..."
          className="glass-input w-full h-11 pl-12 pr-4 text-white text-sm placeholder:text-muted-foreground"
        />
      </div>

      {/* Select Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
        {/* Severity Filter */}
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
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

        {/* Date Sort */}
        <Select value={dateSort} onValueChange={setDateSort}>
          <SelectTrigger className="w-full sm:w-[170px] text-muted-foreground">
            <SelectValue placeholder="Date: Newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Date: Newest First</SelectItem>
            <SelectItem value="oldest">Date: Oldest First</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {isFiltersDirty && (
          <button
            onClick={handleReset}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-dashed border-white/15 hover:border-white/30 rounded-xl px-4 text-xs h-10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiXCircle className="w-4 h-4" />
            Reset Filters
          </button>
        )}
      </div>
    </motion.div>
  )
}