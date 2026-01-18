"use client"

import type React from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

interface ParallaxCardProps {
  children: ReactNode
  className?: string
}

export function ParallaxCard({ children, className = "" }: ParallaxCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  )
}
