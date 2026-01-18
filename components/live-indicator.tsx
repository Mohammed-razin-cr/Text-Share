"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LiveIndicatorProps {
  isLive?: boolean
  className?: string
}

export function LiveIndicator({ isLive = true, className = "" }: LiveIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="relative flex items-center justify-center">
        <div className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-emerald-500" : "bg-muted-foreground/50")} />
        {isLive && !prefersReducedMotion && (
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500"
            animate={{
              scale: [1, 1.8],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        )}
      </div>
      <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wide">
        {isLive ? "Live" : "Offline"}
      </span>
    </div>
  )
}
