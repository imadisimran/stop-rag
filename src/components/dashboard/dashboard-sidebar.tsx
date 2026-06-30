"use client"

import { motion } from "framer-motion"
import {
  FiHome,
  FiFileText,
  FiShield,
  FiAlertTriangle,
  FiSettings,
  FiPlusCircle,
  FiUser,
} from "react-icons/fi"
import { dashboardNavItems } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: FiHome,
  reports: FiFileText,
  safety: FiShield,
  emergency: FiAlertTriangle,
  settings: FiSettings,
  profile: FiUser,
}


export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col fixed left-[max(0px,calc((100vw-1440px)/2))] top-20 h-[calc(100vh-80px)] w-64 bg-white/[0.03] backdrop-blur-xl border-r border-white/[0.08] py-6 z-40">
      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 mb-6 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-glow-purple">
          <FiShield className="text-white text-lg" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-gradient leading-none">
            Fearless
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">
            Anti-Ragging Shield
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 py-4 px-3">
        {dashboardNavItems.map((item, index) => {
          const Icon = iconMap[item.icon] ?? FiHome
          const isActive = pathname === item.href

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-primary"
                )}
              >
                <Icon className="text-lg shrink-0" />
                <span className="font-body">{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>


      {/* Report Incident CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-3 pb-6"
      >
        <Button asChild variant="gradient" className="w-full font-bold gap-2">
          <Link href="/report">
            <FiPlusCircle className="text-lg" />
            Report Incident
          </Link>
        </Button>
      </motion.div>
    </aside>
  )
}
