"use client"

import { motion } from "framer-motion"
import { FiAlignLeft } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"

export function DescriptionSection() {
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
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            On the evening of October 24th, around 11:30 PM, I was returning
            from the Main Library when three senior students intercepted me
            near the Block A common hallway. What started as "casual
            questioning" quickly escalated into verbal intimidation and
            physical blocking of my path. They demanded I perform demeaning
            tasks and made several verbal threats regarding my hostel stay.
            This lasted for approximately 20 minutes until a security guard's
            flashlight was seen at the end of the corridor, causing them to
            disperse. I have attached the voice recording of the latter half
            of the interaction and photos of the incident site.
          </p>
        </div>
      </GlassPanel>
    </motion.div>
  )
}