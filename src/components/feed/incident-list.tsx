"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { FiZap } from "react-icons/fi"
import { IncidentCard } from "./incident-card"
import { incidents } from "@/lib/data"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function IncidentList() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Animate section title on scroll
      gsap.from(".section-title", {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // Animate the "Real-time updates" label
      gsap.from(".section-meta", {
        opacity: 0,
        x: 30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section-meta",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-title font-display text-xl md:text-2xl text-primary flex items-center gap-2 font-semibold">
          <FiZap className="fill-current" />
          Recent Incidents
        </h2>
        <span className="section-meta text-xs md:text-sm text-muted-foreground">
          Real-time updates
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {incidents.map((incident, index) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}