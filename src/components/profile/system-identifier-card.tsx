"use client"

import { motion } from "framer-motion"

export function SystemIdentifierCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] p-6 rounded-2xl flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      <div>
        <h3 className="text-[10px] text-secondary uppercase font-mono tracking-widest mb-1">System Identifier</h3>
        <p className="font-mono text-lg text-primary tracking-tighter">STU-99021-X</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full border border-secondary/30 flex items-center justify-center relative">
          {/* Animated concentric rings pulsing outwards */}
          <motion.div
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            className="h-6 w-6 rounded-full bg-secondary/30 absolute"
          />
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.6 }}
            className="h-6 w-6 rounded-full bg-secondary/20 absolute"
          />
          <div className="h-2 w-2 rounded-full bg-secondary"></div>
        </div>
        <span className="font-mono text-[9px] text-secondary uppercase mt-1">Active</span>
      </div>
    </motion.div>
  )
}
