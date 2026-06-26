"use client"

import { motion } from "framer-motion"
import { FiLoader } from "react-icons/fi"

export function LoadingMore() {
  return (
    <div className="py-8 md:py-12 text-center">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center gap-2 text-muted-foreground"
      >
        <FiLoader className="animate-spin text-lg" />
        <span className="text-sm font-body">Loading more anonymous reports...</span>
      </motion.div>
    </div>
  )
}