"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleButton } from "@/components/auth/google-button"
import { AuthDivider } from "@/components/auth/auth-divider"

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
      // TODO: replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Account created!", {
        description: "Your student account has been registered successfully.",
      })
      router.push("/login")
    } catch {
      toast.error("Registration failed", {
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-display font-bold tracking-tight text-gradient">
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Register as a new student to get started
        </p>
      </div>

      <GoogleButton />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Student Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            className="glass-input border-border/50 bg-white/5"
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="glass-input border-border/50 bg-white/5"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="glass-input border-border/50 bg-white/5 pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="glass-input border-border/50 bg-white/5 pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:text-primary/80 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  )
}
