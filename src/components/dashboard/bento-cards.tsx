"use client"

import { motion } from "framer-motion"
import { FiTrendingUp, FiShield, FiArrowRight } from "react-icons/fi"

export function ImpactScoreCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between bg-primary/10 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <FiTrendingUp className="text-xl" />
        </div>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded uppercase font-bold tracking-tighter">
          Impact Score
        </span>
      </div>
      <div>
        <div className="font-display text-3xl font-bold text-foreground mt-4">
          94.2
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Safety contribution percentile
        </p>
      </div>
    </motion.div>
  )
}

export function AnonymityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:bg-white/[0.08] transition-colors cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
          <FiShield className="text-xl" />
        </div>
        <FiArrowRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
      <div>
        <div className="font-body text-lg font-semibold text-foreground mt-4">
          Anonymity Guaranteed
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your data is encrypted end-to-end
        </p>
      </div>
    </motion.div>
  )
}
