"use client"

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

export function GoogleButton() {
  const handleGoogleSignIn = () => {
    // TODO: integrate Google OAuth
    console.log("Google sign-in clicked")
  }

  return (
    <Button
      variant="outline"
      className="w-full h-11 text-sm font-medium border-border/50 bg-white/5 hover:bg-white/10 transition-all"
      onClick={handleGoogleSignIn}
      type="button"
    >
      <FcGoogle className="size-5" />
      Continue with Google
    </Button>
  )
}
