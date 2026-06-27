"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleButton } from "@/components/auth/google-button"
import { AuthDivider } from "@/components/auth/auth-divider"
import { signIn } from "next-auth/react"

// Stagger container for child elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// Each child slides up and fades in
const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// Title gradient shimmer animation
const titleVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// Button hover glow
const buttonVariants = {
  idle: {
    boxShadow: "0 0 0px rgba(139,92,246,0)",
  },
  hover: {
    boxShadow: "0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(6,182,212,0.15)",
    scale: 1.015,
    transition: { duration: 0.3 },
  },
  tap: {
    scale: 0.97,
    boxShadow: "0 0 15px rgba(139,92,246,0.3)",
    transition: { duration: 0.1 },
  },
}

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (email: string, password: string) => {
    const newErrors: Record<string, string> = {}
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!password) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!validate(email, password)) return

    setIsLoading(true)
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        toast.error("Login failed", {
          description: "Invalid email or password. Please try again.",
        })
      } else {
        toast.success("Welcome back!", {
          description: "You have been logged in successfully.",
        })
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      toast.error("Login failed", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center space-y-2" variants={titleVariants}>
        <motion.h1
          className="text-2xl font-display font-bold tracking-tight text-gradient"
          whileHover={{
            scale: 1.03,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sign in to your account to continue
        </motion.p>
      </motion.div>

      {/* Google OAuth */}
      <motion.div variants={itemVariants}>
        <GoogleButton />
      </motion.div>

      {/* Divider */}
      <motion.div variants={itemVariants}>
        <AuthDivider />
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
      >
        {/* Email Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="email">Email</Label>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            whileHover={{
              boxShadow: "0 0 0 1px rgba(139,92,246,0.25)",
              borderRadius: "12px",
            }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="glass-input border-border/50 bg-white/5"
              autoComplete="email"
            />
          </motion.div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                className="text-xs text-destructive"
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <motion.div
              whileHover={{
                boxShadow: "0 0 0 1px rgba(139,92,246,0.25)",
                borderRadius: "12px",
              }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="glass-input border-border/50 bg-white/5 pr-10"
                autoComplete="current-password"
              />
            </motion.div>
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                {showPassword ? (
                  <motion.span
                    key="hide"
                    initial={{ opacity: 0, rotate: -90, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EyeOff className="size-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="show"
                    initial={{ opacity: 0, rotate: -90, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye className="size-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                className="text-xs text-destructive"
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="submit"
              variant="gradient"
              className="w-full h-11 relative overflow-hidden"
              disabled={isLoading}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </motion.form>

      {/* Footer link */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        variants={itemVariants}
      >
        Don&apos;t have an account?{" "}
        <motion.span
          className="inline-block"
          whileHover={{ scale: 1.05, y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Link
            href="/register"
            className="text-primary font-medium hover:text-primary/80 transition-colors"
          >
            Sign Up
          </Link>
        </motion.span>
      </motion.p>
    </motion.div>
  )
}
