"use client"

import { motion } from "framer-motion"
import { FiPlusCircle, FiHome, FiFileText, FiShield } from "react-icons/fi"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

const leftItems: NavItem[] = [
  { icon: FiHome, label: "Dashboard", href: "/dashboard" },
  { icon: FiFileText, label: "Reports", href: "/dashboard/my-reports" },
]

const rightItems: NavItem[] = [
  { icon: FiShield, label: "Safety", href: "#" },
]

function NavButton({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-2 py-1 transition-colors min-w-[56px]",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className="text-xl" />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  )
}

export function DashboardMobileNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-navbar border-t border-white/[0.08] h-16"
    >
      <div className="flex items-center justify-around h-full max-w-[1440px] mx-auto px-2">
        {/* Left items */}
        {leftItems.map((item) => {
          const isActive = pathname === item.href
          return <NavButton key={item.label} item={item} isActive={isActive} />
        })}

        {/* Center Report Button */}
        <motion.a
          href="/report"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="relative -mt-8 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-purple shrink-0"
        >
          <FiPlusCircle className="text-white text-2xl" />
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
            Report
          </span>
        </motion.a>

        {/* Right items */}
        {rightItems.map((item) => {
          const isActive = pathname === item.href
          return <NavButton key={item.label} item={item} isActive={isActive} />
        })}
      </div>
    </motion.nav>
  )
}

