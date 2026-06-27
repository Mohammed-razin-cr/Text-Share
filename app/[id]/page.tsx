"use client"

import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { doc, setDoc, onSnapshot, serverTimestamp, getDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AnimatedBackground } from "@/components/animated-background"
import { CopyButton } from "@/components/copy-button"
import { LiveIndicator } from "@/components/live-indicator"
import { Footer } from "@/components/footer"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function RoomPage() {
  const params = useParams()
  const roomId = params.id as string
  const [text, setText] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncedText, setLastSyncedText] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isLocalChange = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  const debouncedText = useDebounce(text, 500)

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  useEffect(() => {
    const roomRef = doc(db, "rooms", roomId)

    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        setIsConnected(true)
        if (snapshot.exists()) {
          const data = snapshot.data()

          if (data.expiresAt) {
            const expirationDate = data.expiresAt.toDate()
            setExpiresAt(expirationDate)
            const now = new Date()

            if (now > expirationDate) {
              console.log("Room has expired")
              window.location.href = "/"
              return
            }
          }

          if (!isLocalChange.current && data.text !== text) {
            setText(data.text || "")
            setLastSyncedText(data.text || "")
          }
          isLocalChange.current = false
        }
      },
      (error) => {
        console.error("Firestore error:", error)
        setIsConnected(false)
      },
    )

    return () => unsubscribe()
  }, [roomId, text])

  useEffect(() => {
    if (debouncedText === lastSyncedText) return

    const syncText = async () => {
      try {
        isLocalChange.current = true
        const roomRef = doc(db, "rooms", roomId)

        const roomSnapshot = await getDoc(roomRef)
        const isNewRoom = !roomSnapshot.exists()

        const now = new Date()
        const expiresAt = new Date(now.getTime() + 53 * 60 * 1000)

        const roomData: any = {
          text: debouncedText,
          updatedAt: serverTimestamp(),
        }

        if (isNewRoom) {
          roomData.createdAt = serverTimestamp()
          roomData.expiresAt = Timestamp.fromDate(expiresAt)
        }

        await setDoc(roomRef, roomData, { merge: true })
        setLastSyncedText(debouncedText)
      } catch (error) {
        console.error("Sync error:", error)
      } finally {
        setIsSyncing(false)
      }
    }

    syncText()
  }, [debouncedText, roomId, lastSyncedText])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />

      <motion.header
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Back</span>
              </Link>
              <div className="h-4 w-px bg-border/50" />
              <div className="flex items-center gap-2">
                <LiveIndicator isLive={isConnected} />
                <AnimatePresence>
                  {isSyncing && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-muted-foreground/70"
                    >
                      Syncing...
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground/70">
                <Users className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{roomId}</span>
              </div>
              <CopyButton text={shareUrl} showIcon="link" />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 container mx-auto px-6 py-6">
        <motion.div
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-card/50 backdrop-blur-xl border border-border/30 rounded-xl" />

            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              placeholder="Start typing to share text in real-time..."
              className="relative w-full min-h-[65vh] p-6 bg-transparent text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              spellCheck={false}
              aria-label="Shared text editor"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <span className="text-xs text-muted-foreground/50 font-mono tabular-nums">
              {text.length.toLocaleString()} characters
            </span>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
