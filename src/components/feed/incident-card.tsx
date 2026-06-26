"use client"

import { motion } from "framer-motion"
import { FiThumbsUp, FiMessageCircle, FiClock, FiMapPin } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Incident } from "@/lib/types"
import { cn } from "@/lib/utils"

interface IncidentCardProps {
  incident: Incident
  index: number
}

export function IncidentCard({ incident, index }: IncidentCardProps) {
  const isUrgent = incident.status === "urgent"

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="glass-card p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 group"
    >
      {/* Image */}
      <div className="w-full md:w-48 h-28 md:h-32 rounded-xl overflow-hidden bg-muted shrink-0">
        <img
          src={incident.image}
          alt={incident.imageAlt}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title + Badge */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-display text-base md:text-lg font-semibold leading-snug">
            {incident.title}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold",
              isUrgent
                ? "bg-destructive/20 text-destructive border-destructive/30"
                : "bg-secondary/20 text-secondary border-secondary/30"
            )}
          >
            {isUrgent ? "Urgent" : "Reviewing"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {incident.description}
        </p>

        {/* Footer: actions + meta + button */}
        <div className="mt-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Likes + Comments + Time + Location */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(167,139,250,0.3)] transition-all">
                <FiThumbsUp className="text-sm" />
                <span className="text-xs font-bold">{incident.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(167,139,250,0.3)] transition-all">
                <FiMessageCircle className="text-sm" />
                <span className="text-xs font-bold">{incident.comments}</span>
              </button>
            </div>

            <div className="flex gap-3 text-xs text-muted-foreground/60">
              <span className="flex items-center gap-1">
                <FiClock className="text-sm" />
                {incident.timeAgo}
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin className="text-sm" />
                {incident.location}
              </span>
            </div>
          </div>

          {/* View Details Button */}
          <Button
            variant="gradient"
            className="w-full md:w-auto text-xs md:text-sm font-bold shrink-0"
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.article>
  )
}