"use client"

import { useRef, useState } from "react"
import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"

export function Hero() {
  const screenSize = useScreenSize()
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [overText, setOverText] = useState(false)
  const [cursorPixel, setCursorPixel] = useState<{ x: number; y: number } | null>(null)

  const pixelSize = screenSize.lessThan("md") ? 24 : 32

  function handleMouseMove(e: React.MouseEvent) {
    if (!contentRef.current || !sectionRef.current) return
    const r = contentRef.current.getBoundingClientRect()
    const sr = sectionRef.current.getBoundingClientRect()
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom
    setOverText(inside)
    if (inside) {
      setCursorPixel({
        x: Math.floor((e.clientX - sr.left) / pixelSize) * pixelSize,
        y: Math.floor((e.clientY - sr.top) / pixelSize) * pixelSize,
      })
    } else {
      setCursorPixel(null)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] items-start justify-start overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setOverText(false); setCursorPixel(null) }}
    >
      {/* Gooey pixel trail layer */}
      <GooeyFilter id="gooey-hero-trail" strength={5} />
      <div
        className="absolute inset-0 z-0"
        style={{ filter: "url(#gooey-hero-trail)" }}
      >
        <div className="transition-opacity duration-200" style={{ opacity: overText ? 0 : 1 }}>
          <PixelTrail
            pixelSize={pixelSize}
            fadeDuration={0}
            delay={500}
            pixelClassName="bg-[var(--accent)] opacity-60"
          />
        </div>
        {overText && cursorPixel && (
          <div
            aria-hidden
            className="pointer-events-none absolute bg-[var(--accent)] opacity-60"
            style={{
              left: cursorPixel.x,
              top: cursorPixel.y,
              width: pixelSize,
              height: pixelSize,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div ref={contentRef} className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start px-6 pt-24 text-left">
        <p className="font-[family-name:var(--font-pixel)] text-xl tracking-widest text-[var(--accent)] md:text-2xl">
          &gt; full_stack_software_engineer
        </p>
        <h1 className="mt-6 text-6xl font-semibold tracking-tight text-[var(--fg)] md:text-8xl">
          Ding Ren
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--fg-muted)]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco.
        </p>
      </div>
    </section>
  )
}
