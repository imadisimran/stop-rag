"use client"

export function GlowBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        className="glow-orb-purple animate-float-slow"
        style={{ top: "-200px", left: "-200px" }}
      />
      <div
        className="glow-orb-cyan"
        style={{ bottom: "-150px", right: "-150px" }}
      />
    </div>
  )
}