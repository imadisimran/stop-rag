"use client"

import { motion } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  label?: string
}

export function BackButton({ label = "Back to Feed" }: BackButtonProps) {
  const router = useRouter()
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => router.back()}
      className="bg-white/5 border border-white/15 px-5 py-3 rounded-xl flex items-center gap-3 group hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer"
    >
      <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs uppercase tracking-wider font-semibold text-foreground">
        {label}
      </span>
    </motion.button>
  )
}