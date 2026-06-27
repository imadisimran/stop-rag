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
import { registerUser } from "@/actions/auth/register"

// Stagger container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

// Each child slides up + fades + unblurs
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

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) {
      newErrors.name = "Student name is required"
    }
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!validate(name, email, password, confirmPassword)) return

    setIsLoading(true)
    try {
      // Create user via register endpoint
      const response = await registerUser({ name, email, password })

      if (!response.success) {
        throw new Error(response.message || "Registration failed")
      }

      toast.success("Account created!", {
        description: "Your student account has been registered successfully. Logging in...",
      })

      // Automatically sign the user in after registration
      const signinRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (signinRes?.error) {
        // If auto-signin fails for some reason, direct to login page
        router.push("/login")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err.message || "Something went wrong. Please try again.",
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
          Create Account
        </motion.h1>
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Register as a new student to get started
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
        {/* Name Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="name">Student Name</Label>
          <motion.div
            whileHover={{
              boxShadow: "0 0 0 1px rgba(139,92,246,0.25)",
              borderRadius: "12px",
            }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="glass-input border-border/50 bg-white/5"
              autoComplete="name"
            />
          </motion.div>
          <AnimatePresence>
            {errors.name && (
              <motion.p
                className="text-xs text-destructive"
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Email Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="email">Email</Label>
          <motion.div
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
          <Label htmlFor="password">Password</Label>
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
                placeholder="Create a password"
                className="glass-input border-border/50 bg-white/5 pr-10"
                autoComplete="new-password"
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

        {/* Confirm Password Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <motion.div
              whileHover={{
                boxShadow: "0 0 0 1px rgba(139,92,246,0.25)",
                borderRadius: "12px",
              }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="glass-input border-border/50 bg-white/5 pr-10"
                autoComplete="new-password"
              />
            </motion.div>
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <motion.p
                className="text-xs text-destructive"
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                {errors.confirmPassword}
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
                    Creating account...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Create Account
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
        Already have an account?{" "}
        <motion.span
          className="inline-block"
          whileHover={{ scale: 1.05, y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Link
            href="/login"
            className="text-primary font-medium hover:text-primary/80 transition-colors"
          >
            Sign In
          </Link>
        </motion.span>
      </motion.p>
    </motion.div>
  )
}
