"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"

export function GoogleButton() {
  const handleGoogleSignIn = () => {
    signIn("google",{callbackUrl:"/"})
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button
        variant="outline"
        className="w-full h-11 text-sm font-medium border-border/50 bg-white/5 hover:bg-white/10 transition-all group relative overflow-hidden"
        onClick={handleGoogleSignIn}
        type="button"
      >
        {/* Shimmer on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
        <motion.span
          className="relative z-10 flex items-center gap-2"
          whileHover={{ x: [0, -2, 2, 0] }}
          transition={{ duration: 0.3 }}
        >
          <FcGoogle className="size-5" />
          Continue with Google
        </motion.span>
      </Button>
    </motion.div>
  )
}
