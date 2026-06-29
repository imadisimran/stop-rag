"use client"

import { motion } from "framer-motion"

export function FeedHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6 md:mb-8"
    >
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 leading-tight">
        Fearless Feed
      </h1>
      <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
        Browse reported incidents across campuses. Your identity remains
        protected by end-to-end encryption.
      </p>
    </motion.header>
  )
}