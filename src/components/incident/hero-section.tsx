"use client"

import { motion } from "framer-motion"
import { FiShare2, FiFlag } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface HeroSectionProps {
  title: string
  postId: string
  date: Date
  universityName: string
  severity?: string
  showFlagButton?: boolean
}

export function HeroSection({
  title,
  postId,
  date,
  universityName,
  severity = "LOW",
  showFlagButton = true,
}: HeroSectionProps) {
  const formattedDate = format(new Date(date), "MMM d, yyyy")

  
  const displaySeverity = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()
  
  const getSeverityBadgeClasses = (sev: string) => {
    switch (sev.toUpperCase()) {
      case "HIGH":
        return "bg-destructive/20 text-destructive border-destructive/30 animate-pulse"
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "LOW":
      default:
        return "bg-green-500/20 text-green-500 border-green-500/30"
    }
  }

  return (
    <GlassPanel className="p-6 md:p-8 rounded-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge 
                variant="outline" 
                className={`${getSeverityBadgeClasses(severity)} uppercase tracking-widest`}
            >
              {displaySeverity}
            </Badge>
            <span className="font-mono text-xs md:text-sm text-muted-foreground">
              #{postId}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl lg:text-5xl text-gradient mb-2 leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {universityName} • Posted on {formattedDate}
          </p>
        </div>

        <div className="flex gap-3 md:gap-4 w-full md:w-auto">
          <motion.button
            whileHover={{ y: -2 }}
            className="flex-1 md:flex-none bg-white/5 border border-white/15 p-3 md:p-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-white/10 transition-colors"
          >
            <FiShare2 className="text-secondary text-lg md:text-xl" />
            <span className="text-[10px] uppercase font-bold tracking-tight">
              Share
            </span>
          </motion.button>
          {showFlagButton && (
            <motion.button
              whileHover={{ y: -2 }}
              className="flex-1 md:flex-none bg-white/5 border border-white/15 p-3 md:p-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-white/10 transition-colors"
            >
              <FiFlag className="text-destructive text-lg md:text-xl" />
              <span className="text-[10px] uppercase font-bold tracking-tight">
                Flag
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </GlassPanel>
  )
}