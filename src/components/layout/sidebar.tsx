"use client"

import { motion } from "framer-motion"
import { FiShield, FiPlusCircle, FiLock, FiFileText, FiHome } from "react-icons/fi"
import { TbGavel, TbBuildingBank } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navItems = [
  { icon: FiHome, label: "Home Feed", href: "#", active: true },
  { icon: TbGavel, label: "Authority Messages", href: "#" },
  { icon: TbBuildingBank, label: "Institutions", href: "#" },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed left-[max(0px,calc((100vw-1440px)/2))] top-20 h-[calc(100vh-80px)] w-64 bg-white/[0.03] backdrop-blur-xl border-r border-white/[0.08] py-6 z-40">
      {/* Guardian Portal Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <FiShield className="text-primary text-lg" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-primary">
              Guardian Portal
            </h3>
            <p className="text-xs text-muted-foreground opacity-70">
              Safe &amp; Anonymous
            </p>
          </div>
        </div>
      </motion.div>

      {/* Report Incident Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="px-3 mb-6"
      >
        <Button
          variant="gradient"
          className="w-full font-bold gap-2"
          asChild
        >
          <Link href="/report">
            <FiPlusCircle className="text-lg" />
            Report Incident
          </Link>
        </Button>
      </motion.div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => (
          <motion.a
            key={item.label}
            href={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + index * 0.05 }}
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-sm transition-all",
              item.active
                ? "bg-primary/10 text-primary border-r-2 border-primary"
                : "text-muted-foreground hover:bg-white/5"
            )}
          >
            <item.icon className="text-lg shrink-0" />
            <span className="font-body">{item.label}</span>
          </motion.a>
        ))}
      </nav>

      {/* Footer Links */}
      <div className="px-6 pb-6 pt-6 border-t border-white/[0.08] space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-2 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <FiLock className="text-sm" />
          Privacy
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-2 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <FiFileText className="text-sm" />
          Terms
        </a>
      </div>
    </aside>
  )
}