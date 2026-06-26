"use client"

import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { FiSearch, FiBell, FiShield } from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { navLinks } from "@/lib/data"
import { cn } from "@/lib/utils"

export function TopNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20)
  })

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn(
        "fixed top-0 w-full z-50 glass-navbar h-16 md:h-20 transition-all duration-300",
        scrolled && "shadow-glow-purple"
      )}
    >
      <div className="flex justify-between items-center px-5 md:px-10 h-full w-full max-w-[1440px] mx-auto">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-6 md:gap-10">
          <span className="font-display text-xl md:text-2xl font-bold text-gradient">
            STOPRAG
          </span>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-body transition-colors relative py-1",
                  link.active
                    ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-primary after:to-secondary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/*Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">

          

          {/* Notification */}
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <FiBell className="text-muted-foreground text-lg md:text-xl" />
          </button>

          {/* Shield — tablet & desktop */}
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors hidden md:block">
            <FiShield className="text-muted-foreground text-lg md:text-xl" />
          </button>

          {/* Profile */}
          <Avatar className="w-9 h-9 md:w-10 md:h-10 border border-white/10">
            <AvatarImage
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBbZ63lpag64Lhp1WacllLzW_PAPEAquo8W3-IgqhI75x178aWQMsiWLU1PNARf_uvdLcseo0HQYpAJHTXZM1U_nxmxa5cDx-ol14vZuVvunYLbNOEazjUvgUWAU3fwELtxgKpx4Hpb2Gw-mZp45TlUE3Aj2LK82Rbe9i1EpwbvrutyKY_T-zzeMuL7NDX_BGCkEX0OIQOPfg9wgYI5OlYA6O5j10flggk0hSWQLY54k1YUHsTrqG-7rWjy1Ql_w828Uo-FLkPPvI"
              alt="User Profile"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.nav>
  )
}