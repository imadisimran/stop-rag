"use client"

import { motion } from "framer-motion"
import { FiMail, FiCheckCircle } from "react-icons/fi"

export function ProfileCommsCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] p-6 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      <h3 className="text-[10px] text-secondary uppercase font-mono tracking-widest mb-3 flex items-center gap-2">
        <FiMail className="text-xs" />
        Primary Comms
      </h3>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <p className="font-mono text-sm text-white break-all">arivera@university.edu</p>
        <span className="flex items-center gap-1 bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded text-[9px] text-secondary font-mono uppercase">
          <FiCheckCircle className="text-[10px] text-secondary" />
          Verified
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground border-t border-white/[0.08] pt-3 font-mono">
        Encrypted via RSA-4096
      </p>
    </motion.div>
  )
}
