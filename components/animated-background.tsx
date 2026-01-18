"use client"
import { useReducedMotion } from "framer-motion"

export function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/5" />

      {!prefersReducedMotion && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-foreground/[0.015] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-foreground/[0.01] blur-3xl" />
        </>
      )}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
