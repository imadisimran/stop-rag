"use client"

import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { FiBell } from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { navLinks } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNavbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { data: session, status } = useSession()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20)
  })

  console.log(session)

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
          {status === "authenticated" ? (
            <>
              {/* Notification */}
              <button className="p-2 rounded-full hover:bg-white/5 transition-colors mr-1">
                <FiBell className="text-muted-foreground text-lg md:text-xl" />
              </button>

              {/* Profile with Dropdown Menu */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 mr-2 outline-none cursor-pointer focus:ring-0 focus-visible:ring-0 focus-visible:outline-none">
                    <Avatar className="w-9 h-9 md:w-10 md:h-10 border border-white/10 hover:opacity-80 transition-opacity">
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
                    <Link href="/dashboard" className="w-full text-sm font-body">Dashboard</Link>
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
            </>
          ) : status === "loading" ? (
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          ) : (
            <Button asChild variant="gradient">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  )
}