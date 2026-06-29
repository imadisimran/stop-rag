"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { FilterType } from "@/lib/types"
import { FiSearch } from "react-icons/fi"

const filters: FilterType[] = ["All", "Recent", "Damage", "Urgent"]

export function FilterTabs() {
  const [active, setActive] = useState<FilterType>("All")

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col gap-5 mb-6 md:mb-8"
    >
      <div className="relative w-full max-w-xs lg:max-w-md hidden md:block">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-70 z-10" />
        <input
          type="text"
          placeholder="Search reports, institutions..."
          className="glass-input w-full h-11 lg:h-12 pl-12 pr-4 text-white text-sm placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all",
              active === filter
                ? "bg-primary text-primary-foreground shadow-glow-purple"
                : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

    </motion.div>
  )
}