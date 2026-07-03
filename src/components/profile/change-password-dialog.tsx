"use client"

import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { FiKey, FiLoader, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { signOut } from "next-auth/react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

import { changePasswordSchema, ChangePasswordValues } from "./change-password-schema"
import { changePassword } from "@/actions/profile/changePassword"

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
}

export function ChangePasswordDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Reset form when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
  }

  const onSubmit = async (data: ChangePasswordValues) => {
    setSaving(true)
    try {
      const res = await changePassword(data)

      if (res.success) {
        toast.success("Password changed successfully", {
          description: "You will be signed out momentarily.",
        })
        
        // Wait a bit to let the user see the success message
        setTimeout(async () => {
          await signOut({ redirect: true, callbackUrl: '/login' })
        }, 2000)
        
      } else {
        toast.error(res.message || "Failed to change password")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-md bg-popover/95 backdrop-blur-xl border-white/10 shadow-[0_8px_60px_rgba(139,92,246,0.15),0_0_120px_rgba(6,182,212,0.06)] overflow-y-auto max-h-[90vh]"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-tight text-white flex items-center gap-2">
            <span className="p-1.5 bg-secondary/15 rounded-md border border-secondary/25">
              <FiKey className="text-secondary text-sm" />
            </span>
            Change Password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
            SECURITY_CREDENTIALS_ROTATION // UPDATE PASSWORD
          </DialogDescription>
        </DialogHeader>

        {/* ── Form Fields ──────────────────────────────────────────── */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
          
          {/* Current Password */}
          <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                    Current Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showCurrentPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter current password"
                      className="bg-white/[0.04] border-white/10 backdrop-blur-md rounded-xl h-11 px-4 text-white placeholder:text-muted-foreground/50 focus-visible:ring-secondary/30 focus-visible:border-secondary/50 transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="font-mono text-[10px] uppercase tracking-widest text-destructive" />
                  )}
                </Field>
              )}
            />
          </motion.div>

          {/* New Password */}
          <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showNewPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter new password (min 8 chars)"
                      className="bg-white/[0.04] border-white/10 backdrop-blur-md rounded-xl h-11 px-4 text-white placeholder:text-muted-foreground/50 focus-visible:ring-secondary/30 focus-visible:border-secondary/50 transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="font-mono text-[10px] uppercase tracking-widest text-destructive" />
                  )}
                </Field>
              )}
            />
          </motion.div>

          {/* Confirm Password */}
          <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="text-[10px] text-secondary uppercase font-mono tracking-widest">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm new password"
                      className="bg-white/[0.04] border-white/10 backdrop-blur-md rounded-xl h-11 px-4 text-white placeholder:text-muted-foreground/50 focus-visible:ring-secondary/30 focus-visible:border-secondary/50 transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="font-mono text-[10px] uppercase tracking-widest text-destructive" />
                  )}
                </Field>
              )}
            />
          </motion.div>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <DialogFooter className="bg-transparent border-white/[0.06] mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-white font-mono text-[11px] uppercase tracking-widest"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !form.formState.isDirty}
              className="bg-secondary text-white font-bold text-[11px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin text-xs" />
                  Updating...
                </>
              ) : (
                <>
                  <FiCheckCircle className="text-xs" />
                  Change Password
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
