"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

export function ProfileIncompleteWarning() {
  return (
    <div className="max-w-md mx-auto relative bg-white/[0.02] border border-amber-500/20 backdrop-blur-[10px] p-8 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.05)] text-center space-y-6 my-12">
      <div className="inline-flex p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500 mb-1 animate-pulse">
        <AlertTriangle className="w-8 h-8" />
      </div>
      
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold text-white uppercase tracking-tight">
          Profile Incomplete
        </h2>
        <p className="font-mono text-[9px] text-amber-500 uppercase tracking-widest">
          STATUS: SECURE_REPORT_RESTRICTED
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          You must complete your profile affiliation and academic details before submitting an incident report. This keeps our campus network validated and secure.
        </p>
      </div>

      <Button asChild variant="gradient" className="w-full py-2.5 transition-all group font-mono text-[10px] uppercase tracking-widest cursor-pointer">
        <Link href="/dashboard/profile" className="flex items-center justify-center gap-2">
          Complete Profile
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  )
}
