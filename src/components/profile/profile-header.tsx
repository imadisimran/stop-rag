"use client"

import { motion } from "framer-motion"
import { FiTerminal } from "react-icons/fi"
import { UserProfile } from "@/actions/profile/profile"

export function ProfileHeader({user}:{user:UserProfile | null}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6 gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-white uppercase mt-1 glitch-text transition-all duration-300">
            {user?.role} PROFILE
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-left sm:text-right font-mono">
          <p className="text-xs text-white">User Id: {user?.userId}</p>
        </div>
      </div>
    </motion.div>
  )
}
