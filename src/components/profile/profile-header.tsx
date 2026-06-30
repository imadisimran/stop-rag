"use client"

import { motion } from "framer-motion"
import { FiTerminal } from "react-icons/fi"

export function ProfileHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6 gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-secondary">
            <FiTerminal className="text-xs text-secondary animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em]">System Identity Node</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-white uppercase mt-1 glitch-text transition-all duration-300">
            Student_Core
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-left sm:text-right font-mono">
          <p className="text-[10px] text-muted-foreground uppercase">Status: <span className="text-secondary font-bold">Connected</span></p>
          <p className="text-xs text-white">Node: STU-99021-X</p>
        </div>
        <div className="flex gap-1 h-4 items-end">
          <div className="w-1 h-3 bg-secondary animate-pulse"></div>
          <div className="w-1 h-4 bg-secondary/60"></div>
          <div className="w-1 h-2 bg-secondary/30"></div>
        </div>
      </div>
    </motion.div>
  )
}
