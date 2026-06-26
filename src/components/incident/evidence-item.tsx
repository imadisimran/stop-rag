"use client"

import { motion } from "framer-motion"
import { IconType } from "react-icons"
import { cn } from "@/lib/utils"

interface EvidenceItemProps {
  type: "image" | "file"
  src?: string
  alt?: string
  fileName?: string
  icon?: IconType
  iconColor?: string
  fileType?: string
  size?: string
  delay?: number
}

export function EvidenceItem({
  type,
  src,
  alt,
  fileName,
  icon: Icon,
  iconColor,
  fileType,
  size,
  delay = 0,
}: EvidenceItemProps) {
  if (type === "image") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ y: -4 }}
        className="group relative aspect-square rounded-2xl overflow-hidden glass-card border-2 border-transparent hover:border-primary/50 transition-all cursor-pointer"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-3 md:p-4">
          <p className="text-xs md:text-sm font-semibold uppercase text-white truncate">
            {fileName}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className={cn(
        "group aspect-square rounded-2xl glass-card flex flex-col items-center justify-center gap-3 md:gap-4 hover:bg-white/10 transition-colors cursor-pointer border-2 border-transparent"
      )}
      style={{ borderColor: "transparent" }}
    >
      {Icon && (
        <div
          className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}20`, color: iconColor }}
        >
          <Icon className="text-2xl md:text-3xl" />
        </div>
      )}
      <div className="text-center">
        <p
          className="font-semibold uppercase text-[10px] tracking-widest"
          style={{ color: iconColor }}
        >
          {fileType}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">{size}</p>
      </div>
    </motion.div>
  )
}