"use client"

import { motion } from "framer-motion"
import { FiDownload } from "react-icons/fi"

export function DashboardHeader() {
  return (
    <div className="flex items-end justify-between mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-secondary text-xs font-semibold uppercase tracking-widest">
          Real-time Insights
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient mt-2">
          Statistics Overview
        </h2>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
      >
        <FiDownload className="text-sm" />
        Download PDF
      </motion.button>
    </div>
  )
}
