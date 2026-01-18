"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { nanoid } from "nanoid"
import { ArrowRight, Zap, Globe, Sparkles } from "lucide-react"
import { GeometricLoader } from "@/components/geometric-loader"
import { AnimatedBackground } from "@/components/animated-background"
import { AnimatedButton } from "@/components/animated-button"
import { ParallaxCard } from "@/components/parallax-card"
import { Footer } from "@/components/footer"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
} as const

const featureContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.4,
    },
  },
} as const

const featureItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
} as const

const features = [
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Changes appear instantly across all connected devices",
  },
  {
    icon: Globe,
    title: "No Sign-up",
    description: "Start sharing immediately with just a link",
  },
  {
    icon: Sparkles,
    title: "Distraction-free",
    description: "Clean, minimal interface focused on content",
  },
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  const handleCreateRoom = () => {
    setIsCreating(true)
    const roomId = nanoid(10)
    router.push(`/room/${roomId}`)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <GeometricLoader key="loader" onComplete={() => setIsLoading(false)} minDuration={2200} />}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            className="min-h-screen flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedBackground />

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
              <motion.div
                className="max-w-2xl mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="mb-6">
                  <motion.span
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 text-xs text-muted-foreground"
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            "0 0 0 0 rgba(16, 185, 129, 0)",
                            "0 0 0 4px rgba(16, 185, 129, 0.1)",
                            "0 0 0 0 rgba(16, 185, 129, 0)",
                          ],
                        }
                    }
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"
                      animate={
                        prefersReducedMotion
                          ? {}
                          : {
                            scale: [1, 1.3, 1],
                            opacity: [0.8, 1, 0.8],
                          }
                      }
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    Real-time collaboration
                  </motion.span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance leading-[1.08]"
                >
                  Share text with
                  <br />
                  <span className="text-muted-foreground">elegant simplicity</span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-base sm:text-lg text-muted-foreground max-w-md mx-auto text-pretty leading-relaxed"
                >
                  A premium, distraction-free space to share and sync text instantly. No sign-up required.
                </motion.p>

                <motion.div variants={itemVariants} className="mt-8">
                  <AnimatedButton onClick={handleCreateRoom} disabled={isCreating} className="min-w-[180px]">
                    {isCreating ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={prefersReducedMotion ? {} : { rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create a Room
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </AnimatedButton>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full"
                variants={featureContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {features.map((feature, index) => (
                  <motion.div key={index} variants={featureItemVariants}>
                    <ParallaxCard className="h-full">
                      <div className="p-5 rounded-xl bg-card/40 backdrop-blur-sm border border-border/40 h-full">
                        <feature.icon className="w-4 h-4 text-muted-foreground/70 mb-3" />
                        <h3 className="text-sm font-medium text-foreground mb-1.5">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </ParallaxCard>
                  </motion.div>
                ))}
              </motion.div>
            </main>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
