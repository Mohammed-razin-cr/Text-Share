"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

interface GeometricLoaderProps {
  onComplete?: () => void
  minDuration?: number
}

export function GeometricLoader({ onComplete, minDuration = 2000 }: GeometricLoaderProps) {
  const [isExiting, setIsExiting] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        onComplete?.()
      }, 800)
    }, minDuration)

    return () => clearTimeout(timer)
  }, [onComplete, minDuration])

  const circleAnimation = prefersReducedMotion
    ? {}
    : {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }

  const circleTransition = prefersReducedMotion
    ? {}
    : {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{
        opacity: isExiting ? 0 : 1,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5" />

      <motion.div
        className="relative"
        animate={{
          scale: isExiting ? 0.8 : 1,
          y: isExiting ? -30 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-foreground/10"
              style={{
                width: `${(i + 1) * 40}px`,
                height: `${(i + 1) * 40}px`,
              }}
              animate={circleAnimation}
              transition={{
                ...circleTransition,
                delay: i * 0.2,
              }}
            />
          ))}

          <motion.div
            className="relative z-10 w-12 h-12 rounded-lg bg-gradient-to-br from-foreground/5 to-foreground/10 backdrop-blur-sm"
            animate={
              prefersReducedMotion
                ? {}
                : {
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }
            }
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">
          Text Share
        </span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-foreground/30"
              animate={prefersReducedMotion ? {} : { opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
