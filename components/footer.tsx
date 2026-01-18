"use client"

export function Footer() {
  return (
    <footer className="relative py-6 mt-auto">
      {/* Simple divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-border/50" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">Text Share - Real-time text collaboration</p>
          <p className="text-xs text-muted-foreground/60">
            Created by{" "}
            <a
              href="https://mohammed-razin-cr.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline decoration-dotted underline-offset-2"
            >
              Mohammed Razin CR
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
