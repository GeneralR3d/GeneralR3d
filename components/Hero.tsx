"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"
import { TextDisperse } from "@/components/ui/text-disperse"

export function Hero() {
  const screenSize = useScreenSize()
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [overText, setOverText] = useState(false)
  const [cursorPixel, setCursorPixel] = useState<{ x: number; y: number } | null>(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [nameDispersed, setNameDispersed] = useState(false)

  const pixelSize = screenSize.lessThan("md") ? 24 : 32

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Entire text block drifts from near-top to near-bottom
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"])

  // Only the name grows
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 2.2])

  // Eyebrow slides up and fades out as name starts growing
  const eyebrowY = useTransform(scrollYProgress, [0, 0.35], ["0px", "-40px"])
  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  // Description slides down and fades out at the same time
  const descY = useTransform(scrollYProgress, [0, 0.35], ["0px", "40px"])
  const descOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  // Disperse the name between 40% and 70% scroll progress
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setNameDispersed(v >= 0.4 && v <= 0.7)
  })

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
    <section ref={sectionRef} id="home" className="relative min-h-[200vh]">
      {/* Sticky viewport — sticks below the navbar for the full scroll journey */}
      <div
        ref={viewportRef}
        className="sticky top-16 flex h-[calc(100vh-4rem)] items-start justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setOverText(false); setCursorPixel(null) }}
      >
        <GooeyFilter id="gooey-hero-trail" strength={5} />

        {/* Pixel trail layer */}
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

        {/* Text block — translates top → bottom as user scrolls */}
        <motion.div
          ref={contentRef}
          style={{ y }}
          className="pointer-events-none relative z-10 flex w-full max-w-3xl flex-col items-center px-6 pt-8 text-center"
        >
          <motion.p
            style={{ y: eyebrowY, opacity: eyebrowOpacity }}
            className="font-pixel text-xl tracking-widest text-(--accent) md:text-2xl"
          >
            &gt; full_stack_software_engineer
          </motion.p>

          {/* Name grows independently */}
          <motion.div
            style={{ scale: nameScale }}
            className="mt-6 origin-center"
          >
            <TextDisperse
              dispersed={nameDispersed}
              className="text-6xl font-semibold tracking-tight text-(--fg) md:text-8xl"
            >
              Ding Ren
            </TextDisperse>
          </motion.div>

          <motion.p
            style={{ y: descY, opacity: descOpacity }}
            className="mt-6 max-w-sm text-sm leading-relaxed text-(--fg-muted)"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
