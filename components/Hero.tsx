"use client"

import { useRef, useState, useEffect } from "react"
import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"

export function Hero() {
  const screenSize = useScreenSize()
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [overText, setOverText] = useState(false)
  const [cursorPixel, setCursorPixel] = useState<{ x: number; y: number } | null>(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  const pixelSize = screenSize.lessThan("md") ? 24 : 32

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true)
        setOverText(false)
        setCursorPixel(null)
      } else {
        setHasScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function handleMouseMove(e: React.MouseEvent) {
    if (hasScrolled || !contentRef.current || !viewportRef.current) return
    const r = contentRef.current.getBoundingClientRect()
    const vr = viewportRef.current.getBoundingClientRect()
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom
    setOverText(inside)
    if (inside) {
      setCursorPixel({
        x: Math.floor((e.clientX - vr.left) / pixelSize) * pixelSize,
        y: Math.floor((e.clientY - vr.top) / pixelSize) * pixelSize,
      })
    } else {
      setCursorPixel(null)
    }
  }

  const drawingActive = !hasScrolled

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen">
      {/* Sticky viewport — sticks below the navbar for the full scroll journey */}
      <div
        ref={viewportRef}
        className="sticky top-16 flex h-[calc(100vh-4rem)] items-start justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setOverText(false); setCursorPixel(null) }}
      >
        <GooeyFilter id="gooey-hero-trail" strength={5} />


        <div
          className="absolute inset-0 z-0"
          style={{ filter: "url(#gooey-hero-trail)" }}
        >
          <div
            className="transition-opacity duration-200"
            style={{ opacity: drawingActive && !overText ? 1 : 0 }}
          >
            <PixelTrail
              pixelSize={pixelSize}
              fadeDuration={0}
              delay={500}
              pixelClassName="bg-(--accent) opacity-60"
            />
          </div>
          {drawingActive && overText && cursorPixel && (
            <div
              aria-hidden
              className="pointer-events-none absolute bg-(--accent) opacity-60"
              style={{
                left: cursorPixel.x,
                top: cursorPixel.y,
                width: pixelSize,
                height: pixelSize,
              }}
            />
          )}
        </div>

        <div
          ref={contentRef}
          className="pointer-events-none relative z-10 flex w-full max-w-3xl flex-col items-center px-6 pt-8 text-center"
        >
          <p className="font-pixel text-xl tracking-widest text-(--accent) md:text-2xl">
            &gt; full_stack_software_engineer
          </p>

          <div className="mt-6">
            <h1 className="text-6xl font-semibold tracking-tight text-(--fg) md:text-8xl">
              Ding Ren
            </h1>
          </div>

          <p className="mt-6 max-w-sm text-base leading-relaxed text-(--fg)">
Software and AI engineer who builds products from zero to one — with the speed and ownership of a founder.
With experience across a SF Bay Area venture studio, a national healthcare tech firm, and an Indonesian fintech unicorn, he has shipped production-grade full-stack and LLM-powered products across industries. He thinks in outcomes, moves fast, and owns the entire stack — from Figma wireframes to cloud deployment. Currently a final year student at NTU Singapore.
          </p>
        </div>
      </div>
    </section>
  )
}
