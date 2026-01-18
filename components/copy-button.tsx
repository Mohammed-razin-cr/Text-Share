"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Check, Copy, Link } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  text: string
  className?: string
  showIcon?: "copy" | "link"
}

export function CopyButton({ text, className = "", showIcon = "copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const Icon = showIcon === "link" ? Link : Copy

  return (
    <motion.button
      onClick={handleCopy}
      className={cn(
        "relative flex items-center gap-2 px-3 py-1.5 rounded-lg",
        "bg-secondary/80 text-secondary-foreground",
        "border border-border/50 hover:border-border",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      whileHover={prefersReducedMotion ? {} : { y: -1 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      aria-label={copied ? "Copied to clipboard" : "Copy link to clipboard"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs"
          >
            <Icon className="w-3.5 h-3.5" />
            Copy Link
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
