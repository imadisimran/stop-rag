"use client"

import { motion } from "framer-motion"

export function ProfileInfoGrid() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="grid grid-cols-2 gap-4"
    >
      <div className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] p-4 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        <h3 className="text-[9px] text-secondary uppercase font-mono mb-1">Session</h3>
        <p className="font-mono text-sm text-white">2023-27</p>
      </div>
      <div className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] p-4 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        <h3 className="text-[9px] text-secondary uppercase font-mono mb-1">Anchor</h3>
        <p className="font-body text-xs text-white">Sector 7G</p>
      </div>
    </motion.div>
  )
}
