"use client"

import { motion } from "framer-motion"

export function ReportHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 md:mb-10"
    >
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-3 leading-tight">
        Report an Incident
      </h1>
      <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
        Your voice is protected. Help us maintain a ragging-free ecosystem by
        providing accurate details. All reports are encrypted end-to-end and
        filed anonymously.
      </p>
    </motion.header>
  )
}
