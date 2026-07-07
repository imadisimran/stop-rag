"use client"

import { motion } from "framer-motion"
import { FiAlignLeft } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"

interface DescriptionSectionProps {
  description: string
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassPanel className="p-6 md:p-8 rounded-3xl space-y-4">
        <h2 className="font-display text-lg md:text-xl font-semibold flex items-center gap-3">
          <FiAlignLeft className="text-primary" />
          Report Description
        </h2>
        <div className="border-t border-white/10 pt-4 md:pt-6">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      </GlassPanel>
    </motion.div>
  )
}