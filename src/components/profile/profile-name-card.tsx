"use client"

import { UserProfile } from "@/types"
import { motion } from "framer-motion"
import { FaFingerprint } from "react-icons/fa"

export function ProfileNameCard({user}: {user: UserProfile | null}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] p-6 rounded-xl group transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      {/* Scanline element */}
      <div className="absolute top-[-2px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-15 pointer-events-none animate-scan"></div>
      
      <div className="flex justify-between items-start mb-4">
        <FaFingerprint className="text-primary text-xl group-hover:scale-110 transition-transform duration-300" />
        <span className="font-mono text-[10px] text-muted-foreground">UID // {user?.userId || "N/A"}</span>
      </div>
      <h3 className="text-[10px] text-secondary uppercase font-mono tracking-widest mb-1">Student Name</h3>
      <p className="font-display text-3xl font-medium text-white">{user?.name || "N/A"}</p>
    </motion.div>
  )
}
