import { UserProfile } from "@/actions/profile/profile"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export function ProfileUniversityCard({ user }: { user: UserProfile | null }) {
  const [count, setCount] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Animate progress bar width
    gsap.to(progressBarRef.current, {
      width: "75%",
      duration: 1.5,
      ease: "power3.out",
      delay: 0.2
    })

    // Animate numeric tick-up counter
    const countObj = { val: 0 }
    gsap.to(countObj, {
      val: 75,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.2,
      onUpdate: () => {
        setCount(Math.floor(countObj.val))
      }
    })
  }, { scope: containerRef })

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative lg:after:content-[''] lg:after:absolute lg:after:left-[-24px] lg:after:top-1/2 lg:after:w-6 lg:after:h-[1px] lg:after:bg-secondary lg:after:shadow-[0_0_8px_#4cd7f6] lg:after:opacity-40"
    >
      <div className="relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-[10px] p-6 md:p-8 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[10px] text-secondary uppercase font-mono tracking-widest mb-2">Academic Info</h3>
            <p className="font-display text-2xl md:text-3xl text-white">{user?.studentDetails?.university.name || "N/A"}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl text-primary font-bold">{count}%</span>
            <p className="text-[9px] text-muted-foreground uppercase font-mono">Completion</p>
          </div>
        </div>

        {/* Custom progress bar */}
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            style={{ width: "0%" }}
            className="bg-primary h-full shadow-[0_0_10px_rgba(208,188,255,0.5)]"
          />
        </div>
      </div>
    </motion.div>
  )
}
