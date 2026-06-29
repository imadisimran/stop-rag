"use client"

import { motion } from "framer-motion"
import { FiShare2, FiFlag } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <GlassPanel className="p-6 md:p-8 rounded-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge 
                variant="outline" 
                className="bg-destructive/20 text-destructive border-destructive/30 animate-pulse uppercase tracking-widest"
            >
              Urgent
            </Badge>
            <span className="font-mono text-xs md:text-sm text-muted-foreground">
              #RAG-7721
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl lg:text-5xl text-gradient mb-2 leading-tight">
            Senior Hostelry Harassment
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Central State University • Posted on Oct 24, 2023
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
          <motion.button
            whileHover={{ y: -2 }}
            className="flex-1 md:flex-none bg-white/5 border border-white/15 p-3 md:p-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-white/10 transition-colors"
          >
            <FiFlag className="text-destructive text-lg md:text-xl" />
            <span className="text-[10px] uppercase font-bold tracking-tight">
              Flag
            </span>
          </motion.button>
        </div>
      </div>
    </GlassPanel>
  )
}