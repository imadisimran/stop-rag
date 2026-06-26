"use client"

import { useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function GlassPanel({ children, className, ...props }: GlassPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ref.current.style.setProperty("--mouse-x", `${x}px`)
    ref.current.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("glass-card relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}