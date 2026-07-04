"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { FiBell, FiSearch } from "react-icons/fi"
import { FiHelpCircle } from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function DashboardTopbar() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20)
  })

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className={cn(
        "fixed top-0 w-full z-50 glass-navbar h-16 md:h-20 transition-all duration-300",
        scrolled && "shadow-glow-purple"
      )}
    >
      <div className="flex justify-between items-center px-5 md:px-10 h-full w-full max-w-[1440px] mx-auto">
        {/* Logo + Title */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="font-display text-xl md:text-2xl font-bold text-gradient">
            STOPRAG
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <h1 className="font-display text-lg md:text-xl font-semibold text-muted-foreground">
            Dashboard
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
            <FiBell className="text-muted-foreground text-lg md:text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-background" />
          </button>

          {/* Help */}
          <button className="hidden sm:block p-2 rounded-full hover:bg-white/5 transition-colors">
            <FiHelpCircle className="text-muted-foreground text-lg md:text-xl" />
          </button>

          {/* Profile */}
          {status === "authenticated" ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="outline-none cursor-pointer focus-visible:ring-0 focus-visible:outline-none">
                  <Avatar className="w-9 h-9 md:w-10 md:h-10 border-2 border-primary/30 hover:scale-110 transition-transform">
                    {session?.user?.image && (
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name || "User Profile"}
                      />
                    )}
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs flex items-center justify-center">
                      {session?.user?.name
                        ? session.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 glass-navbar border border-white/10 text-white p-2 rounded-xl shadow-2xl backdrop-blur-lg"
              >
                <DropdownMenuLabel className="font-display text-xs text-muted-foreground/80 px-2 py-1.5 break-all">
                  User ID: {session?.user?.userId || session?.user?.id || "N/A"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 focus:text-white rounded-lg px-2 py-1.5">
                  <Link href="/dashboard" className="w-full text-sm font-body">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 focus:text-white rounded-lg px-2 py-1.5">
                  <Link href="/dashboard/profile" className="w-full text-sm font-body">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await signOut({ redirect: false })
                    router.push("/login")
                    router.refresh()
                  }}
                  className="cursor-pointer rounded-lg px-2 py-1.5 font-medium font-body flex items-center justify-between"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-4 h-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Avatar className="w-9 h-9 md:w-10 md:h-10 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs flex items-center justify-center">
                U
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </motion.header>
  )
}
