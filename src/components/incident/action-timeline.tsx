"use client"

import { motion } from "framer-motion"
import { FiCheck, FiMail } from "react-icons/fi"
import { GlassPanel } from "@/components/ui/glass-panel"

export function ActionTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <GlassPanel className="p-6 md:p-8 rounded-3xl border-l-4 border-primary">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <FiCheck className="text-primary text-lg" />
          <h2 className="font-display text-lg md:text-xl font-semibold">
            Actions
          </h2>
        </div>
        <div className="space-y-8 relative">
          <div className="absolute left-4 top-1 bottom-1 w-0.5 bg-white/10"></div>

          {/* Action 1 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-success flex items-center justify-center">
              <FiCheck className="text-white text-sm" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground text-sm md:text-base">
                Report Verified
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Automated student status verification completed. Account
                @anon_992 is a current student at Central State.
              </p>
              <p className="text-[10px] font-mono text-success mt-1">
                OCT 25, 08:00 AM
              </p>
            </div>
          </div>

          {/* Action 2 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <FiMail className="text-white text-sm" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground text-sm md:text-base">
                Authority Notified
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                The Anti-Ragging Committee at Central State University has been
                notified and granted access to this report.
              </p>
              <p className="text-[10px] font-mono text-secondary mt-1">
                OCT 25, 10:15 AM
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}