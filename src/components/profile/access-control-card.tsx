"use client"

import { motion } from "framer-motion"
import { FiShield, FiEdit3, FiKey, FiTrash2, FiInfo } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function AccessControlCard() {
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
      className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] rounded-2xl p-6 md:p-8 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
            <FiShield className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">Access Control</h2>
            <p className="text-muted-foreground text-[10px] font-mono">ADMIN_PRIVILEGE_REQUIRED</p>
          </div>
        </div>

        {/* Action buttons with cyber-terminal aesthetic */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Button 
            onClick={() => handleAction("Update Profile")}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-[11px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiEdit3 className="text-xs" />
            Update Profile
          </Button>
          <Button 
            onClick={() => handleAction("Change Password")}
            variant="outline"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-secondary/10 border border-secondary/40 text-secondary rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-secondary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiKey className="text-xs" />
            Change Password
          </Button>
          <Button 
            onClick={() => handleAction("Delete Node")}
            variant="destructive"
            className="flex-1 sm:flex-initial px-5 py-2.5 border border-destructive/30 text-destructive bg-transparent hover:bg-destructive/10 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiTrash2 className="text-xs text-destructive" />
            Delete Node
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-center gap-2 text-muted-foreground text-[10px] font-mono leading-relaxed">
        <FiInfo className="text-xs shrink-0 text-destructive animate-pulse" />
        ALERT: PERMANENT DATA ERASURE IS IRREVERSIBLE. SYSTEM WILL LOG ALL DELETION ATTEMPTS.
      </div>
    </motion.div>
  )
}
