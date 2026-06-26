"use client"

import { motion, type Variants } from "framer-motion"
import {
  FiShield,
  FiLock,
  FiEyeOff,
  FiPhone,
} from "react-icons/fi"
import { TbGavel } from "react-icons/tb"
import { GlassPanel } from "@/components/ui/glass-panel"

const safetyFeatures = [
  {
    icon: FiLock,
    title: "End-to-End Encrypted",
    description:
      "Only authorized institutional cells can decrypt the report content.",
  },
  {
    icon: FiEyeOff,
    title: "Zero Logs Policy",
    description:
      "Session data is wiped automatically every 24 hours. Nothing is retained.",
  },
  {
    icon: TbGavel,
    title: "Legally Binding",
    description:
      "All reports are legally admissible under the Anti-Ragging Act.",
  },
]

const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.1, type: "spring", stiffness: 120, damping: 18 },
  }),
}

export function ReportSidebar() {
  return (
    <aside className="space-y-5 lg:space-y-6">
      {/* Identity Protected Badge */}
      <motion.div custom={0} variants={sidebarVariants} initial="hidden" animate="visible">
        <GlassPanel className="p-5 md:p-6 rounded-3xl border-primary/20">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 border border-primary/25 text-primary">
                <FiShield className="size-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Identity Protected
                </h3>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  ANONYMOUS BY DESIGN
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We never store your real name, IP address, or device ID. Every
              report is assigned a unique{" "}
              <span className="font-mono text-secondary">GhostID</span> for
              tracking.
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Encryption Layer</span>
                <span className="font-mono text-secondary">Quantum-Safe</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Why It's Safe */}
      <motion.div custom={1} variants={sidebarVariants} initial="hidden" animate="visible">
        <GlassPanel className="p-5 md:p-6 rounded-3xl">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Why It&apos;s Safe
          </h4>
          <div className="space-y-4">
            {safetyFeatures.map((feature) => (
              <div key={feature.title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <feature.icon className="size-[18px]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      {/* Urgent Call */}
      <motion.div custom={2} variants={sidebarVariants} initial="hidden" animate="visible">
        <div className="rounded-3xl border border-destructive/25 bg-destructive/[0.06] p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <FiPhone className="size-5" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-destructive">
                In Immediate Danger?
              </p>
              <p className="mt-1 mb-3 text-xs text-muted-foreground leading-relaxed">
                If you or someone else is in physical danger, call the hotline
                right away.
              </p>
              <a
                href="tel:1800"
                className="inline-flex items-center gap-2 text-sm font-bold text-destructive hover:underline"
              >
                Call 1800-SAFE-NOW
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  )
}
