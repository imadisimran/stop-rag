"use client"

import { motion } from "framer-motion"
import { FiShield, FiEdit3, FiKey, FiTrash2, FiInfo, FiAlertTriangle } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/actions/profile/profile"
import { UpdateProfileDialog } from "@/components/profile/update-profile-dialog"

export function ProfileAccessControlCard({
  user,
  setUser,
}: {
  user: UserProfile | null
  setUser?: (user: UserProfile | null) => void
}) {
  const handleAction = (actionName: string) => {
    toast.error(`Access Denied: ${actionName} requires root administrator credentials.`, {
      description: "This incident has been logged under audit code STU-LOG-SEC.",
      duration: 5000,
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] rounded-2xl p-6 md:p-8 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] space-y-6"
    >
      {/* Section 1: Update Profile */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-primary">
            <FiEdit3 className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">Update Profile</h2>
            <p className="text-muted-foreground text-[10px] font-mono">USER_PROFILE_MODIFICATION</p>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <UpdateProfileDialog user={user} setUser={setUser}>
            <Button 
              className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-[11px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiEdit3 className="text-xs" />
              Update Profile
            </Button>
          </UpdateProfileDialog>
        </div>
      </div>

      {/* Divider 1 */}
      <div className="border-t border-white/[0.08]" />

      {/* Section 2: Change Password */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 text-secondary">
            <FiKey className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">Change Password</h2>
            <p className="text-muted-foreground text-[10px] font-mono">SECURITY_CREDENTIALS_ROTATION</p>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <Button 
            onClick={() => handleAction("Change Password")}
            variant="outline"
            className="w-full sm:w-auto px-5 py-2.5 bg-secondary/10 border border-secondary/40 text-secondary rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-secondary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiKey className="text-xs" />
            Change Password
          </Button>
        </div>
      </div>

      {/* Divider 2 */}
      <div className="border-t border-white/[0.08]" />

      {/* Section 3: Delete Node */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
            <FiAlertTriangle className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">Delete Account</h2>
            <p className="text-destructive/80 text-[10px] font-mono">CRITICAL_SYSTEM_ACTION</p>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <Button 
            onClick={() => handleAction("Delete Node")}
            variant="destructive"
            className="w-full sm:w-auto px-5 py-2.5 border border-destructive/30 text-destructive bg-transparent hover:bg-destructive/10 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiTrash2 className="text-xs text-destructive" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="pt-6 border-t border-white/[0.08] flex items-center gap-2 text-muted-foreground text-[10px] font-mono leading-relaxed">
        <FiInfo className="text-xs shrink-0 text-destructive animate-pulse" />
        ALERT: PERMANENT DATA ERASURE IS IRREVERSIBLE. SYSTEM WILL LOG ALL DELETION ATTEMPTS.
      </div>
    </motion.div>
  )
}
