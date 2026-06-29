"use client"

import { motion } from "framer-motion"

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const textVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.3,
      ease: "easeOut" as const,
    },
  },
}

export function AuthDivider() {
  return (
    <motion.div
      className="relative flex items-center my-6"
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex-1 border-t border-border/50"
        variants={lineVariants}
        style={{ transformOrigin: "right center" }}
      />
      <motion.span
        className="px-4 text-xs text-muted-foreground uppercase tracking-wider"
        variants={textVariants}
      >
        or
      </motion.span>
      <motion.div
        className="flex-1 border-t border-border/50"
        variants={lineVariants}
        style={{ transformOrigin: "left center" }}
      />
    </motion.div>
  )
}
