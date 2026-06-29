"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, Lock, Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Shield,
    title: "100% Cryptographic Anonymity",
    description: "Your reports are protected by state-of-the-art end-to-end cryptography. Your true identity is never exposed.",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
  },
  {
    icon: Lock,
    title: "Zero Retaliation Risk",
    description: "Report safely without fear of campus backlash or harassment. We prioritize your protection.",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
  },
  {
    icon: Bell,
    title: "Real-time Verification Status",
    description: "Track incident reports as they are validated and addressed by campus administrators.",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  }
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const orbPurpleRef = useRef<HTMLDivElement>(null)
  const orbCyanRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  const handleGoBack = () => {
    // Fallback to home if back history doesn't exist or we came straight to the page
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance: scale up + fade in with elastic ease
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          {
            opacity: 0,
            y: 60,
            scale: 0.92,
            rotateX: 8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1.0,
            ease: "back.out(1.4)",
            delay: 0.15,
          }
        )
      }

      // Purple orb: slow organic floating loop
      if (orbPurpleRef.current) {
        gsap.set(orbPurpleRef.current, { x: -100, y: -50 })
        gsap.to(orbPurpleRef.current, {
          x: 80,
          y: 40,
          duration: 8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
        gsap.to(orbPurpleRef.current, {
          scale: 1.15,
          duration: 5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      }

      // Cyan orb: counter-orbit floating
      if (orbCyanRef.current) {
        gsap.set(orbCyanRef.current, { x: 60, y: 30 })
        gsap.to(orbCyanRef.current, {
          x: -90,
          y: -60,
          duration: 10,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
        gsap.to(orbCyanRef.current, {
          scale: 1.2,
          duration: 7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      }

      // Floating particles
      if (particlesRef.current) {
        const particles = particlesRef.current.children
        Array.from(particles).forEach((particle, i) => {
          const el = particle as HTMLElement
          gsap.set(el, {
            left: `${gsap.utils.random(0, 100)}%`,
            top: `${gsap.utils.random(0, 100)}%`,
            width: gsap.utils.random(2, 6),
            height: gsap.utils.random(2, 6),
            x: gsap.utils.random(-300, 300),
            y: gsap.utils.random(-300, 300),
            opacity: 0,
          })

          // Fade in
          gsap.to(el, {
            opacity: gsap.utils.random(0.15, 0.5),
            duration: gsap.utils.random(1, 2.5),
            delay: i * 0.08,
          })

          // Continuous floating
          gsap.to(el, {
            y: `+=${gsap.utils.random(-120, 120)}`,
            x: `+=${gsap.utils.random(-80, 80)}`,
            duration: gsap.utils.random(5, 12),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
          })

          // Pulsing scale
          gsap.to(el, {
            scale: gsap.utils.random(0.6, 1.5),
            duration: gsap.utils.random(3, 6),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.1,
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Interactive tilt on mouse move (GSAP)
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 2
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 2

      gsap.to(card, {
        rotateY,
        rotateX,
        duration: 0.5,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      })
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-12 min-h-screen w-full relative overflow-hidden bg-background font-body"
    >
      {/* Animated background gradient orbs */}
      <div
        ref={orbPurpleRef}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        ref={orbCyanRef}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Floating particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: "4px",
              height: "4px",
              left: `${(i * 5 + 7) % 100}%`,
              top: `${(i * 7 + 13) % 100}%`,
              background:
                i % 3 === 0
                  ? "rgba(139,92,246,0.6)"
                  : i % 3 === 1
                    ? "rgba(6,182,212,0.6)"
                    : "rgba(255,255,255,0.3)",
              boxShadow:
                i % 3 === 0
                  ? "0 0 6px rgba(139,92,246,0.4)"
                  : i % 3 === 1
                    ? "0 0 6px rgba(6,182,212,0.4)"
                    : "0 0 4px rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Mobile Top Bar */}
      <div className="flex lg:hidden justify-between items-center px-6 py-4 absolute top-0 left-0 w-full z-30">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          size="sm"
          className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl border border-white/5 px-3 py-1.5"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs">Go Back</span>
        </Button>
        
        <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Encrypted</span>
        </span>
      </div>

      {/* Left Column: Side Messages & Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 border-r border-border/20 relative z-20 bg-card/10 backdrop-blur-[4px]">
        {/* Top: Go Back Button */}
        <div>
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all rounded-xl pl-3 pr-4 py-2 border border-white/5"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Middle: Brand and Staggered Safety messages */}
        <div className="space-y-10 my-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Shield className="size-4 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wider text-gradient">STOPRAG</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              A safe, anonymous campus space built to report, audit, and eliminate student ragging and harassment.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
              >
                <div className={`p-2.5 rounded-xl border ${feature.color} shrink-0`}>
                  <feature.icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom: Privacy Footer */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-cyan-400" />
          <span>Secured by End-to-End Cryptography</span>
        </div>
      </div>

      {/* Right Column: Form content */}
      <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center p-6 relative z-10 min-h-screen">
        <div className="w-full max-w-md relative z-10" style={{ perspective: "1200px" }}>
          <div
            ref={cardRef}
            className="glass-elevated p-8 md:p-10"
            style={{
              opacity: 0,
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
