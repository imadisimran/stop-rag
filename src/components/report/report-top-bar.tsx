"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReportTopBar() {
  const router = useRouter()

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 md:h-20 glass-navbar",
        "flex items-center justify-between px-5 md:px-10"
      )}
    >
      {/* Left: Back button + brand */}
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={handleGoBack}
          className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <FiArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline text-sm">Back</span>
        </button>

        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-purple">
            <Shield className="size-4 text-white" />
          </div>
          <span className="font-display text-lg md:text-xl font-bold text-gradient">
            STOPRAG
          </span>
        </div>
      </div>

      {/* Right: Encrypted status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        <span className="hidden sm:inline">Encrypted Session</span>
        <span className="sm:hidden">Encrypted</span>
      </div>
    </motion.header>
  )
}
