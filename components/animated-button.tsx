"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  variant?: "primary" | "secondary"
  onClick?: () => void
  disabled?: boolean
}

export function AnimatedButton({ children, className = "", variant = "primary", onClick, disabled }: AnimatedButtonProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.button
      className={cn(
        "relative px-5 py-2.5 rounded-lg font-medium text-sm tracking-wide transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
        className,
      )}
      whileHover={prefersReducedMotion ? {} : { y: -1 }}
      whileTap={prefersReducedMotion ? {} : { y: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
