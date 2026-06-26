"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"

export function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const orbPurpleRef = useRef<HTMLDivElement>(null)
  const orbCyanRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance: scale up + fade in with elastic ease
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
          // Randomize starting sizes and positions client-side
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
      className="relative flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 overflow-hidden"
    >
      {/* Animated gradient orbs */}
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
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
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

      {/* Auth card with perspective tilt */}
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
  )
}
