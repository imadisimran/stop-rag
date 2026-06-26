"use client"

import { motion } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"

export function BackButton() {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white/5 border border-white/15 px-5 py-3 rounded-xl flex items-center gap-3 group hover:bg-primary/10 hover:border-primary/40 transition-all"
    >
      <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs uppercase tracking-wider font-semibold">
        Back to Feed
      </span>
    </motion.button>
  )
}